// Aliases
let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

let spiderSprite;
let state = play;

let app = new Application({width: 400, height: 400});
document.body.appendChild(app.view);

app.renderer.backgroundColor = 0xcecece;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoresize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

loader.add("Bug.png").load(setup);
function setup() {

  spiderSprite = new Sprite(resources["Bug.png"].texture);
  spiderSprite.vel = {x: 0, y: 0};

  // Input
  let left  = keyboard(/[aA]/, "ArrowLeft"),
      right = keyboard(/[dD]/, "ArrowRight"),
      up    = keyboard(/[wW]/, "ArrowUp"),
      down  = keyboard(/[sS]/, "ArrowDown");

  const speed = 5; //Max speed

  function updateVelocity() {
    let h = 0;
    let v = 0;
    if(left.isDown)   h -= 1;
    if(right.isDown)  h += 1;
    if(up.isDown)     v -= 1;
    if(down.isDown)   v += 1;
    let modifier = (h != 0 && v != 0) ? //Moving in both axes
          speed / Math.sqrt(2) : //adjust for diagonal movement (currently only 8-directional movement)
          speed; //Otherwise speed value can be used directly
    spiderSprite.vel.x = h * modifier;
    spiderSprite.vel.y = v * modifier;
    if(h != 0 || v != 0) { //If moving
      spiderSprite.rotation = (Math.PI / 2) + Math.atan2(v, h);
    }
  }

  [left, right, up, down].forEach((kb) => {
    kb.press = kb.release = updateVelocity;
  });

  spiderSprite.pivot.set(25, 0);
  spiderSprite.position.set(app.view.width / 2, app.view.height / 2);
  spiderSprite.scale.set(2);
  spiderSprite.rotation = Math.PI;
  app.stage.addChild(spiderSprite);

  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
  state(delta);
}

function play(delta) {
  // spiderSprite.x += Math.round(Math.random() * 2 * delta - 1);
  // spiderSprite.x = spiderSprite.x >= app.stage.width ? spiderSprite.x + 1 : spiderSprite.x - 1000;

  // spiderSprite.vel.x = Math.random() - 0.5;
  // spiderSprite.vel.y = Math.random() - 0.5;

  spiderSprite.x += spiderSprite.vel.x;
  spiderSprite.y += spiderSprite.vel.y;
}

function escapeRegexChars(string) {
  let specialChars = [ "$", "^", "*", "(", ")", "+", "[", "]", "{", "}", "\\", "|", ".", "?", "/" ];
  let regex = new RegExp("(\\" + specialChars.join("|\\") + ")", "g");
  return string.replace(regex, "\\$1");
}

function keyboard(...labels) {
  if(!labels) {
    console.warn(`Tried to register a keybind with no keys defined`);
  }
  let re = new RegExp("^(?:" + labels.map((l) => l instanceof RegExp ? l.source : l).join("|") + ")$");
  let key = {
    matcher: re,
    isDown: false,
    press: undefined,
    release: undefined,
    downHandler: (event) => {
      if(key.matcher.test(event.key) && !key.isDown) {
        key.isDown = true;
        if(key.press) {
          key.press(event.key);
        }
      }
      event.preventDefault();
    },
    upHandler: (event) => {
      if(key.matcher.test(event.key) && key.isDown) {
        key.isDown = false;
        if(key.release) {
          key.release(event.key);
        }
      }
      event.preventDefault();
    }
  };
  /*key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.keyCode === key.code) {
      if (!key.isDown && key.press) key.press();
      key.isDown = true;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
    }
    event.preventDefault();
  };*/

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}
