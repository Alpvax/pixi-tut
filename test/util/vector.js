import VDefault, * as VAll from "../../util/vector.js";
import {Vector, ImmutableVector, MutableVector} from "../../util/vector.js";

//testImports();
//testCopy();
//testInstance();
//testImmutable();
testFunctions();

function makeTestVectors(x = 3, y = 4) {
  return [
    new Vector(x, y),
    new Vector.Immutable(x, y),
    new Vector.Mutable(x, y),
    {x, y}
  ];
}

function testFunctions() {
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
  makeTestVectors().forEach((v) => {
    console.log(`\n***********************\n${v.constructor.name}:\n***********************\n`);
    let tests = [
      ["add", [{x: 2, y: 3}]],              //Test  1
      ["subtract", [{x: 5, y: 7}]],         //Test  2
      ["invert", []],                       //Test  3
      ["inverted", []],                     //Test  4
      ["copy", []],                         //Test  5
      ["scale", [2]],                       //Test  6
      ["rotate", [Math.PI]],                //Test  7
      ["unit", []],                         //Test  8
      ["equals", [v]],                      //Test  9
      ["equals", [{x: 3, y: 4}]],           //Test 10
      ["equals", [{x: 4, y: 3}]],           //Test 11
      ["equals", [{x: 3.1, y: 4.1}]],       //Test 12
      ["equals", [{x: 3.1, y: 4.1}, 0.1]],  //Test 13
    ];
    tests.forEach(([k, val], num) => logFuncCall(num, v, k, ...val));
  });
}

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
  makeTestVectors().forEach((v) => {
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
  makeTestVectors().forEach((v) => console.log(v, " ==> ", Vector.copy(v)));
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
  makeTestVectors().forEach(logInstances);
}
