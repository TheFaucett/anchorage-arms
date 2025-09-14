// App.js
import React, { useState, useEffect } from "react";
import { handlePitch } from "./gameLogic";
import { awayLineup } from "./lineups";
import StrikeZone from "./StrikeZone";
import Manager from "./Manager";
import TeamScreen from "./TeamScreen";
import { savePitchers, loadPitchers } from "./storage"; // ✅ persistence helpers
import "./App.css";

function App() {
  const [mode, setMode] = useState("game");

  // ✅ load saved pitchers on startup
  const { rotation: savedRotation, bullpen: savedBullpen } = loadPitchers();
  const [rotation, setRotation] = useState(savedRotation);
  const [bullpen, setBullpen] = useState(savedBullpen);

  const [activePitcher, setActivePitcher] = useState(savedRotation[0] || null);

  const [gameState, setGameState] = useState({
    inning: 1,
    half: "top",
    outs: 0,
    bases: [false, false, false],
    score: { home: 0, away: 0 },
    count: { balls: 0, strikes: 0 },
    awayLineup: JSON.parse(JSON.stringify(awayLineup)),
    awayBatterIndex: 0,
    pitchCount: 0,
    lastPlay: "",
    lastPitchDetail: null,
    lastPitchLocation: null,
    gameOver: false,
  });

  const [pitchCommand, setPitchCommand] = useState("");

  // ✅ save whenever rotation/bullpen changes
  useEffect(() => {
    savePitchers(rotation, bullpen);
  }, [rotation, bullpen]);

  // --- Pitch calling ---
  const callPitch = () => {
    if (!gameState.gameOver && pitchCommand.trim() && activePitcher) {
      setGameState((state) => handlePitch(state, activePitcher, pitchCommand));
      setPitchCommand("");
    }
  };

  // --- Reset for New Game ---
  const newGame = () => {
    rotation.forEach((p) => p.restDay && p.restDay());
    bullpen.forEach((p) => p.restDay && p.restDay());

    setGameState({
      inning: 1,
      half: "top",
      outs: 0,
      bases: [false, false, false],
      score: { home: 0, away: 0 },
      count: { balls: 0, strikes: 0 },
      awayLineup: JSON.parse(JSON.stringify(awayLineup)),
      awayBatterIndex: 0,
      pitchCount: 0,
      lastPlay: "",
      lastPitchDetail: null,
      lastPitchLocation: null,
      gameOver: false,
    });
  };

  return (
    <div className="app-container">
      <h1 className="title">⚾ Pitch Caller</h1>

      {/* Menu Bar */}
      <div className="menu-bar">
        <button
          className={`menu-button ${mode === "game" ? "active" : ""}`}
          onClick={() => setMode("game")}
        >
          Game
        </button>
        <button
          className={`menu-button ${mode === "manager" ? "active" : ""}`}
          onClick={() => setMode("manager")}
        >
          Manager
        </button>
        <button
          className={`menu-button ${mode === "team" ? "active" : ""}`}
          onClick={() => setMode("team")}
        >
          Team
        </button>
        <button className="menu-button new-game" onClick={newGame}>
          New Game
        </button>
      </div>

      {/* Game Mode */}
      {mode === "game" && (
        <>
          <div className="game-info">
            <h2>
              Inning {gameState.inning} ({gameState.half})
            </h2>
            <div className="score-line">
              Away {gameState.score.away} — Home {gameState.score.home}
            </div>

            {/* Count Display */}
            <div className="count-box">
              {[...Array(3)].map((_, i) => (
                <div
                  key={`ball-${i}`}
                  className={`count-circle ${
                    i < gameState.count.balls ? "count-ball" : ""
                  }`}
                >
                  B
                </div>
              ))}
              {[...Array(2)].map((_, i) => (
                <div
                  key={`strike-${i}`}
                  className={`count-circle ${
                    i < gameState.count.strikes ? "count-strike" : ""
                  }`}
                >
                  S
                </div>
              ))}
              {[...Array(3)].map((_, i) => (
                <div
                  key={`out-${i}`}
                  className={`count-circle ${
                    i < gameState.outs ? "count-out" : ""
                  }`}
                >
                  O
                </div>
              ))}
            </div>

            {/* Bases Display */}
            <div className="bases">
              <div
                className={`base second ${
                  gameState.bases[1] ? "occupied" : ""
                }`}
              ></div>
              <div className="bases-row">
                <div
                  className={`base third ${
                    gameState.bases[2] ? "occupied" : ""
                  }`}
                ></div>
                <div
                  className={`base first ${
                    gameState.bases[0] ? "occupied" : ""
                  }`}
                ></div>
              </div>
              <div className="base home"></div>
            </div>
          </div>

          {/* Strike Zone */}
          <StrikeZone pitchLocation={gameState.lastPitchLocation} />

          {/* Pitch Input */}
          {!gameState.gameOver && (
            <div className="pitch-input">
              <input
                type="text"
                value={pitchCommand}
                placeholder="Type pitch (e.g., 'ff up in', 'cu low away')"
                onChange={(e) => setPitchCommand(e.target.value)}
              />
              <button className="call-button" onClick={callPitch}>
                Call Pitch
              </button>
            </div>
          )}

          {gameState.gameOver && <h2>Game Over</h2>}

          <div className="log-box">
            <h3>Last Play</h3>
            <p>{gameState.lastPlay || "—"}</p>
          </div>
        </>
      )}

      {/* Manager Mode */}
      {mode === "manager" && (
        <Manager
          rotation={rotation}
          setRotation={setRotation}
          bullpen={bullpen}
          setBullpen={setBullpen}
          activePitcher={activePitcher}
          setActivePitcher={setActivePitcher}
          lineup={gameState.awayLineup}
          setLineup={(newLineup) =>
            setGameState((state) => ({ ...state, awayLineup: newLineup }))
          }
        />
      )}

      {/* Team Mode */}
      {mode === "team" && (
        <TeamScreen
          activePitcher={activePitcher}
          setActivePitcher={setActivePitcher}
          rotation={rotation}
          bullpen={bullpen}
        />
      )}
    </div>
  );
}

export default App;
