new EntityFactory("spiderSpawner", () => {
  let sprite = new PIXI.Sprite(resources["Bug.png"].texture);
  sprite.scale.set(4);
  sprite.anchor.set(0.5, 0.5);
  return sprite;
}, (f,d) => new SpiderSpawner(f,d));
let spiderFactory = new EntityFactory("spider", () => {
    let sprite = new PIXI.Sprite(resources["Bug.png"].texture);
    sprite.scale.set(2);
    sprite.anchor.set(0.5, 0.5);
    sprite.rotation = Math.random() * 2 * Math.PI;
    sprite.interactive = true;
    return sprite;
  }, (factory, sprite, spawner, ...args) => {
    let spider = new Entity(factory, sprite, ...args);
    spider.moveSpeed.addModifier({key: "randomSpeed", baseMult: Math.random() + Math.random()});//Add a random speed modifier, up to 2x
    spider.pos.x = spawner.pos.x;
    spider.pos.y = spawner.pos.y;
    sprite.on("pointertap", (e) => {
      spiders = spiders.filter((s) => s !== spider);
      spider.kill();
    });
    return spider;
  }, 3);

class SpiderSpawner extends Entity {
  constructor(f, d, rotationsPerSecond = 0.1) {
    super(f, d, new PIXI.Sprite(resources["Bug.png"].texture), rotationsPerSecond);
  }

  spawnSpider() {
    console.log("Spawning spider");
    let spider = new Entity(new PIXI.Sprite(resources["Bug.png"].texture), 4, 0.8);
    spider.sprite.scale.set(2);
    spider.sprite.anchor.set(0.5, 0.5);
    spider.sprite.rotation = Math.random() * 2 * Math.PI;
    spider.sprite.interactive = true;
    spider.sprite.on("pointertap", (e) => {
      spiders = spiders.filter((s) => s !== spider);
    });
    spider.moveSpeed.addModifier({key: "randomSpeed", baseMult: Math.random() + Math.random()});//Add a random speed modifier, up to 2x
    spider.pos.x = this.pos.x;
    spider.pos.y = this.pos.y;
    return spider;
  }

  update() {
    super.update();
    if(spiderFactory.canSpawn && Math.random() * 200 < 1) {
      //spiders.push(this.spawnSpider());
      spiders.push(spiderFactory.create(this, 4, 0.8));
    }
  }
}
