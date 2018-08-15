export default class GestureManager {
  constructor() {

  }
  static startGesture(e, container) {
    gesture = new DrawnGesture(e.data.getLocalPosition(container), container, {weight: 2});
  }
  static gestureMove(e, container) {
    if(gesture && gesture.enabled) {
      gesture.addPoint(e.data.getLocalPosition(container));
    }
  }
  static endGesture(e) {
    if(gesture) {
      gesture.enabled = false;
      if(gesture.graphic) {
        gesture.graphic.endFill();
      }
    }
    console.log(gesture.points);
  }
}

let gesture;

export class DrawnGesture {
  constructor(startPoint, container, draw = true) {
    this.points = [startPoint];
    this.enabled = true;
    if(draw) {
      this.graphic = (gesture && gesture.graphic) ? gesture.graphic.clear() : new PIXI.Graphics();
      this.graphic.position.set(0, 0);
      //this.graphic.scale.set(0.1);
      this.lineWeight = 5;
      this.lineColour = 0x000000;
      if(typeof draw === "object") {
        if(draw.weight) {
          this.lineWeight = draw.weight;
        }
        if(draw.colour !== undefined) {
          this.lineColour = draw.colour;
        }
        if(draw.color !== undefined) {
          this.lineColour = draw.color;
        }
      }
      container.addChild(this.graphic);
    }
  }
  addPoint(point) {
    //let prev = this.points[this.points.length - 1];
    this.points.push(point);
    if(this.graphic) {
      this.draw();
    }
  }
  draw() {
    let start = this.points[0];
    this.graphic.clear()
      .lineStyle(this.lineWeight, this.lineColour)
      .moveTo(Math.round(start.x), Math.round(start.y));
    this.points.slice(1).forEach((p) => this.graphic.lineTo(Math.round(p.x), Math.round(p.y)));
    this.graphic.endFill();
  }
}
