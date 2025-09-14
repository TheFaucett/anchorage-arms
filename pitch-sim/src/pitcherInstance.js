import Pitcher from "./Pitcher";

// Rotation starts empty – you’ll add pitchers manually
export const rotation = [];

// Pre-populated bullpen for now
export const bullpen = [
  new Pitcher("Lefty Reliever", 65, 70, 50, ["fastball", "slider", "cutter"], "reliever"),
  new Pitcher("Power Closer", 80, 60, 40, ["fastball", "slider", "splitter"], "reliever"),
  new Pitcher("Knuckle Specialist", 50, 40, 70, ["knuckleball", "fastball"], "reliever"),
];
