class Vector {
  /**
   * @param {object|number} point Either the x co-ord, or an object with properties x and y
   * @param {number} point.x The x co-ord of the point
   * @param {number} point.y The y co-ord of the point
   * @param {number} [y] The y co-ord of the point
   */
  constructor(point, y) {
    let x = point;
    if(typeof point === "object") {
      x = point.x;
      y = point.y;
    }
    Object.defineProperties(this, {
      "x": {
        value: x,
        configurable: false,
        enumerable: true,
        writable: false
      },
      "y": {
        value: y,
        configurable: false,
        enumerable: true,
        writable: false
      },
      "magnitude": {
        value: Math.sqrt(x*x + y*y),
        configurable: false,
        enumerable: true,
        writable: false
      },
      "angle": {
        value: Math.atan2(y, x),
        configurable: false,
        enumerable: true,
        writable: false
      }
    });//Define immutable properties
  }
  add(...vec) {
    let x = this.x || 0;//Allow calling via Vector.add()
    let y = this.y || 0;
    vec.forEach((v) => {
      x += v.x;
      y += v.y;
    });
    return new Vector(x, y);
  }
  subtract(...vec) {
    return Vector.add(this, ...vec.map((v) => Vector.invert(v)));//Allow calling via Vector.subtract()
  }
  invert() {
    return new Vector(-this.x, -this.y);
  }
  scale(mult) {
    return Vector.dot(this, {x: mult, y: mult});//Allow calling via Vector.scale()
  }
  dot(...vec) {
    let x = this.x === undefined ? 1 : this.x;//Allow calling via Vector.add()
    let y = this.y === undefined ? 1 : this.y;
    vec.forEach((v) => {
      x *= v.x;
      y *= v.y;
    });
    return new Vector(x, y);
  }
}
Vector.add = (...vec) => Vector.prototype.add.call(...vec);
Vector.subtract = (vec, ...sub) => Vector.prototype.subtract.call(vec, ...sub);
Vector.invert = (vec) => Vector.prototype.invert.call(vec);
Vector.scale = (vec, mult) => Vector.prototype.scale.call(vec);
Vector.dot = (...vec) => Vector.prototype.dot.call(...vec);
