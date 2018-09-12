export default function CachedValue(calculate) {
  let val;
  let dirty = true;
  return Object.defineProperties({}, {
    value: {
      enumerable: true,
      configurable: false,
      get() {
        if(dirty) {
          val = calculate();
          dirty = false;
        }
        return val;
      }
    },
    invalidate: {
      value() {
        dirty = true;
      },
      enumerable: false,
      configurable: false,
      writable: false
    }
  });
}
