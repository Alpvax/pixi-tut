import Entity from "./Entity.js";
const resources = PIXI.loader.resources;

export default class SpiderSpawner extends Entity {
  constructor(rotationsPerSecond = 0.1) {
    super(new PIXI.Sprite(resources["Bug.png"].texture));
    this.sprite.scale.set(4);
    this.sprite.anchor.set(0.5, 0.5);
  }

  spawnSpider() {
    console.log("Spawning spider");
    let spider = new Entity(new PIXI.Sprite(resources["Bug.png"].texture), 4, 0.8);
    spider.sprite.scale.set(2);
    spider.sprite.anchor.set(0.5, 0.5);
    spider.sprite.rotation = Math.random() * 2 * Math.PI;
    spider.moveSpeed.addModifier({ key: "randomSpeed", baseMult: Math.random() + Math.random() }); //Add a random speed modifier, up to 2x
    spider.pos.x = this.pos.x;
    spider.pos.y = this.pos.y;
    return spider;
  }

  update(spiders) {
    super.update();
    if (spiders.length < 3 && Math.random() * 200 < 1) {
      spiders.push(this.spawnSpider());
    }
  }
}
