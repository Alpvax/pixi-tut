import Attribute from "./Attribute.js";

export default class Entity {
  constructor(sprite, moveSpeed = 5, rotationsPerSecond = 1) {
    this.sprite = sprite;
    this.pos = { x: sprite.x, y: sprite.y };
    this.vel = { x: 0, y: 0 };
    this.targetRotation = sprite.rotation;
    this.moveSpeed = new Attribute(moveSpeed);
    this.rotationSpeed = new Attribute(Math.PI / (30 * rotationsPerSecond)); // 2* Math.PI / (fps * rps); fps = 60
  }

  update() {
    this.sprite.x = this.pos.x += this.vel.x;
    this.sprite.y = this.pos.y += this.vel.y;
    this.updateRotation();
  }

  rotateToPoint(point) {
    let x = point.x - this.pos.x;
    let y = point.y - this.pos.y;
    this.targetRotation = Math.PI / 2 + Math.atan2(y, x);
  }

  updateRotation() {
    let t = this.targetRotation;
    let c = this.sprite.rotation;
    let delta = Math.atan2(Math.sin(t - c), Math.cos(t - c));
    let r = this.rotationSpeed.value;
    if (Math.abs(delta) < r) {
      this.sprite.rotation = t;
    } else {
      this.sprite.rotation += Math.sign(delta) * r;
    }
  }
}
