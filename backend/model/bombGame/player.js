const { WIDTH_IN_BLOCKS, HEIGHT_IN_BLOCKS, KEY } = require("./constants");

class Player {
  constructor(user, index) {
    this.position = Player.getStartingPosition(index);
    this.direction = Player.getStartingDirection(index);
    this.moving = false;
    this.speed = 0.2;
    this.bombs = 1;
    this.power = 1;
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
    // Validate position
    const leeway = 200;
    const deltaTime = Date.now() - this.lastUpdateTime;
    const radius = deltaTime * newPlayer.speed + leeway;

    const [oldX, oldY] = this.position;
    const [newX, newY] = newPlayer.position;

    if (newX - oldX > radius || newY - oldY > radius) {
      // Hacking/cheating attempt??? Ignore this packet for now.
      return;
    }

    this.position = newPlayer.position;
    this.direction = newPlayer.direction;
    this.moving = newPlayer.moving;
  }
}

module.exports = Player;
