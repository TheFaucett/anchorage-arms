// sim.js

// -------------------- Pitch Type Aliases --------------------
const pitchTypeMap = {
  fastball: ["ff", "fastball", "fb", "heater", "four-seam"],
  curveball: ["cu", "curve", "curveball", "12-6"],
  slider: ["sl", "slider"],
  changeup: ["ch", "change", "changeup"],
  cutter: ["ct", "cutter", "cut"],
  sinker: ["si", "sinker", "two-seam", "2s"],
  splitter: ["sp", "splitter", "split"],
  knuckleball: ["knuck", "knuckle", "kb"],
  screwball: ["sc", "screw", "screwball"],
};

// -------------------- Parser --------------------
export function parsePitchCommand(command) {
  const words = command.toLowerCase().split(/\s+/);

  let pitchType = "fastball";
  for (const [type, aliases] of Object.entries(pitchTypeMap)) {
    if (words.some((w) => aliases.includes(w))) {
      pitchType = type;
      break;
    }
  }

  return { pitchType };
}

// -------------------- Location Helper --------------------
function pickLocation(outcome, pitchType) {
  // 5x5 grid, inner 3x3 is strike zone
  if (outcome === "Ball") {
    const outerOptions = [
      { row: 0, col: 2 },
      { row: 4, col: 2 },
      { row: 2, col: 0 },
      { row: 2, col: 4 },
      { row: 0, col: 0 },
      { row: 0, col: 4 },
      { row: 4, col: 0 },
      { row: 4, col: 4 },
    ];
    return outerOptions[Math.floor(Math.random() * outerOptions.length)];
  }

  // Bias by pitch type for strikes
  if (pitchType === "curveball") {
    return { row: 3, col: 1 + Math.floor(Math.random() * 2) }; // low
  }
  if (pitchType === "slider") {
    return { row: 1 + Math.floor(Math.random() * 3), col: 3 }; // away
  }
  if (pitchType === "fastball") {
    return { row: Math.random() < 0.5 ? 0 : 1, col: 1 }; // up/mid
  }

  // Default: random inside zone
  return {
    row: 1 + Math.floor(Math.random() * 3),
    col: 1 + Math.floor(Math.random() * 3),
  };
}

// -------------------- Resolve Pitch --------------------
export function resolvePitch(
  pitcher,
  batter,
  count,
  pitchNumber,
  pitchCommand,
  lastPitchDetail
) {
  const fatigueFactor = Math.max(0, 1 - pitchNumber / (pitcher.stamina * 1.5));
  const adjControl =
    (pitcher.control + (pitcher.controlBoost || 0)) * fatigueFactor;
  const adjVelocity = pitcher.velocity * fatigueFactor;

  let probs = { strike: 0.35, ball: 0.3, foul: 0.15, contact: 0.2 };

  // Confidence
  const confFactor = (pitcher.confidence - 50) / 200;
  probs.strike += confFactor;
  probs.ball -= confFactor;

  // Batter effects
  probs.ball += (batter.discipline - 50) / 400;
  probs.contact += (batter.contact - 50) / 400;
  probs.strike -= (batter.contact - 50) / 400;

  // Pitcher effects
  probs.strike += (adjControl - 50) / 400;
  probs.contact -= (adjVelocity - 50) / 400;

  // Normalize
  let total = Object.values(probs).reduce((a, b) => a + b, 0);
  for (let k in probs) probs[k] /= total;

  const roll = Math.random();
  let outcome;
  if (roll < probs.strike) outcome = "Strike";
  else if (roll < probs.strike + probs.ball) outcome = "Ball";
  else if (roll < probs.strike + probs.ball + probs.foul) outcome = "Foul";
  else outcome = "InPlay";

  const { pitchType } = parsePitchCommand(pitchCommand);
  let location = pickLocation(outcome, pitchType);

  // Hot/Cold Zone Influence (only inside strike zone)
  if (location.row >= 1 && location.row <= 3 && location.col >= 1 && location.col <= 3) {
    const zoneRow = location.row - 1;
    const zoneCol = location.col - 1;
    const zone = batter.hotCold?.[zoneRow]?.[zoneCol] || "neutral";

    if (zone === "hot" && outcome === "Strike" && Math.random() < 0.5) {
      outcome = "InPlay";
    }
    if (zone === "cold" && outcome === "InPlay" && Math.random() < 0.4) {
      outcome = "Strike";
    }
  }

  // Velocity flavor
  const velo = Math.round(adjVelocity + (Math.random() * 4 - 2));
  let detail = "";
  if (outcome === "Strike") detail = `${pitchType} ${velo}mph — strike!`;
  else if (outcome === "Ball") detail = `${pitchType} misses at ${velo}mph`;
  else if (outcome === "Foul") detail = `${pitchType} at ${velo}mph fouled off`;
  else detail = `${pitchType} at ${velo}mph put in play`;

  return { outcome, detail, location };
}

// -------------------- Resolve Contact --------------------
export function resolveContact(batter) {
  const roll = Math.random();

  if (roll < 0.15 + batter.power / 500) return "Single";
  if (roll < 0.20 + batter.power / 500) return "Double";
  if (roll < 0.21 + batter.power / 800) return "Triple";
  if (roll < 0.24 + batter.power / 400) return "HomeRun";

  if (roll < 0.45) return "Groundout";
  if (roll < 0.65) return "Flyout";

  return "Lineout";
}
