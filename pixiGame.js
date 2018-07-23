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
  let left  = keyboard(65),
      right = keyboard(68),
      up    = keyboard(87),
      down  = keyboard(83);

  //Left arrow key `press` method
  left.press = () => {
    //Change the spiderSprite's velocity when the key is pressed
    spiderSprite.vel.x = -5;
    spiderSprite.vel.y = 0;
  };
  
  //Left arrow key `release` method
  left.release = () => {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the spiderSprite isn't moving vertically:
    //Stop the spiderSprite
    if (!right.isDown && spiderSprite.vel.y === 0) {
      spiderSprite.vel.x = 0;
    }
  };

  //Up
  up.press = () => {
    spiderSprite.vel.y = -5;
    spiderSprite.vel.x = 0;
  };
  up.release = () => {
    if (!down.isDown && spiderSprite.vel.x === 0) {
      spiderSprite.vel.y = 0;
    }
  };

  //Right
  right.press = () => {
    spiderSprite.vel.x = 5;
    spiderSprite.vel.y = 0;
  };
  right.release = () => {
    if (!left.isDown && spiderSprite.vel.y === 0) {
      spiderSprite.vel.x = 0;
    }
  };

  //Down
  down.press = () => {
    spiderSprite.vel.y = 5;
    spiderSprite.vel.x = 0;
  };
  down.release = () => {
    if (!up.isDown && spiderSprite.vel.x === 0) {
      spiderSprite.vel.y = 0;
    }
  };

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

function keyboard(keyCode) {
  let key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
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