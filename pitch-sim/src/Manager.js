// Manager.js
import React, { useState } from "react";
import { bullpen, rotation } from "./pitcherInstance";
import Pitcher from "./Pitcher";

function Manager({ activePitcher, setActivePitcher, lineup, setLineup }) {
  const [newPitcherName, setNewPitcherName] = useState("");
  const [role, setRole] = useState("Starter");

  // store as strings so user can type freely
  const [velocity, setVelocity] = useState("70");
  const [control, setControl] = useState("70");
  const [stamina, setStamina] = useState("80");
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

  // clamp helper
  const clamp = (value, [min, max]) =>
    Math.min(Math.max(parseInt(value) || min, min), max);

  const createPitcher = () => {
    if (!newPitcherName || repertoire.length === 0) {
      alert("Enter a name and select at least one pitch!");
      return;
    }

    // apply caps depending on role
    const caps =
      role === "Starter"
        ? { velocity: [65, 100], control: [50, 95], stamina: [60, 100] }
        : { velocity: [65, 100], control: [50, 85], stamina: [30, 60] };

    const newP = new Pitcher(
      newPitcherName,
      clamp(velocity, caps.velocity),
      clamp(control, caps.control),
      clamp(stamina, caps.stamina),
      repertoire
    );

    if (role === "Starter") {
      rotation.push(newP);
    } else {
      bullpen.push(newP);
    }

    // reset fields
    setNewPitcherName("");
    setVelocity("70");
    setControl("70");
    setStamina("80");
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
            <strong>{activePitcher.name}</strong> | Vel {activePitcher.velocity}, Ctrl{" "}
            {activePitcher.control}, Sta {activePitcher.stamina}
            <br />
            Pitches: {activePitcher.repertoire.join(", ")}
          </div>
        ) : (
          <p>No active pitcher selected</p>
        )}
      </div>

      {/* --- Rotation --- */}
      <div className="manager-section">
        <h3>Rotation</h3>
        {rotation.length > 0 ? (
          rotation.map((p, i) => (
            <div key={i} className="pitcher-card">
              <strong>{p.name}</strong> (Vel {p.velocity}, Ctrl {p.control}, Sta{" "}
              {p.stamina}) | Pitches: {p.repertoire.join(", ")}
              <button onClick={() => setActivePitcher(p)}>Put In</button>
            </div>
          ))
        ) : (
          <p>No starters yet</p>
        )}
      </div>

      {/* --- Bullpen --- */}
      <div className="manager-section">
        <h3>Bullpen</h3>
        {bullpen.length > 0 ? (
          bullpen.map((p, i) => (
            <div key={i} className="pitcher-card">
              <strong>{p.name}</strong> (Vel {p.velocity}, Ctrl {p.control}, Sta{" "}
              {p.stamina}) | Pitches: {p.repertoire.join(", ")}
              <button onClick={() => setActivePitcher(p)}>Put In</button>
            </div>
          ))
        ) : (
          <p>No bullpen arms yet</p>
        )}
      </div>

      {/* --- Lineup --- */}
      <div className="manager-section">
        <h3>Lineup</h3>
        {lineup.map((b, i) => (
          <div className="lineup-item" key={i}>
            #{i + 1} {b.name} (Con {b.contact}, Pow {b.power})
          </div>
        ))}
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
          type="text"
          value={velocity}
          onChange={(e) => setVelocity(e.target.value)}
        />

        <label>Control</label>
        <input
          type="text"
          value={control}
          onChange={(e) => setControl(e.target.value)}
        />

        <label>Stamina</label>
        <input
          type="text"
          value={stamina}
          onChange={(e) => setStamina(e.target.value)}
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
