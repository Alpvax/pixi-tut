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
    //gesture.normalisePoints();
  }
}

const DIST_THRESHOLD = 20;
const ROT_THRESHOLD = Math.PI / 8; //1/16th of a circle

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
    this.points.slice(1).forEach((p) => this.graphic.lineTo(p.x, p.y));
    this.graphic.endFill();
  }
  normalisePoints() {
    let deltas = this.points.reduce((res, vec) => {
      if(res.prev) {
        let d = vec.magnitude - res.prev.magnitude;
        let r = vec.angle - res.prev.angle;
        res.vecs.push({
          distance: Math.abs(d) < DIST_THRESHOLD ? 0 : Math.sign(d),
          rotation: Math.abs(r) < ROT_THRESHOLD ? 0 : Math.sign(r),
        });
      }
      res.prev = vec;
      return res;
    }, {vecs: [], prev: undefined}).vecs;
    let points = deltas.reduce((res, vec) => {
      if(res.length > 0) {
        let prev = res.pop();
        let next;
        /**Distance unchanged*/
        let d = Math.sign(prev.distance) === Math.sign(vec.distance);
        /**Rotation unchanged*/
        let r = Math.sign(prev.rotation) === Math.sign(vec.rotation);
        if(d && r) {
          prev.magnitude++;
        } else {
          next = Object.assign(vec, {magnitude: 1});
        }
        res.push(prev);
        if(next) {
          res.push(next);
        }
      } else {
        res.push(Object.assign(vec, {magnitude: 1}));
      }
      return res;
    }, []);
    console.log(points);
  }
}
