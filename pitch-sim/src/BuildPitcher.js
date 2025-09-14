// BuildPitcher.js
import React, { useState } from "react";
import Pitcher from "./Pitcher";
import "./BuildPitcher.css";

/**
 * Show four-seam / sinker / cutter separately.
 * Internally we store canonical keys used by sim: "fastball", "sinker", "cutter".
 */
const DISPLAY_PITCHES = [
  "four-seam",   // ff
  "sinker",      // si
  "cutter",      // ct
  "curveball",
  "slider",
  "changeup",
  "splitter",
  "knuckleball",
  "screwball",
];

const displayToCanonical = {
  "four-seam": "fastball",
  sinker: "sinker",
  cutter: "cutter",
  curveball: "curveball",
  slider: "slider",
  changeup: "changeup",
  splitter: "splitter",
  knuckleball: "knuckleball",
  screwball: "screwball",
};

const starterCaps = {
  1: { velocity: [70, 100], control: [65, 95], stamina: [80, 100] },
  2: { velocity: [65, 95], control: [60, 90], stamina: [75, 95] },
  3: { velocity: [60, 90], control: [55, 85], stamina: [70, 90] },
  4: { velocity: [55, 85], control: [50, 80], stamina: [65, 85] },
  5: { velocity: [50, 80], control: [45, 75], stamina: [60, 80] },
};

const relieverCaps = { velocity: [65, 100], control: [50, 85], stamina: [30, 60] };

function BuildPitcher({ onCreate }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("starter");
  const [slot, setSlot] = useState(1);
  const [velocity, setVelocity] = useState(70);
  const [control, setControl] = useState(70);
  const [stamina, setStamina] = useState(80);
  const [selectedDisplay, setSelectedDisplay] = useState([]);

  const togglePitch = (displayName) => {
    setSelectedDisplay((prev) =>
      prev.includes(displayName)
        ? prev.filter((p) => p !== displayName)
        : [...prev, displayName]
    );
  };

  const caps = role === "starter" ? starterCaps[slot] : relieverCaps;
  const clamp = (val, [min, max]) => Math.min(Math.max(parseInt(val, 10), min), max);

  const createPitcher = () => {
    if (!name || selectedDisplay.length === 0) {
      alert("Enter a name and select at least one pitch!");
      return;
    }
    const repertoire = selectedDisplay.map((d) => displayToCanonical[d]);
    const p = new Pitcher(
      name,
      clamp(velocity, caps.velocity),
      clamp(control, caps.control),
      clamp(stamina, caps.stamina),
      repertoire,
      role
    );
    onCreate(p, role, slot);
    setName("");
    setSelectedDisplay([]);
  };

  return (
    <div className="bp-form">
      <h3>Build a New Pitcher</h3>

      <label>Pitcher Name</label>
      <input
        className="bp-input"
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Role</label>
      <select
        className="bp-select"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="starter">Starter</option>
        <option value="reliever">Reliever</option>
      </select>

      {role === "starter" && (
        <>
          <label>Rotation Slot</label>
          <select
            className="bp-select"
            value={slot}
            onChange={(e) => setSlot(parseInt(e.target.value, 10))}
          >
            <option value={1}>No. 1 Starter</option>
            <option value={2}>No. 2 Starter</option>
            <option value={3}>No. 3 Starter</option>
            <option value={4}>No. 4 Starter</option>
            <option value={5}>No. 5 Starter</option>
          </select>
        </>
      )}

      <label>Velocity (Cap {caps.velocity[0]}–{caps.velocity[1]})</label>
      <input
        className="bp-input"
        type="number"
        value={velocity}
        onChange={(e) => setVelocity(e.target.value)}
      />

      <label>Control (Cap {caps.control[0]}–{caps.control[1]})</label>
      <input
        className="bp-input"
        type="number"
        value={control}
        onChange={(e) => setControl(e.target.value)}
      />

      <label>Stamina (Cap {caps.stamina[0]}–{caps.stamina[1]})</label>
      <input
        className="bp-input"
        type="number"
        value={stamina}
        onChange={(e) => setStamina(e.target.value)}
      />

      <label>Select Repertoire</label>
      <div className="bp-rep-grid">
        {DISPLAY_PITCHES.map((d) => (
          <label key={d} className="bp-rep-item">
            <input
              type="checkbox"
              checked={selectedDisplay.includes(d)}
              onChange={() => togglePitch(d)}
            />
            {d === "four-seam" ? "four-seam (ff)" : d}
          </label>
        ))}
      </div>

      <button className="bp-create" onClick={createPitcher}>
        Create Pitcher
      </button>
    </div>
  );
}

export default BuildPitcher;
