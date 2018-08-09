class Entity {
  constructor(entityFactory, displayObj, moveSpeed = 5, rotationsPerSecond = 1) {
    Object.defineProperties(this, {
      factory: {
        value: entityFactory.key,
        configurable: false,
        enumerable: true,
        writable: false
      },
      entityFactoryObj: {
        get: () => entityFactory,
        configurable: false,
        enumerable: true,
        writable: false
      }
    });
    this.displayObj = displayObj;
    this.pos = {x: displayObj.x, y: displayObj.y};
    this.vel = {x: 0, y: 0};
    this.targetRotation = displayObj.rotation
    this.moveSpeed = new Attribute(moveSpeed);
    this.rotationSpeed = new Attribute(Math.PI / (30 * rotationsPerSecond)); // 2* Math.PI / (fps * rps); fps = 60
    this.dead = false;
  }

  update() {
    if(!this.dead) {
      this.displayObj.x = this.pos.x += this.vel.x;
      this.displayObj.y = this.pos.y += this.vel.y;
      this.updateRotation();
    } else {
      //this.displayObj.
    }
  }

  kill() {
    this.dead = true;
    this.entityFactoryObj.dead.push(this.displayObj);
  }

  rotateToPoint(point) {
    let x = point.x - this.pos.x;
    let y = point.y - this.pos.y;
    this.targetRotation = (Math.PI / 2) + Math.atan2(y, x);
  }

  updateRotation() {
    let t = this.targetRotation;
    let c = this.displayObj.rotation
    let delta = Math.atan2(Math.sin(t-c), Math.cos(t-c));
    let r = this.rotationSpeed.value;
    if(Math.abs(delta) < r) {
      this.displayObj.rotation = t;
    } else {
      this.displayObj.rotation += Math.sign(delta) * r;
    }
  }
}

class EntityFactory {
  constructor(key, createDO, createEntity, limit) {
    if(Entity.Factories.has(key)) {
      throw new Error("Factory already registered with key: " + key);
    }
    Object.defineProperty(this, "key", {
      value: key,
      configurable: false,
      enumerable: true,
      writable: false
    });
    this.limit = isNaN(limit) ? -1 : limit;//-1 = Unlimited
    this.dead = [];
    this.createNewDO = EntityFactory.__makeCreateFunc(createDO || key);
    this.createNewEntity = createEntity;
    Entity.Factories.set(key, this);
  }
  createDisplayObject() {
    if(this.limit < 0 || this.count < this.limit) {
      if(this.dead.length > 0) {
        return this.dead.unshift(); //FIFO order
      } else {
        return this.createNewDO(...arguments); //Pass arguments just in case they are used in future
      }
    }
    return false;
  }
  create(...entityArgs) {
    let display = this.createDisplayObject();
    if(display) {
      if(this.createNewEntity) {
        return this.createNewEntity(this, display, ...entityArgs);
      } else {
        return new Entity(this, display, ...entityArgs);
      }
    }
    return false;
  }
}
EntityFactory.__makeCreateFunc = function(create) {
  switch(typeof create) {
  case "function":
    return create;
  case "string":
    create = PIXI.loader.resources[create].texture;
  case "object":
    if(create instanceof PIXI.Sprite) {
      create = create.texture;
    }
    if(create instanceof PIXI.Texture) {
      return function() {
        return new PIXI.Sprite(create);
      }
    }
    if(create instanceof PIXI.Graphics) {
      return function() {
        return create.clone();
      }
    }
  }
  throw new Error("Unknown how to create a new PIXI.DisplayObject from: " + create);
}
Entity.Factories = new Map();
