import CachedValue from "./cachedValue.js";

export function MutableVector(x, y) {
  if(!(this instanceof MutableVector)) {
    return new MutableVector(x, y);
  }
  ({x, y} = parseArgs(x, y));
  function setXY(xv, yv) {
    x = xv;
    y = yv;
    magSquared.invalidate();
    magnitude.invalidate();
    angle.invalidate();
  }
  function setAM(angle, magnitude) {
    setXY(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
  }
  let magSquared = CachedValue(() => x * x + y * y);
  let magnitude = CachedValue(() => Math.sqrt(magSquared.value));
  let angle = CachedValue(() => Math.atan2(y, x));
  return Object.defineProperties(this, {
    x: {
      configurable: false,
      enumerable: true,
      get: () => x,
      set(val) {
        setXY(val, y);
      }
    },
    y: {
      configurable: false,
      enumerable: true,
      get: () => y,
      set(val) {
        setXY(x, val);
      }
    },
    angle: {
      configurable: false,
      enumerable: true,
      get: () => angle.value,
      set(val) {
        setAM(val, magnitude.value);
      }
    },
    magnitude: {
      configurable: false,
      enumerable: true,
      get: () => magnitude.value,
      set(val) {
        setAM(angle.value, val);
      }
    },
    magSquared: {
      configurable: false,
      enumerable: true,
      get: () => magSquared.value
      //NO SETTER!
    }
  });
};
export function ImmutableVector(x, y) {
  if(!(this instanceof ImmutableVector)) {
    return new ImmutableVector(x, y);
  }
  return Object.defineProperties(this, Object.entries(parseArgs(x, y)).map(([k, v]) => {
    return {
      [k]: {
        configurable: false,
        enumerable: true,
        writable: false,
        value: v
      }
    };
  }).reduce((o, p) => Object.assign(o, p)));
};

export const Vector = function(x, y) {
  return ImmutableVector(x, y);
};
Object.defineProperty(Vector, Symbol.hasInstance, {
  value: (obj) => obj instanceof ImmutableVector || obj instanceof MutableVector
});
Vector.Immutable = ImmutableVector;
Vector.Mutable = MutableVector;
export default Vector;

[copy, equals, magnitude, angle, unit, add, subtract, inverted, scale, rotate].forEach((func) => Vector[func.name] = func);
const sharedFuncs = {
  //Non-modifying
  inverted() {
    return Vector.inverted(this);
  },
  unit() {
    return Vector.unit(this);
  },
  copy() {
    return Vector.copy(this);
  },
  equals(vec, precision) {
    return Vector.equals(this, vec, precision);
  },
  toString() {
    return `${this.constructor.name}{x: ${this.x}, y: ${this.y}}`;
  }
};

Object.assign(MutableVector.prototype, {
  add(...others) {
    let {x, y} = _do.add(this, ...others);
    this.x = x;
    this.y = y;
    return this;
  },
  subtract(...others) {
    let {x, y} = _do.subtract(this, ...others);
    this.x = x;
    this.y = y;
    return this;
  },
  scale(amount) {
    let {x, y} = _do.scale(this, amount);
    this.x = x;
    this.y = y;
    return this;
  },
  rotate(amount) {
    let {x, y} = _do.rotate(this, amount);
    this.x = x;
    this.y = y;
    return this;
  },
  invert() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }
}, sharedFuncs);
Object.assign(ImmutableVector.prototype, {
  add(...others) {
    console.debug("Creating new Vector instance while calling `ImmutableVector.add`\nStacktrace: " + new Error().stack);
    return add(this, ...others);
  },
  subtract(...others) {
    console.debug("Creating new Vector instance while calling `ImmutableVector.subtract`\nStacktrace: " + new Error().stack);
    return subtract(this, ...others);
  },
  scale(amount) {
    console.debug("Creating new Vector instance while calling `ImmutableVector.scale`\nStacktrace: " + new Error().stack);
    return scale(this, amount);
  },
  rotate(amount) {
    console.debug("Creating new Vector instance while calling `ImmutableVector.rotate`\nStacktrace: " + new Error().stack);
    return rotate(this, amount);
  },
  invert() {
    throw new TypeError("Cannot invert ImmutableVector: " + this);
  }
}, sharedFuncs);

function magnitude(vec) {
  if(arguments.length > 1) {
    let mag = arguments[1];
    if(isFinite(mag)) {
      return Vector.scale(vec, mag / Vector.magnitude(vec));
    }
  }
  return _do.magnitude(vec);
}
function angle(vec) {
  if(arguments.length > 1) {
    let ang = arguments[1];
    if(isFinite(ang)) {
      return Vector.rotate(vec, ang - Vector.angle(vec));
    }
  }
  return _do.angle(vec);
}
function unit(vec) {
  return newVec(_do.unit(vec));
}
function equals(vec1, vec2, precision) {
  if(vec1 === vec2) {
    return true;
  }
  if(isNaN(precision)) {
    precision = 1e-15; //Default precision to fix sin/cos Math rounding errors
  }
  precision += Number.EPSILON;
  return Math.abs(vec1.x - vec2.x) <= precision && Math.abs(vec1.y - vec2.y) <= precision;
}
function copy(vec) {
  return newVec(vec);
}
function inverted(vec) {
  return newVec(vec, -vec.x, -vec.y);
}
function add(vec, ...others) {
  return newVec(vec, _do.add(vec, ...others));
}
function subtract(vec, ...others) {
  return newVec(vec, _do.subtract(vec, ...others));
}
function scale(vec, amount) {
  return newVec(vec, _do.scale(vec, amount));
}
function rotate(vec, angle) {
  return newVec(vec, _do.rotate(vec, angle));
}


//******* Internal Functions *******//

const _do = { //magnitude, angle, unit, add, subtract, scale, rotate
  add(...vecs) {
    return vecs.reduce((a, b) => {
      return {
        x: a.x + b.x,
        y: a.y + b.y
      };
    }, {x: 0, y: 0});
  },
  subtract(...vecs) {
    return vecs.reduce((a, b) => {
      return {
        x: a.x - b.x,
        y: a.y - b.y
      };
    }, vecs.shift());//Start with first vec positive
  },
  scale({x, y}, amount) {
    return {
      x: x * amount,
      y: y * amount
    };
  },
  rotate(vec, angle) {
    let mag = _do.magnitude(vec);
    let ang = _do.angle(vec);
    return {
      x: mag * Math.cos(ang + angle),
      y: mag * Math.sin(ang + angle)
    };
  },
  unit(vec) {
    let mag = _do.magnitude(vec);
    return {
      x: vec.x / mag,
      y: vec.y / mag
    };
  },
  magnitude(vec) {
    if(vec instanceof Vector) {
      return vec.magnitude;
    }
    return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
  },
  angle(vec) {
    if(vec instanceof Vector) {
      return vec.angle;
    }
    return Math.atan2(vec.y, vec.x);
  }
};

function parseArgs(x, y) {
  if(typeof x === "object") {
    y = x.y;
    x = x.x;
  }
  if(isNaN(x) || isNaN(y)) {
    throw new Error(`A vector must have 2 numerical values defined:
      \tx: ${x} and y: ${y}`);
  }
  let magSquared = x*x + y*y;
  let angle = Math.atan2(y, x);
  return {x, y, magnitude: Math.sqrt(magSquared), magSquared, angle};
}

function newVec(vec, ...args) {
  args = args.length ? args : [vec];
  let factory = vec[Symbol.species] || (vec instanceof Vector ? vec.constructor : ImmutableVector);
  return factory(...args);
}
