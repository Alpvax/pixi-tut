function Tuft(x, y) {
  this.pos = createVector(x, y);

  this.draw = () => {
    push();
    stroke(9, 48, 19);
    noStroke();
    strokeWeight(2);
    fill(26, 73, 38);
    triangle(this.pos.x - 15, this.pos.y, this.pos.x - 12, this.pos.y - 25, this.pos.x - 4, this.pos.y);
    triangle(this.pos.x + 15, this.pos.y, this.pos.x + 12, this.pos.y - 23, this.pos.x + 4, this.pos.y);
    triangle(this.pos.x - 7, this.pos.y, this.pos.x, this.pos.y - 32, this.pos.x + 7, this.pos.y);
    pop();
  }
}