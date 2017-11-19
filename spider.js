function Spider(x, y) {
  this.pos = createVector(x, y);
  this.size = Math.max(Math.ceil(Math.random() * 10) * 10, 32);
  this.vel = (20 + Math.pow((player.score + 1), 1.2))/ this.size;
  this.dead = false;
  this.opacity = 255;
  this.hit = false;
  this.sinAngle;
  this.cosAngle;
  this.radius;

  this.draw = (bug, playerX, playerY) => {

    push();
    imageMode(CENTER);
    translate(this.pos.x, this.pos.y);
    let radius = dist(this.pos.x, this.pos.y, playerX, playerY);
    let sinAngle = (playerX - this.pos.x) / radius;
    let cosAngle = (playerY - this.pos.y) / radius;
    rotate(Math.atan2(cosAngle, sinAngle) + PI / 2.0);
    tint(255, this.opacity);
    image(bug, 0, 0, this.size, this.size);
    pop();
  }

  this.update = (playerX, playerY) => {
    this.radius = dist(this.pos.x, this.pos.y, playerX, playerY);
    this.sinAngle = (playerX - this.pos.x) / this.radius;
    this.cosAngle = (playerY - this.pos.y) / this.radius;
    this.pos.x += this.vel * this.sinAngle;
    this.pos.y += this.vel * this.cosAngle;
    if (this.dead) {
      this.opacity -= 10;
      this.vel *= 0.8;
    }
  }

}