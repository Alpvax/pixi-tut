var player;
var arrows = [];
var spiders = [];
var zoom = 100;
var arrowVelocity = 8.2;
var paused = false;
var gameOver = false;
var bug;
var grass = [];
var bow;

function preload() {
  bug = loadImage("./Bug.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = new Player();
  noCursor();
  for (let i = 0; i < 12; i++) {
    grass[i] = new Tuft(random(width), random(height));
  }
  bow = new Bow(windowWidth, windowHeight);
}

function draw() {
  background(53, 95, 61);

  for (let i = 0; i < grass.length; i++) {
    grass[i].draw();
  }

  player.draw();

  if (spiders.length < Math.max(15, player.score / 4)) {
    if (Math.random() * (player.score / 1500 + 1) > 0.995) {
      let spiderX;
      let spiderY;
      let randomEdge = Math.floor(Math.random() * 4);
      do {
        switch (randomEdge) {
          case 0:
            // Left hand edge of screen
            spiderX = 0;
            spiderY = Math.floor(Math.random() * height);
            break;
          case 1:
            // Right hand edge of screen
            spiderX = width;
            spiderY = Math.floor(Math.random() * height);
            break;
          case 2:
            // Top edge of screen
            spiderX = Math.floor(Math.random() * width);
            spiderY = 0;
            break;
          case 3:
            // Bottom edge of screen
            spiderX = Math.floor(Math.random() * width);
            spiderY = height;
            break;
          default:
            print("Undefined edge: " + randomEdge);
            break;
        }
      } while (dist(spiderX, spiderY, player.pos.x, player.pos.y) <= 200);
      spiders.push(new Spider(spiderX, spiderY));
    }
  }

  for (let i = arrows.length - 1; i >= 0; i--) {
    if (arrows[i].base.x < 0 || arrows[i].base.x > width || arrows[i].base.y < 0 || arrows[i].base.y > height || arrows[i].vel <= 0) {
      arrows.splice(i, 1);
    } else {
      arrows[i].update();
      arrows[i].draw();
    }
  }

  for (let i = spiders.length - 1; i >= 0; i--) {
    if (!spiders[i].hit) {
      if (dist(spiders[i].pos.x, spiders[i].pos.y, player.pos.x, player.pos.y) <= spiders[i].size / 2 + player.size / 2) {
        gameOver = true;
      }
      for (let j = arrows.length - 1; j >= 0; j--) {
        if (dist(arrows[j].tip.x, arrows[j].tip.y, spiders[i].pos.x, spiders[i].pos.y) <= spiders[i].size / 2) {
          spiders[i].dead = true;
          spiders[i].hit = true;
          player.score++;
          spiders[i].vel *= -arrows[j].vel;
          if (arrows[j].vel > 10) {
            arrows[j].vel /= 0.01 * Math.pow(spiders[i].size, 1.5);
          } else {
            arrows.splice(j, 1);
          }
        }
      }
    }
    if (spiders[i].opacity <= 0) {
      spiders.splice(i, 1);
    }
    if (spiders[i]) {
      spiders[i].update(player.pos.x, player.pos.y);
      spiders[i].draw(bug, player.pos.x, player.pos.y);
    }
  }

  if (gameOver) {
    cursor();
    noLoop();
    push();
    fill(255, 80);
    noStroke();
    rectMode(CENTER);
    rect(width / 2, height / 2, 500, 200);
    stroke(0);
    fill(0);
    textAlign(CENTER);
    textSize(60);
    text("Game over.", width / 2, height / 2);
    push();
    fill(255)
    stroke(200);
    strokeWeight(2);
    rect(width / 2, height / 2 + 65, 240, 40);
    pop();
    textSize(20);
    text("Click here to play again.", width / 2, height / 2 + 70);
    pop();
  }

  player.drawScore();
  bow.draw(arrowVelocity);

  // Draw arrow velocity bar
  push();
  fill(255, 150);
  noStroke();
  rectMode(CORNER);
  rect(width / 4, 45, width / 6, 8);
  fill(170, 0, 0, 150);
  let barFill = map(arrowVelocity, 1, 40, 0, width / 6);
  rect(width / 4, 45, barFill, 8);
  pop();

  if (paused) {
    push();
    fill(255, 80);
    noStroke();
    rectMode(CENTER);
    rect(width / 2, height / 2, 500, 200);
    stroke(0);
    fill(0);
    textAlign(CENTER);
    textSize(38);
    text("Game is Paused.\nPress P to unpause.", width / 2, height / 2);
    pop();
  }

  stroke(255);
  line(mouseX, mouseY - 5, mouseX, mouseY + 5);
  line(mouseX - 5, mouseY, mouseX + 5, mouseY);

  if (keyIsDown(87) || keyIsDown(UP_ARROW)) { player.move(0, -5); }
  if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) { player.move(0, 5); }
  if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) { player.move(-5, 0); }
  if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) { player.move(5, 0); }

  if (mouseIsPressed) {
    arrowVelocity = Math.min(arrowVelocity *= 1.01, 40);
    if (!paused) {
      bow.draw(arrowVelocity);
    }
  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, true);
  if (paused) {
    push();
    imageMode(CENTER);
    image(bug, width / 2, height / 2 - 120, 100, 100);
    fill(130, 80);
    noStroke();
    rectMode(CENTER);
    rect(width / 2, height / 2, 800, 450);
    stroke(0);
    fill(0);
    textAlign(CENTER);
    textSize(40);
    text("Game is paused.\nPress P to unpause.", width / 2, height / 2);
    textSize(20);
    fill(100);
    stroke(100);
    text("Everything is white because the game doesn't redraw when paused.\nIf it does, the spiders advance 1 frame for every pixel your window resizes!", width / 2, height / 2 + 120);
    pop();
  }
}

function keyPressed() {
  if (key == 'P') {
    if (paused) {
      paused = false;
      noCursor();
      loop();
    } else {
      paused = true;
      cursor();
      noLoop();
    }
  }
}

function mouseReleased() {
  if (!paused) {
    player.shoot(mouseX, mouseY, arrowVelocity);
    arrowVelocity = map(player.size, 20, 150, 5, 20);
  }
}

function mouseWheel(event) {
  if (event.delta > 0) {
    zoom = Math.max(40, zoom - (0.25 * event.delta));
    arrowVelocity = map(player.size, 20, 150, 5, 20);
  } else {
    zoom = Math.min(300, zoom - (0.25 * event.delta));
    arrowVelocity = map(player.size, 20, 150, 5, 20);
  }
  return false;
}

function mouseClicked() {
  if (gameOver && mouseX > width / 2 - 120 && mouseX < width / 2 + 120 && mouseY > height / 2 + 45 && mouseY < height / 2 + 85) {
    player.size = 50;
    arrows = [];
    spiders = [];
    zoom = 100;
    arrowVelocity = 8.2;
    paused = false;
    gameOver = false;
    grass = [];
    setup();
    loop();
  }
}