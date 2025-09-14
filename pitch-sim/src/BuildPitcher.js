// BuildPitcher.js
import React, { useState } from "react";
import Pitcher from "./Pitcher";

const allPitches = [
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
  const [slot, setSlot] = useState(1); // default No. 1 starter
  const [velocity, setVelocity] = useState(70);
  const [control, setControl] = useState(70);
  const [stamina, setStamina] = useState(80);
  const [repertoire, setRepertoire] = useState([]);

  const togglePitch = (pitch) => {
    setRepertoire((prev) =>
      prev.includes(pitch) ? prev.filter((p) => p !== pitch) : [...prev, pitch]
    );
  };

  const caps = role === "starter" ? starterCaps[slot] : relieverCaps;
  const clamp = (value, [min, max]) => Math.min(Math.max(value, min), max);

  const createPitcher = () => {
    if (!name || repertoire.length === 0) {
      alert("Enter a name and select at least one pitch!");
      return;
    }

    const newPitcher = new Pitcher(
      name,
      clamp(parseInt(velocity), caps.velocity),
      clamp(parseInt(control), caps.control),
      clamp(parseInt(stamina), caps.stamina),
      repertoire,
      role
    );

    // ✅ actually call parent
    onCreate(newPitcher, role, slot);

    // reset form
    setName("");
    setVelocity(70);
    setControl(70);
    setStamina(80);
    setRepertoire([]);
  };

  return (
    <div className="build-box">
      <h3>Build a New Pitcher</h3>

      <input
        type="text"
        placeholder="Pitcher Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div>
        Role:{" "}
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="starter">Starter</option>
          <option value="reliever">Reliever</option>
        </select>
      </div>

      {role === "starter" && (
        <div>
          Rotation Slot:{" "}
          <select value={slot} onChange={(e) => setSlot(parseInt(e.target.value))}>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                No. {n} Starter
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        Velocity:{" "}
        <input
          type="number"
          value={velocity}
          onChange={(e) => setVelocity(e.target.value)}
        />
        (Cap {caps.velocity[0]}–{caps.velocity[1]})
      </div>

      <div>
        Control:{" "}
        <input
          type="number"
          value={control}
          onChange={(e) => setControl(e.target.value)}
        />
        (Cap {caps.control[0]}–{caps.control[1]})
      </div>

      <div>
        Stamina:{" "}
        <input
          type="number"
          value={stamina}
          onChange={(e) => setStamina(e.target.value)}
        />
        (Cap {caps.stamina[0]}–{caps.stamina[1]})
      </div>

      <p>Select Repertoire:</p>
      {allPitches.map((pitch) => (
        <label key={pitch}>
          <input
            type="checkbox"
            checked={repertoire.includes(pitch)}
            onChange={() => togglePitch(pitch)}
          />
          {pitch}
        </label>
      ))}

      <button className="create-btn" onClick={createPitcher}>
        Create Pitcher
      </button>
    </div>
  );
}

export default BuildPitcher;
