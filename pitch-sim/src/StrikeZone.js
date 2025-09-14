// StrikeZone.js
import React from "react";

function StrikeZone({ pitchLocation, outcome }) {
  // 5x5 grid
  const grid = Array(5)
    .fill(null)
    .map(() => Array(5).fill(""));

  let r = null, c = null;

  if (pitchLocation && typeof pitchLocation === "object") {
    // Expecting { row, col } from sim (0–4)
    r = pitchLocation.row;
    c = pitchLocation.col;
  }

  if (r !== null && c !== null) {
    grid[r][c] = "⚾";
  }

  return (
    <div style={{ display: "inline-block", marginTop: "15px" }}>
      {grid.map((row, rIdx) => (
        <div key={rIdx} style={{ display: "flex" }}>
          {row.map((cell, cIdx) => {
            const isStrikeZone =
              rIdx >= 1 && rIdx <= 3 && cIdx >= 1 && cIdx <= 3; // inner 3x3

            return (
              <div
                key={cIdx}
                style={{
                  width: "35px",
                  height: "35px",
                  border: "1px solid black",
                  backgroundColor: isStrikeZone ? "#f0f0f0" : "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                }}
              >
                {cell}
              </div>
            );
          })}
        </div>
      ))}
      <p style={{ fontSize: "14px", marginTop: "5px" }}>
        Last pitch: {outcome || "—"}
      </p>
    </div>
  );
}

export default StrikeZone;
