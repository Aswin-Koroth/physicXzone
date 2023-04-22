class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    let x = this.x + v.x;
    let y = this.y + v.y;
    return new Vector(x, y);
  }

  sub(v) {
    let x = this.x - v.x;
    let y = this.y - v.y;
    return new Vector(x, y);
  }

  mul(c) {
    return new Vector(this.x * c, this.y * c);
  }

  dotProduct(v) {
    return this.x * v.x + this.y * v.y;
  }

  unit() {
    if (this.magnitude() == 0) return this;
    let x = this.x / this.magnitude();
    let y = this.y / this.magnitude();
    return new Vector(x, y);
  }

  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
}
