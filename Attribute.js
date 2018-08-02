class Attribute {
  constructor(base) {
    this.baseValue = base;
    this.modifiers = new Map();
    this.cachedVal;
    /**Whether or not the value needs to be re-calculated*/
    this.dirty = true;
    this.listeners = [];
  }

  __markDirty() {
    this.dirty = true;
    this.listeners.forEach((l) => l(this.cachedVal));
  }

  /**
   * @param {function} listener A function called whenever the value is changed. Will recieve the attribute instance as an argument.
   * The old value can be retrieved with `(att) => att.cachedVal` and the new value can be calculated and retrieved with `(att) => att.value`
   * @returns the same `listener` passed in for convenience.
   */
  onChange(listener) {
    this.listeners.push(listener);
    return listener;
  }
  offChange(listener) {
    this.listeners.filter((l) => l !== listener);
  }

  getValue() {
    return this.value;
  }

  get value() {
    if(this.dirty) {
      let val = this.baseValue;
      let basemult = 1;
      let mult = 1;
      this.modifiers.forEach((v, k, m) => {
        if("baseAdd" in v) {
          val += v.baseAdd;
        }
        if("baseMult" in v) {
          basemult += v.baseMult - 1;
        }
        if("stackingMult" in v) {
          mult *= v.stackingMult;
        }
      });
      this.cachedVal = val * basemult * mult;
      this.dirty = false;
    }
    return this.cachedVal;
  }

  /**
   * @param {Object} modifier An object containing a "key" property and one or more of the following keys with numerical values:
   * @param {number} [modifier.baseAdd] Number to add to the base value before further calculations.
   * @param {number} [modifier.baseMult] Number to multiply the modified base value by. Does not stack, so 2 `2x` multipliers will be a `3x` multiplier in total.
   * @param {number} [modifier.stackingMult] Number to multiple the final value by. Stacks, so 2 `2x` multipliers will be a `4x` multiplier in total
   * @param {number} [baseAdd] If `modifier` was just the key, this will be the value used for the modifier baseAdd property
   * @param {number} [baseMult] If `modifier` was just the key, this will be the value used for the modifier baseMult property
   * @param {number} [stackingMult] If `modifier` was just the key, this will be the value used for the modifier stackingMult property
   *
   * @example  //Will increase the value by 3
   * attribute.addModifier({key: "exampleModifierKey", baseAdd: 3});
   * //Will multiply the (modified) base value by 2 (does not stack, so 2 *2 multipliers will be a x3 multiplier in total)
   * attribute.addModifier({key: "exampleModifierKey2", baseMult: 2});
   * //Will multiply the final value by 4 (stacks, so 2 *2 multipliers will be a *4 multiplier in total)
   * attribute.addModifier({key: "exampleModifierKey3", stackingMult: 4});
   *
   * //Not recommended, will add 0 to the base value, multiply the base value by 1 (i.e. do nothing), then multiply the final value by 4. (same as 3rd example)
   * attribute.addModifier("exampleModifierKey4", 0, 1, 4);
   * //Not recommended, does the same as above (undefined values have no effect). Slightly better performance than above, as ignored values won't be calculated.
   * attribute.addModifier("exampleModifierKey5", undefined, undefined, 4);
   */
  addModifier(modifier, baseAdd, baseMult, stackingMult) {
    if([baseAdd, baseMult, stackingMult].some((a) => a !== undefined)) {
      modifier = {key: modifier, baseAdd, baseMult, stackingMult};
    }
    if(!("key" in modifier)) {
      throw `Attempted to add modifier ${modifier} with no property "key".`;
    }
    let key = modifier.key;
    if(this.modifiers.has(key)) {
      throw `Attempted to add modifier ${modifier} with the same key (${key}) as an existing modifier: ${this.modifiers.get(key)}.`;
    }
    this.modifiers.set(key, modifier);
    this.__markDirty();
  }

  removeModifier(key) {
    let flag = this.modifiers.delete(key);
    if(flag) {//If it was actually removed
      this.__markDirty();
    }
    return flag;
  }
}
