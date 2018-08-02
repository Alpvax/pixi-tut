// Aliases
const loader = PIXI.loader,
    resources = PIXI.loader.resources;

let app = new PIXI.Application({width: 400, height: 400});
document.body.appendChild(app.view);
let interaction = app.renderer.plugins.interaction;

app.renderer.backgroundColor = 0xcecece;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoresize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

let player;
let state = play;

loader.add("Bug.png")
  .on("progress", (loader, resource) => {
    console.debug(`Loading: ${loader.progress}%. Loaded ${resource.url}`);
  })
  .load(setup);

function setup() {
  let playerSprite = new PIXI.Sprite(resources["Bug.png"].texture);
  playerSprite.anchor.set(0.5, 0.5);
  playerSprite.position.set(app.view.width / 2, app.view.height / 2);
  playerSprite.scale.set(2);
  playerSprite.rotation = Math.PI;
  app.stage.addChild(playerSprite);

  player = new Entity(playerSprite);
  player.moveSpeed.onChange(updateVelocity);//Update velocity accepts no args, so att inst will be ignored

  // Input
  let left  = keyboard(/[aA]/, "ArrowLeft"),
      right = keyboard(/[dD]/, "ArrowRight"),
      up    = keyboard(/[wW]/, "ArrowUp"),
      down  = keyboard(/[sS]/, "ArrowDown");

  function updateVelocity() {
    let speed = player.moveSpeed.value;
    let h = 0;
    let v = 0;
    if(left.isDown)   h -= 1;
    if(right.isDown)  h += 1;
    if(up.isDown)     v -= 1;
    if(down.isDown)   v += 1;
    let modifier = (h != 0 && v != 0) ? //Moving in both axes
          speed / Math.sqrt(2) : //adjust for diagonal movement (currently only 8-directional movement)
          speed; //Otherwise speed value can be used directly
    player.vel.x = h * modifier;
    player.vel.y = v * modifier;
  }

  [left, right, up, down].forEach((kb) => {
    kb.press = kb.release = updateVelocity;
  });

  // Pointers normalize touch and mouse
  interaction.on('pointerdown', () => {
    player.rotationSpeed.addModifier({key: "combatMode", baseMult: 0.5});
    player.moveSpeed.addModifier({key: "combatMode", baseMult: 0.3});
  });
  interaction.on('pointerup', () => {
    player.rotationSpeed.removeModifier("combatMode");
    player.moveSpeed.removeModifier("combatMode");
  });

  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
  state(delta);
}

function play(delta) {
  player.rotateToPoint(interaction.mouse.global);

  player.update();
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
  let re = new RegExp("^(?:" + labels.map((l) => l instanceof RegExp ? l.source : escapeRegexChars(l)).join("|") + ")$");
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

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}
