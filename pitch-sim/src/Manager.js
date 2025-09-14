// Manager.js
import React, { useState } from "react";
import { bullpen, rotation } from "./pitcherInstance";
import Pitcher from "./Pitcher";

function Manager({ activePitcher, setActivePitcher, lineup, setLineup }) {
  const [newPitcherName, setNewPitcherName] = useState("");
  const [role, setRole] = useState("Starter");
  const [velocity, setVelocity] = useState(70);
  const [control, setControl] = useState(70);
  const [stamina, setStamina] = useState(80);
  const [repertoire, setRepertoire] = useState([]);

  const repertoireOptions = [
    "fastball",
    "curveball",
    "slider",
    "changeup",
    "cutter",
    "sinker",
    "splitter",
    "knuckleball",
    "screwball",
  ];

  const togglePitch = (pitch) => {
    setRepertoire((prev) =>
      prev.includes(pitch)
        ? prev.filter((p) => p !== pitch)
        : [...prev, pitch]
    );
  };

  const createPitcher = () => {
    if (!newPitcherName || repertoire.length === 0) return;

    const newP = new Pitcher(
      newPitcherName,
      velocity,
      control,
      stamina,
      repertoire
    );

    if (role === "Starter") {
      rotation.push(newP);
    } else {
      bullpen.push(newP);
    }

    setNewPitcherName("");
    setVelocity(70);
    setControl(70);
    setStamina(80);
    setRepertoire([]);
  };

  return (
    <div className="manager-container">
      <h2>Manager Mode</h2>

      {/* --- Active Pitcher --- */}
      <div className="manager-section">
        <h3>Current Pitcher</h3>
        {activePitcher ? (
          <div className="pitcher-card">
            <span>
              <strong>{activePitcher.name}</strong> | Vel {activePitcher.velocity}, Ctrl{" "}
              {activePitcher.control}, Sta {activePitcher.stamina}
              <br />
              Pitches: {activePitcher.repertoire.join(", ")}
            </span>
          </div>
        ) : (
          <p>No active pitcher selected</p>
        )}
      </div>

      {/* --- Bullpen --- */}
      <div className="manager-section">
        <h3>Bullpen</h3>
        {bullpen.map((p, i) => (
          <div className="pitcher-card" key={i}>
            <span>
              <strong>{p.name}</strong> (Vel {p.velocity}, Ctrl {p.control}, Sta{" "}
              {p.stamina}) | Pitches: {p.repertoire.join(", ")}
            </span>
            <button onClick={() => setActivePitcher(p)}>Put In</button>
          </div>
        ))}
      </div>

      {/* --- Lineup --- */}
      <div className="manager-section">
        <h3>Lineup</h3>
        <div className="lineup-list">
          {lineup.map((b, i) => (
            <div className="lineup-item" key={i}>
              <span>
                #{i + 1} {b.name}
              </span>
              <span>(Con {b.contact}, Pow {b.power})</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- Build a New Pitcher --- */}
      <div className="create-pitcher-form">
        <h4>Build a New Pitcher</h4>

        <label>Pitcher Name</label>
        <input
          type="text"
          value={newPitcherName}
          onChange={(e) => setNewPitcherName(e.target.value)}
          placeholder="Enter name"
        />

        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Starter">Starter</option>
          <option value="Reliever">Reliever</option>
        </select>

        <label>Velocity</label>
        <input
          type="number"
          value={velocity}
          onChange={(e) => setVelocity(Number(e.target.value))}
          min="65"
          max="100"
        />

        <label>Control</label>
        <input
          type="number"
          value={control}
          onChange={(e) => setControl(Number(e.target.value))}
          min="50"
          max="95"
        />

        <label>Stamina</label>
        <input
          type="number"
          value={stamina}
          onChange={(e) => setStamina(Number(e.target.value))}
          min="40"
          max="100"
        />

        <label>Repertoire</label>
        <div className="repertoire-options">
          {repertoireOptions.map((pitch) => (
            <label key={pitch}>
              <input
                type="checkbox"
                checked={repertoire.includes(pitch)}
                onChange={() => togglePitch(pitch)}
              />
              {pitch}
            </label>
          ))}
        </div>

        <button onClick={createPitcher}>Create Pitcher</button>
      </div>
    </div>
  );
}

export default Manager;
