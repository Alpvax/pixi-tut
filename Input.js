"use strict";

import defaultKeybindings from "./defaultKeys.js";

const Input = new Map();

export class InputAction {
  constructor(id, toggleable, callbacks) {
    this.id = id;
    this.toggleable = toggleable;
    this.keybinds = new Map();
    this.__toggleState = false;
    this.activeKeybinds = new Map();
    this.callbacks = Object.assign({onChange(){}, onTrigger(){}}, callbacks);
    Input.set(id, this);
  }
  toggle() {
    //console.log("Toggling!");
    this.__toggleState = !this.__toggleState;
    this.callbacks.onChange(this);
  }
  updateActiveState(keybind) {
    if(this.toggleable) {
      let key = keybind.key;
      let keyActive = this.activeKeybinds.has(key);
      if(!keybind.toggle && keyActive !== keybind.isDown) { //Toggle keybinds will not be added as active, as they use the shared __toggleState variable.
        if(keyActive) { //Was previously active
          this.activeKeybinds.delete(key);
        } else { //Was not previously active
          this.activeKeybinds.set(key, true);//Actual value is irrelevant, size of map is what is checked.
        }
        this.callbacks.onChange(this);
      }
    }
  }
  trigger() {
    this.callbacks.onTrigger(this);
  }
  onChange(callback) {
    this.callbacks.onChange = callback;
  }
  onTrigger(callback) {
    this.callbacks.onTrigger = callback;
  }
  get active() {
    return this.toggleable && this.__toggleState != this.activeKeybinds.size > 0;
  }
}

export class Keybind {
  /**
   * @param {InputAction} action The InputAction to trigger
   * @param {string} key The key name (i.e. "Enter") for use in the display.
   * @param {string} [code] The physical key (ignores difference in keyboard layout). Must be one of the values found at https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code#Code_values
   * @param {object} [options] The options for the keybind. As follows:
   * @param {boolean} [options.onup]
   * @param {boolean} [options.toggle]
   * @param
   * @param {boolean} [options.onup=false] If `true`, and the action is an instant trigger or a toggle, will trigger/toggle on keyup instead of keydown. Default = `false`.
   * @param {boolean} [options.toggle=false] If `true` and the action is toggleable, will toggle the action state on each keypress, rather than having to be held down. Default = `false`
   */
  constructor(action, key, options, code) {
    this.isDown = false;
    this.action = action;
    this.onup = options && !!options.onup;
    this.toggle = this.action.toggleable && options && !!options.toggle;
    this.key = key;
    this.code = code;
    this.action.keybinds.set(this.key, this);//TODO:Multi-key
    //Keybind.keybinds.push(this);
    window.addEventListener("keydown", this.downHandler.bind(this), false);
    window.addEventListener("keyup", this.upHandler.bind(this), false);
  }
  handle(event, down) {
    if(this.match(event)) {
      if(down !== this.isDown) {//Prevent repeat events
        //console.log(`Press: ${down}; TriggerOnDown: ${!this.onup}; ShouldTrigger: ${down !== this.onup};`);//XXX
        this.isDown = down;
        this.action.updateActiveState(this);
        if(down !== this.onup) {
          if(this.toggle) {
            this.action.toggle();
          } else {
            this.action.trigger();
          }
        }
      }
      event.preventDefault();
    }
  }
  __trigger(release) {

  }
  match(event) {
    return (this.code && this.code === event.code) || this.key === event.key;
  }
  downHandler(event) {
    this.handle(event, true);
  }
  upHandler(event) {
    this.handle(event, false);
  }
}
//Keybind.keybinds = [];

function defineKeybind(path, defaultKey) {
  Keybinds.set(new Keybind(defaultKey))
}

Object.entries(defaultKeybindings).forEach((key, input) => {
  //TODO: Load
});


function escapeRegexChars(string) {
  let specialChars = [ "$", "^", "*", "(", ")", "+", "[", "]", "{", "}", "\\", "|", ".", "?", "/" ];
  return string.replace(new RegExp("(\\" + specialChars.join("|\\") + ")", "g"), "\\$1");
}
