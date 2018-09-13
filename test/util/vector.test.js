import VDefault, * as VAll from "../../util/vector.js";
import {Vector, ImmutableVector, MutableVector, ZERO} from "../../util/vector.js";

export default {
  assert: vector_assert,
  expect: vector_expect,
  plugin: chaiPlugin
};

function chaiPlugin(chai, utils) {
  let Assertion = chai.Assertion;
  Assertion.addChainableMethod("vector", function(...args) {

  }, function() {
    utils.flag(this, "vector", true);
  });
}

function vector_expect() {
  describe("ImmutableVector(3,4)", () => {
    let v = ImmutableVector(3, 4);
    v.equal = (arg) => v.equals(arg);
    it("Equals {3, 4}", () => {
      expect(v).to.be.the.same.as({x: 3, y: 4});
    });
    it("\"equal\" {3, 4}", () => {
      expect(v).to.be.the.same("equal").as({x: 3, y: 4});
    });
    it("\"Vector.equal\" {3, 4}", () => {
      expect(v).to.be.equivalent(Vector.equal, 0).to({x: 3, y: 4});
    });
  });
}

function vector_assert() {
  describe("Vector exports", function() {
    it("default is Vector", function() {
      assert.equal(VDefault, Vector);
    });
    let exceptions = ["default", "Vectors"];
    Object.entries(VAll).forEach(([k, v]) => {
      if(!(exceptions.includes(k))) {
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
    //Vector.equal(ImmutableVector, ?)
    it("Vector.equal(ImmutableVector, ImmutableVector)", function() {
      assert.isTrue(Vector.equal(vi1, vi2));
    });
    it("Vector.equal(ImmutableVector, MutableVector)", function() {
      assert.isTrue(Vector.equal(vi1, vm2));
    });
    it("Vector.equal(ImmutableVector, Object)", function() {
      assert.isTrue(Vector.equal(vi1, ob2));
    });
    //Immutable.equals(?)
    it("ImmutableVector.equals(ImmutableVector)", function() {
      assert.isTrue(vi1.equals(vi2));
    });
    it("ImmutableVector.equals(MutableVector)", function() {
      assert.isTrue(vi1.equals(vm2));
    });
    it("ImmutableVector.equals(Object)", function() {
      assert.isTrue(vi1.equals(ob2));
    });
    //Vector.equal(MutableVector, ?)
    it("Vector.equal(MutableVector, ImmutableVector)", function() {
      assert.isTrue(Vector.equal(vm1, vi2));
    });
    it("Vector.equal(MutableVector, MutableVector)", function() {
      assert.isTrue(Vector.equal(vm1, vm2));
    });
    it("Vector.equal(MutableVector, Object)", function() {
      assert.isTrue(Vector.equal(vm1, ob2));
    });
    //MutableVector.equals(?)
    it("MutableVector.equals(ImmutableVector)", function() {
      assert.isTrue(vm1.equals(vi2));
    });
    it("MutableVector.equals(MutableVector)", function() {
      assert.isTrue(vm1.equals(vm2));
    });
    it("MutableVector.equals(Object)", function() {
      assert.isTrue(vm1.equals(ob2));
    });
    //Vector.equal(Object, ?)
    it("Vector.equal(Object, ImmutableVector)", function() {
      assert.isTrue(Vector.equal(ob1, vi2));
    });
    it("Vector.equal(Object, MutableVector)", function() {
      assert.isTrue(Vector.equal(ob1, vm2));
    });
    it("Vector.equal(Object, Object)", function() {
      assert.isTrue(Vector.equal(ob1, ob2));
    });
    //Non-equal tests
    let vdiff = {x: 8, y: 6};
    it("Vector.equal with unequal parameters is not true", function() {
      assert.isFalse(Vector.equal(ob1, vdiff));
    });
    it("ImmutableVector.equals with unequal parameters is not true", function() {
      assert.isFalse(vi1.equals(vdiff));
    });
    it("ImmutableVector.equals with unequal parameters is not true", function() {
      assert.isFalse(vm1.equals(vdiff));
    });
  });

  describe("Vector static functions (other than equal)", function() {
    describe("Vector.copy", function() {
      let vi = ImmutableVector(3,4);
      let vm = MutableVector(3,4);
      let c = Vector.copy(vm);
      it("Should return the same instance for ImmutableVectors", function() {
        assert.strictEqual(vi, Vector.copy(vi));
      });
      it("Should not return the same instance", function() {
        assert.notEqual(vm, c);
      });
      it("Should return an equal instance", function() {
        assert.deepEqual(vm, c);
      });
      it("Should return the same type", function() {
        assert.strictEqual(vm.constructor.name, c.constructor.name);
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

  describe("ImmutableVector", function() {
    describe("equals()", function() {
      it("Should return true if both x and y values are equivalent", function() {
        assert.isTrue(ImmutableVector(3, 4).equals({x: 3, y: 4}));
      });
      it("Should return false otherwise", function() {
        assert.isFalse(ImmutableVector(3, 4).equals({x: 3, y: 3}));
      });
    });
    describe("toString()", function() {
      it("Should return \"ImmutableVector{x, y}\"", function() {
        assert.strictEqual(ImmutableVector(3, 4).toString(), "ImmutableVector{x: 3, y: 4}");
      });
    });
    describe("copy()", function() {
      let v = ImmutableVector(3,4);
      let c = v.copy();
      it("Should return the same instance", function() {
        assert.strictEqual(v, c);
      });
      it("Should return an equal instance", function() {
        assert.deepEqual(v, c);
      });
      it("Should return an ImmutableVector", function() {
        assert.instanceOf(c, ImmutableVector);
      });
    });
    describe("inverted()", function() {
      let v = ImmutableVector(3, 4);
      let c = v.copy();
      it("Should return a new vector", function() {
        assert.notStrictEqual(v, ImmutableVector(-3, -4).inverted());
      });
      it("Should return the inverse (x and y made negative)", function() {
        assert.deepEqual(v, ImmutableVector(-3, -4).inverted());
      });
      it("Should not have affected the original vector", function() {
        assert.deepEqual(v, c);
      });
    });
    describe("invert()", function() {
      let v = ImmutableVector(3, 4);
      it("Should throw an error (cannot invert an immutable vector)", function() {
        assert.throws(() => v.invert());
      });
    });
    describe("unit()", function() {
      let v = ImmutableVector(3, 4);
      let vu = v.unit();
      it("Should return a new vector", function() {
        assert.notStrictEqual(v, vu);
      });
      it("Should return a vector with magnitude 1", function() {
        assert.strictEqual(vu.magnitude, 1);
      });
      it("Should have the same angle as before", function() {
        assert.approximately(vu.angle, v.angle, Number.EPSILON);
      });
    });
    describe("magnitude", function() {
      let v = ImmutableVector(3, 4);
      it("Should retrieve the magnitude", function() {
        assert.strictEqual(v.magnitude, 5);
      });
      it("If used as a setter, should throw an error", function() {
        assert.throws(() => v.magnitude = 10);
      });
    });
    describe("angle", function() {
      let v = ImmutableVector(3, 4);
      it("Should retrieve the angle", function() {
        assert.strictEqual(v.angle, Math.atan2(4, 3));
      });
      it("If used as a setter, should throw an error", function() {
        assert.throws(() => v.angle = Math.PI);
      });
    });
    describe("add", function() {
      let v = ImmutableVector(3, 4);
      let v2 = v.copy();
      let va = v.add({x: 1, y: 2});
      it("Should return a new vector", function() {
        assert.notStrictEqual(v, va);
      });
      it("should return the sum of 2 vectors", function() {
        assert.isTrue(va.equals({x: 4, y: 6}));
      });
      it("Should not effect the original", function() {
        assert.deepEqual(v, v2);
      });
    });
    describe("subtract", function() {
      let v = ImmutableVector(3, 4);
      let v2 = v.copy();
      let vs = v.subtract({x: 1, y: 4});
      it("Should return a new vector", function() {
        assert.notStrictEqual(v, vs);
      });
      it("should return 2 vectors subtracted", function() {
        assert.isTrue(vs.equals({x: 2, y: 0}));
      });
      it("Should not effect the original", function() {
        assert.deepEqual(v, v2);
      });
    });
    describe("scale", function() {
      let v = ImmutableVector(3, 4);
      let v2 = v.copy();
      let v1 = v.scale(2);
      it("Should return a new vector", function() {
        assert.notStrictEqual(v, v1);
      });
      it("with the magnitude scaled", function() {
        assert.isTrue(v1.equals({x: 6, y: 8}));
      });
      it("But the same angle", function() {
        assert.approximately(v1.angle, v2.angle, Number.EPSILON);
      });
      it("Should not effect the original", function() {
        assert.deepEqual(v, v2);
      });
    });
    describe("rotate", function() {
      let v = ImmutableVector(0, 1);
      let v2 = Vector.copy(v);
      let v1 = Vector.rotate(v, Math.PI / 2);
      it("Should return a new vector", function() {
        assert.notStrictEqual(v, v1);
      });
      it("rotated around the origin", function() {
        assert.isTrue(v1.equals({x: -1, y: 0}));
      });
      it("But the same magnitude", function() {
        assert.approximately(v1.magnitude, v2.magnitude, Number.EPSILON);
      });
      it("Should not effect the original", function() {
        assert.deepEqual(v, v2);
      });
    });
  });

  describe("MutableVector", function() {
    describe("equals()", function() {
      it("Should return true if both x and y values are equivalent", function() {
        assert.isTrue(MutableVector(3, 4).equals({x: 3, y: 4}));
      });
      it("Should return false otherwise", function() {
        assert.isFalse(MutableVector(3, 4).equals({x: 3, y: 3}));
      });
    });
    describe("toString()", function() {
      it("Should return \"MutableVector{x, y}\"", function() {
        assert.strictEqual(MutableVector(3, 4).toString(), "MutableVector{x: 3, y: 4}");
      });
    });
    describe("copy()", function() {
      let v = MutableVector(3,4);
      let c = v.copy();
      it("Should not return the same instance", function() {
        assert.notStrictEqual(v, c);
      });
      it("Should return an equal instance", function() {
        assert.deepEqual(v, c);
      });
      it("Should return a MutableVector", function() {
        assert.instanceOf(c, MutableVector);
      });
    });
    describe("inverted()", function() {
      let v = MutableVector(3, 4);
      let c = v.copy();
      it("Should return a new vector", function() {
        assert.notStrictEqual(v, MutableVector(-3, -4).inverted());
      });
      it("Should return the inverse (x and y made negative)", function() {
        assert.deepEqual(v, MutableVector(-3, -4).inverted());
      });
      it("Should not have affected the original vector", function() {
        assert.deepEqual(v, c);
      });
    });
    describe("invert()", function() {
      let v = MutableVector(3, 4);
      it("Should reverse the existing vector", function() {
        assert.isTrue(v.invert().equals({x: -3, y: -4}));
      });
    });
    describe("unit()", function() {
      let v = MutableVector(3, 4);
      let vu = v.unit();
      it("Should return a new vector", function() {
        assert.notStrictEqual(v, vu);
      });
      it("Should return a vector with magnitude 1", function() {
        assert.strictEqual(vu.magnitude, 1);
      });
      it("Should have the same angle as before", function() {
        assert.approximately(vu.angle, v.angle, Number.EPSILON);
      });
    });
    describe("magnitude", function() {
      let v = MutableVector(3, 4);
      let v2 = v.copy();
      v2.magnitude = 10;
      it("Should retrieve the magnitude", function() {
        assert.strictEqual(v.magnitude, 5);
      });
      it("If used as a setter, should set the original magnitude", function() {
        assert.strictEqual(v2.magnitude, 10);
      });
    });
    describe("angle", function() {
      let v = MutableVector(3, 4);
      let v2 = v.copy();
      v2.angle = Math.PI;
      it("Should retrieve the angle", function() {
        assert.strictEqual(v.angle, Math.atan2(4, 3));
      });
      it("If used as a setter, should set the original angle", function() {
        assert.strictEqual(v2.angle, Math.PI);
      });
    });
    describe("add()", function() {
      let v = MutableVector(3, 4);
      let va = v.add({x: 1, y: 2});
      it("Should return the same vector", function() {
        assert.strictEqual(v, va);
      });
      it("should return the sum of 2 vectors", function() {
        assert.isTrue(va.equals({x: 4, y: 6}));
      });
    });
    describe("subtract()", function() {
      let v = MutableVector(3, 4);
      let vs = v.subtract({x: 1, y: 4});
      it("Should return the same vector", function() {
        assert.strictEqual(v, vs);
      });
      it("should return 2 vectors subtracted", function() {
        assert.isTrue(vs.equals({x: 2, y: 0}));
      });
    });
    describe("scale()", function() {
      let v = MutableVector(3, 4);
      let v2 = v.copy();
      let v1 = v.scale(2);
      it("Should return the same vector", function() {
        assert.strictEqual(v, v1);
      });
      it("with the magnitude scaled", function() {
        assert.isTrue(v1.equals({x: 6, y: 8}));
      });
      it("But the same angle", function() {
        assert.approximately(v1.angle, v2.angle, Number.EPSILON);
      });
    });
    describe("rotate()", function() {
      let v = MutableVector(0, 1);
      let v2 = v.copy();
      let v1 = v.rotate(Math.PI / 2);
      it("Should return the same vector", function() {
        assert.strictEqual(v, v1);
      });
      it("rotated around the origin", function() {
        assert.isTrue(v1.equals({x: -1, y: 0}));
      });
      it("But the same magnitude", function() {
        assert.approximately(v1.magnitude, v2.magnitude, Number.EPSILON);
      });
    });
  });

  //TODO: magSquared tests

  describe("{0,0}", function() {
    let v0 = {x: 0, y: 0};
    it("equals Vector.ZERO", function() {
      assert.isTrue(Vector.equals(v0, ZERO));
    });
    describe(".unit()", function() {
      it("throws an error", function() {
        assert.throws(() => Vector.unit(v0));
      });
    });
    describe("MutableVector.magnitude = 0", function() {
      let m = MutableVector(1,2);
      let c = m.copy();
      m.magnitude = 0;
      it("makes the vector equal Vector.ZERO", function() {
        assert.isTrue(Vector.equals(m, ZERO));
      });
      it("Still has the original (no longer valid) angle", function() {
        assert.strictEqual(m.angle, c.angle);
      });
    });
  });
}
