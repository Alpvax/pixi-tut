import VDefault, * as VAll from "../../util/vector.js";
import {Vector, ImmutableVector, MutableVector} from "../../util/vector.js";

//testImports();
//testCopy();
//testInstance();
testImmutable();

function testImmutable() {
  function setVal(o, k, v) {
    try {
      console.log(`\t${k} = ${v}`);
      o[k] = v;
      console.log("\t\t==> ", o);
    } catch (e) {
      console.warn(e);
    }
  }
  [
    new Vector(3,4),
    new Vector.Immutable(3,4),
    new Vector.Mutable(3,4),
    {x: 3, y: 4}
  ].forEach((v) => {
    console.log(v);
    Object.entries({
      x: 2,
      y: 6,
      angle: Math.PI,
      magnitude: 10,
      magSquared: 9
    }).forEach(([k, val]) => setVal(Vector.copy(v), k, val));
  });
}

function testCopy() {
  [
    new Vector(3,4),
    new Vector.Immutable(3,4),
    new Vector.Mutable(3,4),
    {x: 3, y: 4}
  ].forEach((v) => console.log(v, " ==> ", Vector.copy(v)));
}

function testImports() {
  console.log("default: ", VDefault, "\nall: ", VAll);
  Object.entries(VAll).forEach(([k, v]) => {
    if(k !== "default") {
      console.log(`"${k}": ${eval(k) === v}
        Module[${k}] = ${v}
        ${k} = ${eval(k)}`);
    }
  });;
  console.log(`VDefault === Vector: ${VDefault === Vector}`);
}

function testInstance() {
  function logInstances(v) {
    console.log(v, `\n\tConstructor: ${v.constructor.name}
      instanceof Vector: ${v instanceof Vector}
      instanceof ImmutableVector: ${v instanceof ImmutableVector}
      instanceof MutableVector: ${v instanceof MutableVector}`);
  }
  [
    new Vector(3,4),
    new Vector.Immutable(3,4),
    new Vector.Mutable(3,4),
    {x: 3, y: 4}
  ].forEach(logInstances);
}
