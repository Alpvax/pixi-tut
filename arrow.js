function Arrow(startX, startY, clickX, clickY, velocity) {

  this.radius = dist(startX, startY, clickX, clickY);
  this.sinAngle = (clickX - startX) / this.radius;
  this.cosAngle = (clickY - startY) / this.radius;
  this.base = createVector(startX, startY);
  this.tip = createVector(startX + this.sinAngle * 25, startY + this.cosAngle * 25);
  this.arrowTip = new arrowTip(this.tip.x, this.tip.y, this.sinAngle, this.cosAngle);
  this.vel = velocity;

  this.update = () => {
    this.base.x += this.vel * this.sinAngle;
    this.base.y += this.vel * this.cosAngle;
    this.tip.x += this.vel * this.sinAngle;
    this.tip.y += this.vel * this.cosAngle;
    this.arrowTip.update(this.vel, this.sinAngle, this.cosAngle);
    this.vel -= 0.85 / Math.pow(this.vel, 0.95);
  }

  this.draw = () => {
    this.arrowTip.draw();
    push();
    stroke(83, 56, 30);
    strokeWeight(2);
    line(this.base.x, this.base.y, this.tip.x, this.tip.y);
    pop();
  }

}

function arrowTip(tipX, tipY, sinAngle, cosAngle) {
  this.tipX = tipX + sinAngle * 4;
  this.tipY = tipY + cosAngle * 4;
  this.leftX = tipX + (sinAngle - PI/8) * 4;
  this.leftY = tipY + (cosAngle - PI/8) * 4;
  this.rightX = tipX + (sinAngle + PI/8) * 4;
  this.rightY = tipY + (cosAngle + PI/8) * 4;

  this.draw = () => {
    push();
    stroke(230);
    strokeWeight(2);
    fill(200);
    triangle(
      this.tipX, this.tipY,
      this.leftX, this.leftY,
      this.rightX, this.rightY
    )
    pop();
  }
  this.update = (velocity, sinAngle, cosAngle) => {
    this.tipX += velocity * sinAngle;
    this.tipY += velocity * cosAngle;
    this.leftX += velocity * sinAngle;
    this.leftY += velocity * cosAngle;
    this.rightX += velocity * sinAngle;
    this.rightY += velocity * cosAngle;
  }
}
