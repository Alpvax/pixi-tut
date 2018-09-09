import VDefault, * as VAll from "../../util/vector.js";
import {Vector, ImmutableVector, MutableVector} from "../../util/vector.js";
export default {};

describe("Vector", () => {
  describe("exports", function() {
    it("default export is Vector", function() {
      assert.equal(VDefault, Vector);
    });
    Object.entries(VAll).forEach(([k, v]) => {
      if(k !== "default") {
        it(`[*].${k} is ${k}`, function() {
          assert.equal(v, eval(k));
        });
      };
    });
    it("Vector.Immutable is ImmutableVector", function() {
      assert.equal(Vector.Immutable, ImmutableVector);
    });
    it("Vector.Mutable is MutableVector", function() {
      assert.equal(Vector.Mutable, MutableVector);
    });
  });

  describe("copying", function() {
    makeTestVectors().forEach((v) => {
      let name = v.constructor.name;
      let flag = /Vector/g.test(name);
      if(flag) {
        it(`${name}.copy is not original`, function() {
          assert.notEqual(v, v.copy());
        });
      }
      it(`Vector.copy(${name}) is not original`, function() {
        assert.notEqual(v, Vector.copy(v));
      });
      if(flag) {
        it(`${name}.copy is ${name}.equal`, function() {
          assert(v.equals(v.copy()));
        });
      }
      if(flag) {
        it(`Vector.copy(${name}) is ${name}.equal`, function() {
          assert(v.equals(Vector.copy(v)));
        });
        it(`${name}.copy is Vector.equal`, function() {
          assert(Vector.equals(v, v.copy()));
        });
      }
      it(`Vector.copy(${name}) is Vector.equal`, function() {
        assert(Vector.equals(v, Vector.copy(v)));
      });
    });
  });

  describe("instanceof", function() {
    function runTests(v, isV, isI, isM) {
      let name = v.constructor.name;
      it(`${name + (isV ? "" : " not")} instanceof Vector`,           () => assert["is" + (isV ? "True" : "False")](v instanceof Vector));
      it(`${name + (isI ? "" : " not")} instanceof ImmutableVector`,  () => assert["is" + (isI ? "True" : "False")](v instanceof ImmutableVector));
      it(`${name + (isM ? "" : " not")} instanceof MutableVector`,    () => assert["is" + (isM ? "True" : "False")](v instanceof MutableVector));
    }
    let x = 3, y = 4;
    runTests(new Vector(x, y), true, true, false);
    runTests(new Vector.Immutable(x, y), true, true, false);
    runTests(new Vector.Mutable(x, y), true, false, true);
    runTests({x, y}, false, false, false);
  });

  describe("mutablility", () => {
    function testMutability(v, prop, val, error) {
      describe(`Set ${v.constructor.name}.${prop} = ${val}`, () => {
        it(`should ${error ? "fail" : "change"}`, () => {
          let vec = Vector.copy(v);
          let fun = () => vec[prop] = val;
          if(error) {
            assert.throws(fun);
          } else {
            assert.changes(fun, vec, prop);
          }
        });
      });
    }
    let vi = ImmutableVector(3, 4);
    let vm = MutableVector(3, 4);
    Object.entries({
      x: 2,
      y: 6,
      angle: Math.PI,
      magnitude: 10
    }).forEach(([k, val]) => {
      testMutability(vi, k, val, true);
      testMutability(vm, k, val, false);
    });
    testMutability(vi, "magSquared", 9, true);
    testMutability(vm, "magSquared", 9, true);
  });

  describe("Functions", () => {
    function logFuncCall(num, v, name, ...args) {
      v = Vector.copy(v);
      let funStr = `${name}(${args.map((a) => JSON.stringify(a)).join(",")}): `;
      let strStart = `Test ${(num + 1).toString().padStart(2)}:\t`;
      try {
        console.log(strStart + funStr, v[name](...args));
      } catch(e) {
        console.warn(e);
      }
      if(name !== "invert") {
        console.log(strStart + "Vector." + funStr, Vector[name](v, ...args));
      }
    }
    function runTest(v, name, ...args) {
      v = Vector.copy(v);
      describe(`${name}(${args.map((a) => JSON.stringify(a)).join(",")})`, () => {
        //it("")
      });
    }
    makeTestVectors().forEach((v) => {
      let tests = {
        add: [[{x: 2, y: 3}]],
        subtract: [[{x: 5, y: 7}]],
        invert: [],
        inverted: [],
        copy: [],
        scale: [[2]],
        rotate: [[Math.PI]],
        unit: [],
        equals: [[v]],
        equals: [[{x: 3, y: 4}], [{x: 4, y: 3}], [{x: 3.1, y: 4.1}], [{x: 3.1, y: 4.1}, 0.1]],
      };
      Object.entries(tests).forEach(([k, tests]) => {
        if(tests.length < 1) {
          runTest(v, k);
        } else {
          tests.forEach((args) => runTest(v, k, ...args));
        }
      });
    });
  });
});

function makeTestVectors(x = 3, y = 4) {
  return [
    new Vector(x, y),
    new Vector.Immutable(x, y),
    new Vector.Mutable(x, y),
    {x, y}
  ];
}
