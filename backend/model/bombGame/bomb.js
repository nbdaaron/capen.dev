const { BOMB_DURATION, EXPLOSION_DURATION, OBJECTS } = require("./constants");
const { remove } = require("lodash");

class Bomb {
  constructor(owner, x, y, game) {
    this.owner = owner;
    this.position = [x, y];
    this.power = game.players[owner.id].power;
    this.exploded = false;
    this.game = game;
    this.spaces = [];

    game.players[owner.id].bombs -= 1;
    game.board[x][y] = OBJECTS.BOMB;

    this.timeout = setTimeout(() => this.explodeBomb(), BOMB_DURATION);
  }

  explodeBomb() {
    if (this.exploded) {
      return;
    }
    this.exploded = true;
    clearTimeout(this.timeout);
    const board = this.game.board;
    const [x, y] = this.position;

    // Player may have been eliminated
    if (this.game.players[this.owner.id]) {
      this.game.players[this.owner.id].bombs += 1;
    }

    this.spaces.push([x, y, false]);
    board[x][y] = OBJECTS.EXPLOSION_PARTICLE;
    // Explode up
    let tempX = x;
    let tempY = y - 1;
    let distance = 0;
    while (
      board[tempX][tempY] !== OBJECTS.WALL &&
      board[tempX][tempY] !== OBJECTS.BOX
    ) {
      this.spaces.push([tempX, tempY, false]);
      if (board[tempX][tempY] === OBJECTS.BOMB) {
        this.game.bombs
          .find((bomb) => {
            const [bombX, bombY] = bomb.position;
            return bombX === tempX && bombY === tempY;
          })
          .explodeBomb();
      }
      board[tempX][tempY] = OBJECTS.EXPLOSION_PARTICLE;
      tempY -= 1;
      distance++;
      if (distance === this.power) {
        break;
      }
    }
    if (board[tempX][tempY] === OBJECTS.BOX && distance < this.power) {
      this.spaces.push([tempX, tempY, true]);
      board[tempX][tempY] = OBJECTS.EXPLOSION_PARTICLE;
    }
    // Explode down
    tempX = x;
    tempY = y + 1;
    distance = 0;
    while (
      board[tempX][tempY] !== OBJECTS.WALL &&
      board[tempX][tempY] !== OBJECTS.BOX
    ) {
      this.spaces.push([tempX, tempY, false]);
      if (board[tempX][tempY] === OBJECTS.BOMB) {
        this.game.bombs
          .find((bomb) => {
            const [bombX, bombY] = bomb.position;
            return bombX === tempX && bombY === tempY;
          })
          .explodeBomb();
      }
      board[tempX][tempY] = OBJECTS.EXPLOSION_PARTICLE;
      tempY += 1;
      distance++;
      if (distance === this.power) {
        break;
      }
    }
    if (board[tempX][tempY] === OBJECTS.BOX && distance < this.power) {
      this.spaces.push([tempX, tempY, true]);
      board[tempX][tempY] = OBJECTS.EXPLOSION_PARTICLE;
    }

    // Explode left
    tempX = x - 1;
    tempY = y;
    distance = 0;
    while (
      board[tempX][tempY] !== OBJECTS.WALL &&
      board[tempX][tempY] !== OBJECTS.BOX
    ) {
      this.spaces.push([tempX, tempY, false]);
      if (board[tempX][tempY] === OBJECTS.BOMB) {
        this.game.bombs
          .find((bomb) => {
            const [bombX, bombY] = bomb.position;
            return bombX === tempX && bombY === tempY;
          })
          .explodeBomb();
      }
      board[tempX][tempY] = OBJECTS.EXPLOSION_PARTICLE;
      tempX -= 1;
      distance++;
      if (distance === this.power) {
        break;
      }
    }
    if (board[tempX][tempY] === OBJECTS.BOX && distance < this.power) {
      this.spaces.push([tempX, tempY, true]);
      board[tempX][tempY] = OBJECTS.EXPLOSION_PARTICLE;
    }

    // Explode right
    tempX = x + 1;
    tempY = y;
    distance = 0;
    while (
      board[tempX][tempY] !== OBJECTS.WALL &&
      board[tempX][tempY] !== OBJECTS.BOX
    ) {
      this.spaces.push([tempX, tempY, false]);
      if (board[tempX][tempY] === OBJECTS.BOMB) {
        this.game.bombs
          .find((bomb) => {
            const [bombX, bombY] = bomb.position;
            return bombX === tempX && bombY === tempY;
          })
          .explodeBomb();
      }
      board[tempX][tempY] = OBJECTS.EXPLOSION_PARTICLE;
      tempX += 1;
      distance++;
      if (distance === this.power) {
        break;
      }
    }
    if (board[tempX][tempY] === OBJECTS.BOX && distance < this.power) {
      this.spaces.push([tempX, tempY, true]);
      board[tempX][tempY] = OBJECTS.EXPLOSION_PARTICLE;
    }
    setTimeout(() => this.clearBomb(), EXPLOSION_DURATION);
  }

  clearBomb() {
    this.spaces.forEach(([x, y, wasBox]) => {
      if (!this.otherBombsExplodingOn(x, y)) {
        this.game.board[x][y] = OBJECTS.EMPTY;
        if (wasBox) {
          this.game.maybePutPowerup(x, y);
        }
      }
    });
    // Remove from list of bombs
    remove(this.game.bombs, (x) => this === x);
  }

  otherBombsExplodingOn(x, y) {
    for (var i = 0; i < this.game.bombs.length; i++) {
      const bomb = this.game.bombs[i];
      if (bomb === this) {
        continue;
      }
      if (
        bomb.exploded &&
        bomb.spaces.some(([otherX, otherY]) => x === otherX && y === otherY)
      ) {
        return true;
      }
    }
    return false;
  }
}

module.exports = Bomb;
