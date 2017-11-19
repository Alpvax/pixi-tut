function Bow(pageWidth, pageHeight) {
  this.size = pageWidth > pageHeight ? pageHeight / 10 : pageWidth / 10;
  this.pos = createVector(80, 140);
  this.drawback = createVector(this.pos.x, this.pos.y);
  let drawback = map(arrowVelocity, 5, 40, 0, this.size);

  this.draw = (arrowVel) => {
    this.drawback.x = this.pos.x + map(arrowVel, 5, 40, 0, -this.size / 2);
    push();
    stroke(70, 60, 25);
    fill(255, 0);
    strokeWeight(this.size / 10);
    curveTightness(-2.5);
    curve(this.drawback.x - this.size / 2, this.drawback.y, this.pos.x, this.pos.y - this.size / 2, this.pos.x, this.pos.y + this.size / 2, this.drawback.x - this.size / 2, this.drawback.y);
    strokeWeight(4);
    line(this.drawback.x, this.drawback.y, this.pos.x, this.pos.y - this.size / 2);
    line(this.drawback.x, this.drawback.y, this.pos.x, this.pos.y + this.size / 2);
    pop();
    push();
    stroke(83, 56, 30);
    strokeWeight(4);
    line(this.drawback.x, this.drawback.y, this.drawback.x + this.size, this.drawback.y);
    stroke(230);
    fill(195);
    triangle(this.drawback.x + this.size - 3, this.drawback.y - 1, this.drawback.x + this.size + 2, this.drawback.y, this.drawback.x + this.size - 3, this.drawback.y + 1);
    pop();
  }
}