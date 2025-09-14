import React from "react";
import { bullpen } from "./pitcherInstance"; // bullpen arms

function Bullpen({ activePitcher, setActivePitcher, extraBullpen = [] }) {
  const allPitchers = [...bullpen, ...extraBullpen];

  return (
    <div>
      <p>
        Current Pitcher:{" "}
        {activePitcher ? activePitcher.name : "No active pitcher selected"}
      </p>
      <ul>
        {allPitchers.map((p) => (
          <li key={p.name}>
            {p.name} (Vel {p.velocity}, Ctrl {p.control}, Sta {p.stamina}) |{" "}
            Pitches: {p.repertoire.join(", ")}
            {(!activePitcher || activePitcher.name !== p.name) && (
              <button
                onClick={() => setActivePitcher(p)}
                style={{ marginLeft: "10px" }}
              >
                Put In
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Bullpen;
