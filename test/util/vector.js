import VDefault, * as VAll from "../../util/vector.js";
import {Vector, ImmutableVector, MutableVector} from "../../util/vector.js";

console.log(`default: ${VDefault}\nall: ${VAll}`);
Object.entries(VAll).forEach(([k, v]) => {
  console.log(`"${k}":
    \n\t*[${k}]: ${v}
    \n\t${k}: ${eval(k)}`);
});;

function testInstance() {
  function logInstances(v) {
    console.log(v, `\n\tConstructor: ${v.constructor}
      \n\tinstanceof Vector: ${v instanceof Vector}
      \n\tinstanceof ImmutableVector: ${v instanceof ImmutableVector}
      \n\tinstanceof MutableVector: ${v instanceof MutableVector}`);
  }
  [
    new Vector(3,4),
    new Vector.Immutable(3,4),
    new Vector.Mutable(3,4),
    {x: 3, y: 4}
  ].forEach(logInstances);
}
