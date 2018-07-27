// Aliases
let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

let spiderSprite;
let state = play;

const speed = 5; //Max speed
//const rotSpeed = 2* Math.PI / (fps * rpm)
const rotSpeed = Math.PI / 30; //PI/30 = 1 full revolution per second maximum at 60FPS.
let rotMod = 1;

let app = new Application({width: 400, height: 400});
document.body.appendChild(app.view);

let interaction = app.renderer.plugins.interaction;

app.renderer.backgroundColor = 0xcecece;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoresize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

loader.add("Bug.png")
  .on("progress", (loader, resource) => {
    console.debug(`Loading: ${loader.progress}%. Loaded ${resource.url}`);
  })
  .load(setup);
function setup() {

  spiderSprite = new Sprite(resources["Bug.png"].texture);
  spiderSprite.vel = {x: 0, y: 0};

  // Input
  let left  = keyboard(/[aA]/, "ArrowLeft"),
      right = keyboard(/[dD]/, "ArrowRight"),
      up    = keyboard(/[wW]/, "ArrowUp"),
      down  = keyboard(/[sS]/, "ArrowDown");

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
    /*if(h != 0 || v != 0) { //If moving
      spiderSprite.rotation = (Math.PI / 2) + Math.atan2(v, h);
    }*/
  }

  [left, right, up, down].forEach((kb) => {
    kb.press = kb.release = updateVelocity;
  });

  // Pointers normalize touch and mouse
  interaction.on('pointerdown', () => {rotMod = 1/2;});
  interaction.on('pointerup', () => {rotMod = 1;});

  spiderSprite.anchor.set(0.5, 0.5);
  spiderSprite.position.set(app.view.width / 2, app.view.height / 2);
  spiderSprite.scale.set(2);
  spiderSprite.rotation = spiderSprite.targetRotation = Math.PI;
  app.stage.addChild(spiderSprite);

  app.ticker.add(delta => gameLoop(delta));
}

function rotateToPoint(sprite, point) {
  let x = point.x - sprite.x;
  let y = point.y - sprite.y;
  sprite.targetRotation = (Math.PI / 2) + Math.atan2(y, x)
  //sprite.targetRotation = Math.atan2(Math.sin(x-y), Math.cos(x-y));
}

function updateRotation(sprite) {
  let t = sprite.targetRotation;
  let c = sprite.rotation
  let delta = Math.atan2(Math.sin(t-c), Math.cos(t-c));
  let r = rotSpeed * rotMod;
  if(Math.abs(delta) < r) {
    sprite.rotation = sprite.targetRotation;
  } else {
    sprite.rotation += Math.sign(delta) * r;
  }
}

function gameLoop(delta) {
  state(delta);
}

function play(delta) {
  rotateToPoint(spiderSprite, interaction.mouse.global);

  spiderSprite.x += spiderSprite.vel.x;
  spiderSprite.y += spiderSprite.vel.y;
  updateRotation(spiderSprite);
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
