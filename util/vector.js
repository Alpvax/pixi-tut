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

Vector.copy = copy;

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

function magnitude(vec) {
  if(arguments.length > 1) {
    let mag = arguments[1];
    if(isFinite(mag)) {
      return Vector.scale(vec, mag / Vector.magnitude(vec));
    }
  }
  return Math.sqrt(vec.x *vec.x + vec.y * vec.y);
}
function angle(vec) {
  if(arguments.length > 1) {
    let ang = arguments[1];
    if(isFinite(ang)) {
      return Vector.rotate(vec, ang - Vector.angle(vec));
    }
  }
  return Math.atan2(vec.y, vec.x);
}
function unit(vec) {
  return Vector.magnitude(newVec(vec), 1);
}
function copy(vec) {
  return /**/new vec.constructor(vec);//*/newVec(vec);
}
function inverted(vec) {
  return newVec(vec, -vec.x, -vec.y);
}
function add(vec, ...others) {
  return newVec(vec, {
    x: others.reduce((a, b) => a.x + b.x, vec.x),
    y: others.reduce((a, b) => a.y + b.y, vec.y)
  });
}
function subtract(vec, ...others) {
  return Vector.add(vec, others.map((v) => ({x: -v.x, y: -v.y})));
}
function scale(vec, amount) {
  return newVec(vec, vec.x * amount, vec.y * amount);
}
function rotate(vec, angle) {
  let mag = Vector.magnitude(vec);
  let ang = Vector.angle(vec);
  return newVec(vec, mag * Math.cos(ang + angle), mag * Math.sin(ang + angle));
}

function newVec(vec, ...args) {
  args = args.length ? args : vec;
  return new (vec[Symbol.species] || vec.constructor)(...args);
}
