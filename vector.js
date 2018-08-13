"use strict"

class Vector {
  /**
   * @param {object|number} point Either the x co-ord, or an object with properties x and y
   * @param {number} point.x The x co-ord of the point
   * @param {number} point.y The y co-ord of the point
   * @param {number} [y] The y co-ord of the point
   */
  constructor(point, y, immutable=false) {
    let x = point;
    if(typeof point === "object") {
      x = point.x;
      y = point.y;
    }
    if(isNaN(x) || isNaN(y)) {
      throw new Error(`Both x: (${x}) and y: (${y}) must be numeric in a vector`);
    }
    let baseDescript = ["x", "y", "magnitude", "angle"].reduce((obj, key) => {
      obj[key] = Object.assign({
        configurable: false,
        enumerable: true
      }, immutable ? {writable: false} : {});
      return obj;
    }, {});
    let propDescript;
    if(immutable) {//Define immutable properties
      propDescript = {
        x: {value: x},
        y: {value: y},
        magnitude: {value: Math.sqrt(x*x + y*y)},
        angle: {value: Math.atan2(y, x)},
      };
    } else {
      //Mutable vars
      let dirtyMag = true;
      let dirtyAng = true;
      let cachedMag;
      let cachedAng;
      propDescript = {
        x: {
          get() {
            return x;
          },
          set(val) {
            x = val;
            dirtyMag = dirtyAng = true;
          }
        },
        y: {
          get() {
            return y;
          },
          set(val) {
            y = val;
            dirtyMag = dirtyAng = true;
          }
        },
        magnitude: {
          get() {
            if(dirtyMag) {
              cachedMag = Math.sqrt(x*x + y*y);
              dirtyMag = false;
            }
            return cachedMag;
          },
          set(val) {
            this.scale(val / this.magnitude);
          }
        },
        angle: {
          get() {
            if(dirtyAng) {
              cachedAng = Math.atan2(y, x);
              dirtyAng = false;
            }
            return cachedAng;
          },
          set(a) {
            this.rotate(a - this.angle);
          }
        }
      };
    }
    Object.keys(baseDescript).forEach((k) => {
      Object.defineProperty(this, k, Object.assign({}, baseDescript[k], propDescript[k]));
    });
    Object.defineProperty(this, "immutable", {
      value: !!immutable,
      configurable: false,
      enumerable: false
    });
  }
  __getUpdated(x, y) {
    if(this.immutable) {
      return new Vector(x, y);
    } else {
      this.x = x;
      this.y = y;
      return this;
    }
  }
  toString(listMagAng) {
    return `Vector{x: ${this.x}, y: ${this.y + (listMagAng ? `, magnitude: ${this.magnitude}, angle: ${this.angle}` : "")}}`;
  }
  add(...vec) {
    let x = this.x || 0;//Allow calling via Vector.add()
    let y = this.y || 0;
    vec.forEach((v) => {
      x += v.x;
      y += v.y;
    });
    return this.__getUpdated(x, y);
  }
  subtract(...vec) {
    return Vector.add(this, ...vec.map(Vector.invert));//Allow calling via Vector.subtract()
  }
  invert() {
    return this.__getUpdated(-this.x, -this.y);
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
    return this.__getUpdated(x, y);
  }
  unit() {
    return this.scale(1 / this.magnitude);
  }
  rotate(angle) {
    let mag = this.magnitude;
    let ang = this.angle;
    let x = Math.cos(ang + angle);
    let y = Math.sin(ang + angle);
    return this.__getUpdated(x, y);
  }
}
Vector.Mutable = class extends Vector {
  constructor(point, y) {
    super(point, y, false);
  }
}
Vector.Immutable = class extends Vector {
  constructor(point, y) {
    super(point, y, true);
  }
}

Vector.add = (...vec) => Vector.prototype.add.call(...vec);
Vector.subtract = (vec, ...sub) => Vector.prototype.subtract.call(vec, ...sub);
Vector.invert = (vec) => Vector.prototype.invert.call(vec);
Vector.scale = (vec, mult) => Vector.prototype.scale.call(vec, mult);
Vector.dot = (...vec) => Vector.prototype.dot.call(...vec);
Vector.magnitude = function(vec) {
  return new Vector(...arguments).magnitude;
};
Vector.angle = function(vec) {
  return new Vector(...arguments).angle;
};
Vector.unit = function(vec) {
  return new Vector(...arguments).unit;
}
Vector.rotate = (vec, angle) => new Vector(vec).rotate(angle);
