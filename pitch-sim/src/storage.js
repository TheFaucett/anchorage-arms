import Pitcher from "./Pitcher";

export function savePitchers(rotation, bullpen) {
  const data = {
    rotation: rotation.map((p) => p.toJSON()),
    bullpen: bullpen.map((p) => p.toJSON()),
  };
  localStorage.setItem("pitchers", JSON.stringify(data));
}

export function loadPitchers() {
  const saved = localStorage.getItem("pitchers");
  if (!saved) return { rotation: [], bullpen: [] };

  try {
    const { rotation, bullpen } = JSON.parse(saved);
    return {
      rotation: rotation.map((p) => Pitcher.fromJSON(p)),
      bullpen: bullpen.map((p) => Pitcher.fromJSON(p)),
    };
  } catch (err) {
    console.error("Error loading pitchers:", err);
    return { rotation: [], bullpen: [] };
  }
}
