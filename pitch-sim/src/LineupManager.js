import React from "react";

function LineupManager({ lineup, setLineup }) {
  const moveUp = (index) => {
    if (index === 0) return;
    const newLineup = [...lineup];
    [newLineup[index - 1], newLineup[index]] = [newLineup[index], newLineup[index - 1]];
    setLineup(newLineup);
  };

  const moveDown = (index) => {
    if (index === lineup.length - 1) return;
    const newLineup = [...lineup];
    [newLineup[index + 1], newLineup[index]] = [newLineup[index], newLineup[index + 1]];
    setLineup(newLineup);
  };

  return (
    <div>
      <ul>
        {lineup.map((batter, i) => (
          <li key={batter.name}>
            #{i + 1} {batter.name} (Con {batter.contact}, Pow {batter.power})
            <button onClick={() => moveUp(i)} style={{ marginLeft: "10px" }}>
              ↑
            </button>
            <button onClick={() => moveDown(i)} style={{ marginLeft: "5px" }}>
              ↓
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LineupManager;
