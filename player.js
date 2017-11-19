function Player() {
  this.pos = createVector(width / 2, height / 2);
  this.size = 50;

  this.draw = () => {
    push();
    this.size = zoom / 2;
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.size);
    pop();
  };

  this.move = (x, y) => {
    this.pos.x += x;
    this.pos.y += y;
    if (this.pos.x > width) {
      this.pos.x = width;
    } else if (this.pos.x < 0) {
      this.pos.x = 0;
    }
    if (this.pos.y > height) {
      this.pos.y = height;
    } else if (this.pos.y < 0) {
      this.pos.y = 0;
    }
  };

  this.shoot = (clickX, clickY, vel) => {
    arrows.push(new Arrow(this.pos.x, this.pos.y, clickX, clickY, vel));
  }

  this.score = 0;

  this.drawScore = () => {
    let scoreBoardLength = 120 + Math.floor(Math.log10(this.score !== 0 ? this.score : 1)) * 10;
    push();
    fill(255, 80);
    stroke(80, 80);
    rect(25, 25, scoreBoardLength, 40);
    stroke(0);
    fill(0);
    textAlign(LEFT);
    textSize(24);
    text("Score: " + this.score, 40, 53);
    pop();
  }
}
