// Pitcher.js
class Pitcher {
  constructor(name, velocity, control, stamina, repertoire, role = "starter") {
    this.name = name;
    this.velocity = velocity;
    this.control = control;
    this.stamina = stamina;
    this.repertoire = repertoire;
    this.role = role;
    this.rest = 0;
    this.confidence = 75;
  }

  restDay() {
    if (this.rest > 0) this.rest--;
  }

  // 🔹 Serialize to plain object
  toJSON() {
    return {
      name: this.name,
      velocity: this.velocity,
      control: this.control,
      stamina: this.stamina,
      repertoire: this.repertoire,
      role: this.role,
      rest: this.rest,
      confidence: this.confidence,
    };
  }

  // 🔹 Rebuild a Pitcher from JSON
  static fromJSON(obj) {
    const p = new Pitcher(
      obj.name,
      obj.velocity,
      obj.control,
      obj.stamina,
      obj.repertoire,
      obj.role
    );
    p.rest = obj.rest || 0;
    p.confidence = obj.confidence ?? 75;
    return p;
  }
}

export default Pitcher;
