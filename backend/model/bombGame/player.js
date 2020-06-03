const { WIDTH_IN_BLOCKS, HEIGHT_IN_BLOCKS, KEY } = require("./constants");

class Player {
  constructor(user, index) {
    this.position = Player.getStartingPosition(index);
    this.direction = Player.getStartingDirection(index);
    this.moving = false;
    this.speed = 0.2;
    this.bombs = 1;
    this.power = 1;
    this.lastUpdateTime = Date.now();
  }

  static getStartingPosition(index) {
    if (index === 0) {
      return [100, 100];
    } else if (index === 1) {
      return [WIDTH_IN_BLOCKS * 100 - 200, HEIGHT_IN_BLOCKS * 100 - 200];
    } else if (index === 2) {
      return [100, HEIGHT_IN_BLOCKS * 100 - 200];
    } else if (index === 3) {
      return [WIDTH_IN_BLOCKS * 100 - 200, 100];
    } else {
      throw new Error("Bomb Game doesn't support more than 4 players!");
    }
  }

  static getStartingDirection(index) {
    if (index === 0) {
      return KEY.RIGHT;
    } else if (index === 1) {
      return KEY.LEFT;
    } else if (index === 2) {
      return KEY.UP;
    } else if (index === 3) {
      return KEY.DOWN;
    } else {
      throw new Error("Bomb Game doesn't support more than 4 players!");
    }
  }

  update(newPlayer) {
    if (this.validatePosition(newPlayer.position)) {
      this.position = newPlayer.position;
      this.direction = newPlayer.direction;
      this.moving = newPlayer.moving;
    }
    this.lastUpdateTime = Date.now();
  }

  validatePosition(newPosition) {
    // Validate position
    const leeway = 200;
    const deltaTime = Date.now() - this.lastUpdateTime;
    const radius = deltaTime * this.speed + leeway;

    const [oldX, oldY] = this.position;
    const [newX, newY] = newPosition;

    if (newX - oldX > radius || newY - oldY > radius) {
      // Hacking/cheating attempt???
      return false;
    }
    return true;
  }
}

module.exports = Player;
