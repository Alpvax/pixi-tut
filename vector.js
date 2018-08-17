"use strict"

/**Base property descriptor */
let baseDescript = ["x", "y", "magnitude", "angle"].reduce((obj, key) => {
  obj[key] = Object.assign({
    configurable: false,
    enumerable: true
  }, /*immutable ? {writable: false} : {}*/);
  return obj;
}, {});

/**@param {object|string} [options] An optional object containing an "unpackedStyle" key, or a string, where the value of either is either "xy" or "am" as below.
 * @param {string} options.unpackedStyle either "xy" or "am",
 * depending on whether pairs of numbers should be recognised as an (x,y) pairing or an (angle,magnitude) pairing.
 */
function reducePoints(options, ...args) {
  let type = "xy";
  if(typeof options === "object" && "unpackedStyle" in options) {
    type = options.unpackedStyle;
  } else if(typeof options === "string") {
    type = options;
  } else {
    args.unshift(options);
  }
  let result = args.reduce((result, val, index) => {
    if("prev" in result && isNaN(val)) {
      throw new Error(`Mismatched vector point pairing: {${type[0]}: ${result.prev}, ${type[1]}: NaN(${JSON.stringify(val)})}`);
    }
    let prev = result.prev;
    switch(typeof val) {
      case "number":
        if(result.prev !== undefined) {
          result.points.push({[type[0]]: result.prev, [type[1]]: val});
          delete result.prev;
        } else {
          result.prev = val;
        }
        break;
      case "object":
        if(("x" in val && "y" in val) ||
          ("angle" in val && "magnitude" in val) ||
          ("a" in val && "m" in val)) {
          result.points.push(val);
        }
        break;
      default:
        if(index === args.length - 1 && typeof val === "boolean") {
          result.immutable = val;
        } else {
          console.warn("Ignoring unhandled non-point, non-numeric value: ", val);
        }
        break;
    }
    return result;
  }, {points: []});
  if(result.prev) {
    throw new Error("Mismatching number of numeric args, remaining value: " + result.prev);
  }
  return Object.defineProperties(result.points, {
    immutable: {
      enumerable: true,
      configurable: false,
      writable: false,
      value: result.immutable !== false //true by default
    },
    asVectors: {
      enumerable: false,
      configurable: false,
      writable: false,
      value: result.immutable ?
        () => result.points.map((p) => new Vector.Immutable(p)) :
        () => result.points.map((p) => new Vector.Mutable(p))
    }
  });
}

function setVectorValues(vec, x, y) {
  if(vec.immutable) {
    return new Vector.Immutable({x, y});
  } else {
    vec.x = x;
    vec.y = y;
    return vec;
  }
}

class Vector {
  /**
   * @param {object} point An object with either the properties x and y, or the properties a and m (or angle and magnitude)
   * @param {number} [point.x] The x co-ord of the point
   * @param {number} [point.y] The y co-ord of the point
   * @param {number} [point.a] The x co-ord of the point
   * @param {number} [point.m] The y co-ord of the point
   * @param {number} [point.angle] The x co-ord of the point
   * @param {number} [point.magnitude] The y co-ord of the point
   */
  constructor(point, immutable=true) {
    let vecs = reducePoints(...arguments);
    if(vecs.length !== 1) {
      throw new Error("Invalid vector arguments:\n", vecs);
    }
    point = vecs[0];
    immutable = vecs.immutable;//*/
    let x = point.x;
    let y = point.y;
    let angle = point.angle !== undefined ? point.angle : point.a;
    let magnitude = point.magnitude !== undefined ? point.magnitude : point.m;
    let nan = {x: isNaN(x), y: isNaN(y), a: isNaN(angle), m: isNaN(magnitude)};
    let numNaN = Object.values(nan).reduce((a, b) => a + b);
    if(numNaN > 2) {
      throw new Error(`A vector must have at least 2 of the following numeric values defined:
        \tx: ${x},
        \ty: ${y},
        \tangle (or a): ${angle},
        \tmagnitude (or m): ${magnitude}`);
    }
    if(!nan.x && !nan.y) { //x & y
        magnitude = Math.sqrt(x * x + y * y);
        angle = Math.atan2(y, x);
    } else if(!nan.a && !nan.m) { //angle & magnitude
      x = magnitude * Math.cos(angle);
      y = magnitude * Math.sin(angle);
    } else {
      throw new Error("Mixing a/m and x/y parameters for vector definitions is not supported");
    }
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
  toString(listMagAng) {
    return `Vector{x: ${this.x}, y: ${this.y + (listMagAng ? `, magnitude: ${this.magnitude}, angle: ${this.angle}` : "")}}`;
  }
  add(...vec) {
    let x = this.x || 0;//Allow calling via Vector.add()
    let y = this.y || 0;
    reducePoints(...vec).forEach((v) => {
      x += v.x;
      y += v.y;
    });
    return setVectorValues(this, x, y);
  }
  subtract(...vec) {
    return Vector.add(this, ...reducePoints(...vec).asVectors().map(Vector.invert));//Allow calling via Vector.subtract()
  }
  invert() {
    return setVectorValues(this, -this.x, -this.y);
  }
  scale(mult) {
    return setVectorValues(this, this.x * mult, this.y * mult);//Allow calling via Vector.scale()
  }
  dot(...vec) {
    let x = this.x === undefined ? 1 : this.x;//Allow calling via Vector.add()
    let y = this.y === undefined ? 1 : this.y;
    reducePoints(...vec).forEach((v) => {
      x *= v.x;
      y *= v.y;
    });
    return x + y;
  }
  unit() {
    return this.scale(1 / this.magnitude);
  }
  rotate(angle) {
    let mag = this.magnitude;
    let ang = this.angle;
    let x = mag * Math.cos(ang + angle);
    let y = mag * Math.sin(ang + angle);
    return setVectorValues(this, x, y);
  }
}
Vector.Mutable = class extends Vector {
  constructor(point) {
    super(point, false);
  }
  static [Symbol.hasInstance](obj) {
    return obj instanceof Vector && !obj.immutable;
  }
}
Vector.Immutable = class extends Vector {
  constructor(point) {
    super(point, true);
  }
  static [Symbol.hasInstance](obj) {
    return obj instanceof Vector && obj.immutable;
  }
}

Vector.add = (...vec) => Vector.prototype.add(...vec);
Vector.subtract = function(vec, ...sub) {
  let vecs = reducePoints(...arguments);
  return Vector.prototype.subtract.call(vecs.shift(), ...vecs);
}
Vector.invert = (vec) => Vector.prototype.invert.call(vec);
Vector.scale = (vec, mult) => Vector.prototype.scale.call(vec, mult);
Vector.dot = (...vec) => Vector.prototype.dot(...vec);
Vector.magnitude = function(vec) {
  return new Vector(...arguments).magnitude;
};
Vector.angle = function(vec) {
  return new Vector(...arguments).angle;
};
Vector.unit = function(vec) {
  return new Vector(...arguments).unit;
}
Vector.rotate = function(vec, angle) {
  return new Vector(arguments).rotate(arguments[arguments.length - 1]);
}
