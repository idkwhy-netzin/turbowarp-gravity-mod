class GravityMod {
  constructor() {
    // Default fallback internal state
    this.gravity = -1;
  }

  getInfo() {
    return {
      id: 'gravitymod',
      name: 'Gravity Mod',
      color1: '#4C6EF5', // Custom theme colors
      color2: '#3B5BDB',
      blocks: [
        {
          opcode: 'setGravity',
          blockType: Scratch.BlockType.COMMAND,
          text: 'set gravity to [GRAVITY]',
          arguments: {
            GRAVITY: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: -1
            }
          }
        },
        {
          opcode: 'changeGravityBy',
          blockType: Scratch.BlockType.COMMAND,
          text: 'change gravity by [CHANGE]',
          arguments: {
            CHANGE: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: -0.5
            }
          }
        },
        {
          opcode: 'getGravity',
          blockType: Scratch.BlockType.REPORTER,
          text: 'gravity'
        },
        {
          opcode: 'applyGravity',
          blockType: Scratch.BlockType.COMMAND,
          text: 'apply gravity with y-velocity [YVEL] friction [FRICTION]',
          arguments: {
            YVEL: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'y vel'
            },
            FRICTION: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0.98
            }
          }
        }
      ]
    };
  }

  setGravity(args, util) {
    const stage = util.target.runtime.getTargetForStage();
    if (stage) {
      stage.gravityValue = Scratch.Cast.toNumber(args.GRAVITY);
    } else {
      this.gravity = Scratch.Cast.toNumber(args.GRAVITY);
    }
  }

  changeGravityBy(args, util) {
    const stage = util.target.runtime.getTargetForStage();
    const change = Scratch.Cast.toNumber(args.CHANGE);
    if (stage) {
      if (typeof stage.gravityValue !== 'number') stage.gravityValue = -1;
      stage.gravityValue += change;
    } else {
      this.gravity += change;
    }
  }

  getGravity(args, util) {
    const stage = util.target.runtime.getTargetForStage();
    if (stage && typeof stage.gravityValue === 'number') {
      return stage.gravityValue;
    }
    return this.gravity;
  }

  applyGravity(args, util) {
    const sprite = util.target;
    if (sprite.isStage) return;

    const stage = util.target.runtime.getTargetForStage();
    const currentGravity = (stage && typeof stage.gravityValue === 'number') ? stage.gravityValue : this.gravity;
    
    const varName = args.YVEL;
    const friction = Scratch.Cast.toNumber(args.FRICTION);
    
    // Find sprite or global variable
    let variable = sprite.lookupVariableByNameAndType(varName, '');
    if (!variable) return;

    let yVelValue = Scratch.Cast.toNumber(variable.value);
    
    // Core Physics math: pull down by gravity, then apply friction
    yVelValue += currentGravity;
    yVelValue *= friction;
    
    // Update variable value
    variable.value = yVelValue;
    
    // Change sprite's actual Y position
    sprite.setY(sprite.y + yVelValue);
  }
}

Scratch.extensions.register(new GravityMod());
