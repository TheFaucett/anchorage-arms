import React from "react";
import { rotation, bullpen } from "./pitcherInstance";

function TeamScreen({ activePitcher, setActivePitcher }) {
  return (
    <div style={{ marginTop: 20 }}>
      <h2>Team Overview</h2>

      <h3>Starting Rotation</h3>
      {rotation.length === 0 ? (
        <p>No starters in rotation. Add pitchers later.</p>
      ) : (
        <ul>
          {rotation.map((p) => (
            <li key={p.name}>
              {p.name} | Vel {p.velocity}, Ctrl {p.control}, Sta {p.stamina} | 
              Rest: {p.daysRest} day(s) | Role: {p.role}
              <br />
              <strong>Pitches:</strong> {p.repertoire.join(", ")}
              {p.isEligibleStarter() ? (
                <button
                  style={{ marginLeft: "10px" }}
                  onClick={() => {
                    setActivePitcher(p);
                    p.pitchGame(); // mark as pitched today
                  }}
                >
                  Start Today
                </button>
              ) : (
                <span style={{ marginLeft: "10px", color: "gray" }}>
                  Needs {Math.max(0, 4 - p.daysRest)} more day(s)
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      <h3>Bullpen</h3>
      <ul>
        {bullpen.map((p) => (
          <li key={p.name}>
            {p.name} | Vel {p.velocity}, Ctrl {p.control}, Sta {p.stamina} | 
            Role: {p.role}
            <br />
            <strong>Pitches:</strong> {p.repertoire.join(", ")}
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => setActivePitcher(p)}
            >
              Put In
            </button>
          </li>
        ))}
      </ul>

      <h3>Current Pitcher</h3>
      <p>
        {activePitcher
          ? `${activePitcher.name} (Vel ${activePitcher.velocity}, Ctrl ${activePitcher.control}, Sta ${activePitcher.stamina})`
          : "No active pitcher"}
      </p>
      {activePitcher && (
        <p>
          <strong>Available Pitches:</strong>{" "}
          {activePitcher.repertoire.join(", ")}
        </p>
      )}
    </div>
  );
}

export default TeamScreen;
