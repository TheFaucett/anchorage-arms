// gameLogic.js
import { parsePitchCommand, resolvePitch, resolveContact } from "./sim";

// --- Helpers ---
const cloneState = (s) => ({
  ...s,
  count: { ...s.count },
  bases: [...s.bases],
  score: { ...s.score },
  momentum: s.momentum ? { ...s.momentum } : { pitcher: 0, batter: 0 },
});

const resetCount = (s) => {
  s.count = { balls: 0, strikes: 0 };
};

function nextBatter(s) {
  s.awayBatterIndex = (s.awayBatterIndex + 1) % s.awayLineup.length;
}

function nextHalfInning(s) {
  const ns = cloneState(s);
  ns.half = "top";
  ns.inning += 1;
  ns.outs = 0;
  ns.bases = [false, false, false];
  resetCount(ns);
  return ns;
}

function advanceRunners(s, hitType) {
  let [b1, b2, b3] = s.bases;
  let runs = 0;

  if (hitType === "Walk") {
    if (b1 && b2 && b3) runs++;
    if (b2 && b3) b3 = true;
    if (b1 && b2) b2 = true;
    b1 = true;
  }
  if (hitType === "Single") {
    if (b3) runs++;
    b3 = b2;
    b2 = b1;
    b1 = true;
  }
  if (hitType === "Double") {
    if (b3) runs++;
    if (b2) runs++;
    b3 = b1;
    b2 = true;
    b1 = false;
  }
  if (hitType === "Triple") {
    if (b1) runs++;
    if (b2) runs++;
    if (b3) runs++;
    b3 = true;
    b2 = b1 = false;
  }
  if (hitType === "HomeRun") {
    if (b1) runs++;
    if (b2) runs++;
    if (b3) runs++;
    runs++;
    b1 = b2 = b3 = false;
  }

  s.bases = [b1, b2, b3];
  s.score.away += runs;
}

// --- Main pitch-by-pitch logic ---
export function handlePitch(state, pitcher, pitchCommand) {
  let ns = cloneState(state);

  if (ns.inning > 9) {
    ns.gameOver = true;
    ns.lastPlay = "Game Over!";
    return ns;
  }

  const batter = ns.awayLineup[ns.awayBatterIndex];
  ns.pitchCount = (ns.pitchCount || 0) + 1;

  const { pitchType } = parsePitchCommand(pitchCommand);

  const { outcome, detail, location } = pitcher.repertoire.includes(pitchType)
    ? resolvePitch(
        pitcher,
        batter,
        ns.count,
        ns.pitchCount,
        pitchCommand,
        ns.lastPitchDetail
      )
    : {
        outcome: "Ball",
        detail: `Illegal pitch (${pitchType}) — counts as Ball`,
        location: { row: 2, col: 4 },
      };

  ns.lastPitchDetail = detail;
  ns.lastPitchLocation = location;

  // --- Handle outcome ---
  if (outcome === "Strike" || outcome === "Foul") {
    if (outcome === "Foul" && ns.count.strikes >= 2) {
      ns.lastPlay = `${batter.name}: ${detail} (count stays)`;
    } else {
      ns.count.strikes++;
      if (ns.count.strikes >= 3) {
        ns.outs++;
        ns.lastPlay = `${batter.name}: Strikeout!`;
        resetCount(ns);
        nextBatter(ns);
      } else {
        ns.lastPlay = `${batter.name}: ${detail} (${ns.count.balls}-${ns.count.strikes})`;
      }
    }
  } else if (outcome === "Ball") {
    ns.count.balls++;
    if (ns.count.balls >= 4) {
      advanceRunners(ns, "Walk");
      ns.lastPlay = `${batter.name}: Walk`;
      resetCount(ns);
      nextBatter(ns);
    } else {
      ns.lastPlay = `${batter.name}: ${detail} (${ns.count.balls}-${ns.count.strikes})`;
    }
  } else if (outcome === "InPlay") {
    const contact = resolveContact(batter);
    if (["Single", "Double", "Triple", "HomeRun"].includes(contact)) {
      advanceRunners(ns, contact);
      ns.lastPlay = `${batter.name}: ${detail} → ${contact}`;
    } else {
      ns.outs++;
      ns.lastPlay = `${batter.name}: ${detail} → ${contact}`;
    }
    resetCount(ns);
    nextBatter(ns);
  }

  if (ns.outs >= 3) {
    ns = nextHalfInning(ns);
    ns.lastPlay = "Side retired!";
  }

  return ns;
}

// --- Quick sim half inning ---
export function simulateHalfInning(state, pitcher) {
  let ns = cloneState(state);
  let results = [];

  while (ns.outs < 3) {
    const batter = ns.awayLineup[ns.awayBatterIndex];
    const roll = Math.random();

    if (roll < 0.3) {
      ns.outs++;
      results.push(`${batter.name}: Out`);
    } else if (roll < 0.6) {
      advanceRunners(ns, "Single");
      results.push(`${batter.name}: Single`);
    } else if (roll < 0.75) {
      advanceRunners(ns, "Double");
      results.push(`${batter.name}: Double`);
    } else if (roll < 0.9) {
      advanceRunners(ns, "Walk");
      results.push(`${batter.name}: Walk`);
    } else {
      advanceRunners(ns, "HomeRun");
      results.push(`${batter.name}: Home Run!`);
    }

    nextBatter(ns);
  }

  ns = nextHalfInning(ns);
  ns.lastPlay = `Half inning over. Plays: ${results.join(", ")}`;
  return ns;
}


// --- Momentum tracking ---
export function applyMomentum(state, result) {
  state.momentum = state.momentum || { pitcher: 0, batter: 0 };

  if (result.includes("Strikeout")) {
    state.momentum.pitcher++;
  } else if (result.includes("HomeRun") || result.includes("Double")) {
    state.momentum.batter++;
  } else {
    state.momentum.pitcher *= 0.9;
    state.momentum.batter *= 0.9;
  }

  return state.momentum;
}

// --- Managerial decisions ---
export function intentionalWalk(state, batter) {
  advanceRunners(state, "Walk", batter);
  state.lastPlay = `${batter.name}: Intentionally Walked`;
  nextBatter(state);
  resetCount(state);
  return state;
}

export function moundVisit(pitcher) {
  pitcher.controlBoost = (pitcher.controlBoost || 0) + 5;
  return `${pitcher.name} gets a mound visit (control +5 this batter).`;
}

export function warmUpReliever(reliever) {
  reliever.isWarm = true;
  return `${reliever.name} is warming up in the bullpen.`;
}
