import VDefault, * as VAll from "../../util/vector.js";
import {Vector, ImmutableVector, MutableVector} from "../../util/vector.js";
export default {};

describe("Vector exports", function() {
  it("default is Vector", function() {
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

describe("Vector creation", function() {
  let args = {x: 3, y: 4};
  let strargs = JSON.stringify(args);
  it(`Vector(${strargs}) = new Vector(${strargs})`, function() {
    assert.strictEqual(JSON.stringify(new Vector(args)), JSON.stringify(Vector(args)));
  });
  it(`ImmutableVector(${strargs}) = new ImmutableVector(${strargs})`, function() {
    assert.strictEqual(JSON.stringify(new Vector(args)), JSON.stringify(Vector(args)));
  });
  it(`MutableVector(${strargs}) = new MutableVector(${strargs})`, function() {
    assert.strictEqual(JSON.stringify(new Vector(args)), JSON.stringify(Vector(args)));
  });
  it(`Vector(${strargs}) = ImmutableVector(${strargs})`, function() {
    assert.strictEqual(JSON.stringify(new Vector(args)), JSON.stringify(Vector(args)));
  });
});

describe("Vector instance", function() {
  let args = {x: 3, y: 4};
  let v = Vector(args);
  let vi = ImmutableVector(args);
  let vm = MutableVector(args);
  it("Vector instanceof Vector", function() {
    assert.instanceOf(v, Vector);
  });
  it("Vector instanceof ImmutableVector", function() {
    assert.instanceOf(v, ImmutableVector);
  });
  it("Vector not instanceof MutableVector", function() {
    assert.notInstanceOf(v, MutableVector);
  });
  it("ImmutableVector instanceof Vector", function() {
    assert.instanceOf(vi, Vector);
  });
  it("ImmutableVector instanceof ImmutableVector", function() {
    assert.instanceOf(vi, ImmutableVector);
  });
  it("ImmutableVector not instanceof MutableVector", function() {
    assert.notInstanceOf(vi, MutableVector);
  });
  it("MutableVector instanceof Vector", function() {
    assert.instanceOf(vm, Vector);
  });
  it("MutableVector not instanceof ImmutableVector", function() {
    assert.notInstanceOf(vm, ImmutableVector);
  });
  it("MutableVector instanceof MutableVector", function() {
    assert.instanceOf(vm, MutableVector);
  });
  it("Object not instanceof Vector", function() {
    assert.notInstanceOf(args, Vector);
  });
  it("Object not instanceof ImmutableVector", function() {
    assert.notInstanceOf(args, ImmutableVector);
  });
  it("Object not instanceof MutableVector", function() {
    assert.notInstanceOf(args, MutableVector);
  });
});

describe("Vector equality", function() {
  let vi1 = ImmutableVector(3, 4);
  let vi2 = ImmutableVector(3, 4);
  let vm1 = MutableVector(3, 4);
  let vm2 = MutableVector(3, 4);
  let ob1 = {x: 3, y: 4};
  let ob2 = {x: 3, y: 4};
  it("ImmutableVector = ImmutableVector", function() {
    assert.isTrue(Vector.equal(vi1, vi2));
  });
  it("ImmutableVector = MutableVector", function() {
    assert.isTrue(Vector.equal(vi1, vm2));
  });
  it("ImmutableVector = Object", function() {
    assert.isTrue(Vector.equal(vi1, ob2));
  });
  it("MutableVector = ImmutableVector", function() {
    assert.isTrue(Vector.equal(vm1, vi2));
  });
  it("MutableVector = MutableVector", function() {
    assert.isTrue(Vector.equal(vm1, vm2));
  });
  it("MutableVector = Object", function() {
    assert.isTrue(Vector.equal(vm1, ob2));
  });
  it("Object = ImmutableVector", function() {
    assert.isTrue(Vector.equal(ob1, vi2));
  });
  it("Object = MutableVector", function() {
    assert.isTrue(Vector.equal(ob1, vm2));
  });
  it("Object = Object", function() {
    assert.isTrue(Vector.equal(ob1, ob2));
  });
});

describe("Vector static functions (other than equal)", function() {
  describe("Vector.copy", function() {
    let v = Vector(3,4);
    let c = Vector.copy(v);
    it("Should not return the same instance", function() {
      assert.notEqual(v, c);
    });
    it("Should return an equal instance", function() {
      assert.deepEqual(v, c);
    });
    it("Should return the same type", function() {
      assert.strictEqual(v.constructor.name, c.constructor.name);
    });
  });
  describe("Vector.inverted", function() {
    let v = Vector(3, 4);
    it("Should return the inverse (x and y made negative)", function() {
      assert.deepEqual(v, Vector.inverted(Vector(-3, -4)));
    });
    it("Should not have affected the original vector", function() {
      assert.notDeepEqual(v, Vector.inverted(Vector(3, 4)));
    });
  });
  describe("Vector.unit", function() {
    let v = Vector(3, 4);
    let vu = Vector.unit(v);
    it("Should return a vector with magnitude 1", function() {
      assert.strictEqual(vu.magnitude, 1);
    });
    it("Should have the same angle as before", function() {
      assert.approximately(vu.angle, v.angle, Number.EPSILON);
    });
  });
  describe("Vector.magnitude", function() {
    let v = Vector(3, 4);
    let v2 = Vector.copy(v);
    let vm = Vector.magnitude(v, 10);
    it("Should retrieve the magnitude", function() {
      assert.strictEqual(Vector.magnitude(v), 5);
    });
    it("Should not effect the original", function() {
      assert.deepEqual(v, v2);
    });
    it("If used as a setter, should return a new vector with the specified magnitude", function() {
      assert.strictEqual(Vector.magnitude(vm), 10);
    });
    it("But the same angle", function() {
      assert.approximately(vm.angle, v2.angle, Number.EPSILON);
    });
  });
  describe("Vector.angle", function() {
    let v = Vector(3, 4);
    let v2 = Vector.copy(v);
    let va = Vector.angle(v, Math.PI);
    it("Should retrieve the angle", function() {
      assert.strictEqual(Vector.angle(v), Math.atan2(4, 3));
    });
    it("Should not effect the original", function() {
      assert.deepEqual(v, v2);
    });
    it("If used as a setter, should return a new vector with the specified angle", function() {
      assert.strictEqual(Vector.angle(va), Math.PI);
    });
    it("But the same magnitude", function() {
      assert.approximately(va.magnitude, v2.magnitude, Number.EPSILON);
    });
  });
  describe("Vector.add", function() {
    let v = Vector(3, 4);
    let v2 = Vector.copy(v);
    it("should return the sum of 2 vectors", function() {
      assert.isTrue(Vector.equal(Vector.add(v, {x: 1, y: 2}), {x: 4, y: 6}));
    });
    it("Should not effect the original", function() {
      assert.deepEqual(v, v2);
    });
  });
  describe("Vector.subtract", function() {
    let v = Vector(3, 4);
    let v2 = Vector.copy(v);
    it("should return 2 vectors subtracted", function() {
      assert.isTrue(Vector.equal(Vector.subtract(v, {x: 1, y: 4}), {x: 2, y: 0}));
    });
    it("Should not effect the original", function() {
      assert.deepEqual(v, v2);
    });
  });
  describe("Vector.scale", function() {
    let v = Vector(3, 4);
    let v2 = Vector.copy(v);
    let v1 = Vector.scale(v, 2);
    it("Should return a new vector with the magnitude scaled", function() {
      assert.deepEqual(v1, Vector(6, 8));
    });
    it("But the same angle", function() {
      assert.approximately(v1.angle, v2.angle, Number.EPSILON);
    });
    it("Should not effect the original", function() {
      assert.deepEqual(v, v2);
    });
  });
  describe("Vector.rotate", function() {
    let v = Vector(0, 1);
    let v2 = Vector.copy(v);
    let v1 = Vector.rotate(v, Math.PI / 2);
    it("Should return a new vector rotated around the origin", function() {
      assert.isTrue(Vector.equal(v1, Vector(-1, 0)));
    });
    it("But the same magnitude", function() {
      assert.approximately(v1.magnitude, v2.magnitude, Number.EPSILON);
    });
    it("Should not effect the original", function() {
      assert.deepEqual(v, v2);
    });
  });
});


/*TODO: refactor tests to describe each Vector type
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
        assert.isTrue(v.equals(v.copy()));
      });
    }
    if(flag) {
      it(`Vector.copy(${name}) is ${name}.equal`, function() {
        assert.isTrue(v.equals(Vector.copy(v)));
      });
      it(`${name}.copy is Vector.equal`, function() {
        assert.isTrue(Vector.equals(v, v.copy()));
      });
    }
    it(`Vector.copy(${name}) is Vector.equal`, function() {
      assert.isTrue(Vector.equals(v, Vector.copy(v)));
    });
  });
});

describe("instanceof", function() {
  function runTests(v, isV, isI, isM) {
    let name = v.constructor.name;
    it(`${name + (isV ? "" : " not")} instanceof Vector`,           function() {assert[(isV ? "i" : "notI") + "nstanceOf"](v, Vector); });
    it(`${name + (isI ? "" : " not")} instanceof ImmutableVector`,  function() {assert[(isI ? "i" : "notI") + "nstanceOf"](v, ImmutableVector); });
    it(`${name + (isM ? "" : " not")} instanceof MutableVector`,    function() {assert[(isM ? "i" : "notI") + "nstanceOf"](v, MutableVector); });
  }
  let x = 3, y = 4;
  runTests(new Vector(x, y), true, true, false);
  runTests(new Vector.Immutable(x, y), true, true, false);
  runTests(new Vector.Mutable(x, y), true, false, true);
  runTests({x, y}, false, false, false);
});

describe("mutablility", function() {
  function testMutability(v, prop, val, result) {
    let vec = Vector.copy(v);
    let fun = () => vec[prop] = val;
    if(result) {
      fun();
      it(`${v}.${prop} = ${val} should equal ${result}`, function() {
        assert.isTrue(Vector.equals(vec, result));
      });
    } else {
      it(`${v}.${prop} = ${val} should throw an error`, function() {
        assert.throws(fun);
      });
      it(`${v}.${prop} = ${val} should remain unchanged`, function() {
        assert.isTrue(Vector.equals(vec, v));
      });
    }
  }
  let vi = ImmutableVector(3, 4);
  let vm = MutableVector(3, 4);
  Object.entries({
    x: [2, Vector({x: 2, y: 4})],
    y: [6, Vector({x: 3, y: 6})],
    angle: [Math.PI, Vector({x: -5, y: 0})],
    magnitude: [10, Vector({x: 6, y: 8})],
  }).forEach(([k, [val, res]]) => {
    testMutability(vi, k, val);
    testMutability(vm, k, val, res);
  });
  testMutability(vi, "magSquared", 9);
  testMutability(vm, "magSquared", 9);
});

describe("Functions", function() {
  let x = 3, y = 4;
  let vi = new Vector.Immutable(x, y);
  it(`${vi}.add({2,3}).equals({5, 7})`, function() {
    let res = Vector(5, 7);
    assert.isTrue()
  })
  let vm = new Vector.Mutable(x, y);
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
    describe(`${name}(${args.map((a) => JSON.stringify(a)).join(",")})`, function() {
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

function makeTestVectors(x = 3, y = 4) {
  return [
    new Vector(x, y),
    new Vector.Immutable(x, y),
    new Vector.Mutable(x, y),
    {x, y}
  ];
}*/
