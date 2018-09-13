/*eslint-disable no-unused-vars*/
import vector from "./util/vector.test.js";

window.assert = chai.assert;
export default window.expect = chai.expect;
/*eslint-enable*/

chai.use(function(chai, utils) {
  function testEquivalency(...args) {
    let obj = this._obj;
    let {eqv, passSelf} = utils.flag(this, "equivalent");
    if(typeof passSelf === "number" && passSelf >= 0) {
      args.splice(passSelf, 0, obj);
    }
    let func;
    if(eqv) {
      switch(typeof eqv) {
        case "function":
          func = eqv;
          break;
        case "string":
        case "symbol":
          func = (...args) => obj[eqv](...args);
          break;
        default:
          func = (...args) => obj.equals(...args);
      }
    } else { //Default to ==. Does not accept multiple args
      func = (arg) => obj == arg;
    }
    function objectify(...args) {
      args = args.map((obj) => obj.toString !== Object.prototype.toString ? obj.toString() : obj);
      return args.length === 1 ? args[0] : args;
    }
    this.assert(
      func(...args),
      "expected #{act} to be equivalent to #{exp}",
      "expected #{act} to not be equivalent to #{exp}",
      objectify(...args),        // expected
      objectify(obj)
    );
  }
  function setEquivalent(eqv = true, passSelf = false) {
    utils.flag(this, "equivalent", {eqv, passSelf});
  }
  chai.Assertion.addProperty("the");
  chai.Assertion.addChainableMethod("same", setEquivalent, setEquivalent); //Completely overwrites existing property
  chai.Assertion.addChainableMethod("equivalent", setEquivalent, setEquivalent);
  chai.Assertion.addChainableMethod("to", testEquivalency); //Completely overwrites existing property
  chai.Assertion.addMethod("as", testEquivalency);
});

vector.expect();
//chai.use(vector.plugin);
