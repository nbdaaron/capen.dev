import React from 'react';
import {
  updatePlayer,
  plantBomb,
  killPlayer,
  //lootPowerup,
  listenForGameUpdates,
  stopListenForGameUpdates,
} from '../server/bombGame';
import { getApproxLatency } from '../server/socket';
import './BombGame.css';

// KEEP IN SYNC WITH backend/games/bombGame
const WIDTH_IN_BLOCKS = 19;
const HEIGHT_IN_BLOCKS = 19;

const OBJECTS = {
  EMPTY: 0, // Nothing on space
  WALL: 1, // Unbreakable wall
  BOX: 2, // Breakable wall (with bombs)
  BOMB: 3, // Bomb
  EXTRA_BOMB_POWERUP: 11, // +1 Bomb Powerup
  EXTRA_POWER_POWERUP: 12, // +1 Explosion Radius Powerup
  EXTRA_SPEED_POWERUP: 13, // +1 Movement Speed Powerup
  EXPLOSION_PARTICLE: 99, // Explosion Particle
};

const KEY = {
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};

// Update server with my state every 200ms.
const REFRESH_RATE = 300;

const isArrowKey = event => event.keyCode >= KEY.LEFT && event.keyCode <= KEY.DOWN;
const isSpaceKey = event => event.keyCode === KEY.SPACE;

class BombGame extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    // Component shouldn't need to re-render at all. Just keep redrawing canvas.
    this.boardState = {
      board: BombGame.initialBoardState(),
      players: {}, // id --> position, direction, moving, speed, bombs, power
      lastMessageTimestamp: -1, // used for movement prediction
      lastDrawTimestamp: -1, // used to move character
    };

    this.gameLoop = this.gameLoop.bind(this);
    this.gameUpdateHandler = this.gameUpdateHandler.bind(this);
    this.buildBoard = this.buildBoard.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.gameUpdateHandler = this.gameUpdateHandler.bind(this);
  }

  static initialBoardState() {
    // HEIGHTxWIDTH grid with zeroes.
    const board = Array(WIDTH_IN_BLOCKS)
      .fill()
      .map(() => Array(HEIGHT_IN_BLOCKS).fill(0));
    const lastX = WIDTH_IN_BLOCKS - 1;
    const lastY = HEIGHT_IN_BLOCKS - 1;
    for (var x = 0; x < WIDTH_IN_BLOCKS; x++) {
      for (var y = 0; y < HEIGHT_IN_BLOCKS; y++) {
        // Fill in all edges with walls
        if (x === 0 || y === 0 || x === lastX || y === lastY) {
          board[x][y] = OBJECTS.WALL;
        }
        // Fill in wall objects within map.
        else if (x % 2 === 0 && y % 2 === 0) {
          board[x][y] = OBJECTS.WALL;
        }
      }
    }

    return board;
  }

  gameLoop() {
    // 1. If it has been awhile since the last server packet,
    // stop other players from moving.
    if (
      this.boardState.lastMessageTimestamp !== -1 &&
      Date.now() - this.boardState.lastMessageTimestamp > 1000
    ) {
      Object.keys(this.boardState.players).forEach(playerId => {
        // eslint-disable-next-line eqeqeq
        if (playerId != this.props.user.id) {
          this.boardState.players[playerId].moving = false;
        }
      });
    }

    // 2. Move players since last game loop
    if (this.boardState.lastDrawTimestamp !== -1) {
      const timeDelta = Date.now() - this.boardState.lastDrawTimestamp;
      Object.values(this.boardState.players).forEach(player => {
        player.position = this.tryMove(player, timeDelta);
      });
    }

    // 2. Redraw canvas
    this.buildBoard();

    // 3. Check if player touched powerup or bomb.
    this.checkPlayerCollision();

    // Continue game loop
    this.animationFrameId = window.requestAnimationFrame(this.gameLoop);
    this.boardState.lastDrawTimestamp = Date.now();
  }

  // Called whenever we receive a response from the server
  // with the updated game state.
  gameUpdateHandler({ board, players }) {
    // Jerk all players into correct positions (according to server).
    // Display where the server thinks we are now.
    // We can estimate this using what the server sent us
    // and our estimated server-to-client latency.
    const timeDelta = getApproxLatency() / 2;
    Object.keys(players).forEach(id => {
      const player = players[id];
      const localPlayer = this.boardState.players[id];
      // eslint-disable-next-line eqeqeq
      if (id == this.props.user.id) {
        if (!this.validateServerPosition(localPlayer, players[id])) {
          player.position = this.tryMove(player, timeDelta);
        } else {
          player.position = localPlayer.position;
          player.direction = localPlayer.direction;
          player.moving = localPlayer.moving;
        }
      } else {
        player.position = this.tryMove(player, timeDelta);
      }
    });

    this.boardState = {
      ...this.boardState,
      board,
      players,
      lastMessageTimestamp: Date.now(),
    };

    const playerId = this.props.user.id;
    if (players[playerId] && !this.updateServerLoop) {
      this.updateServerLoop = window.setInterval(
        () => updatePlayer(this.boardState.players[playerId]),
        REFRESH_RATE
      );
    }
  }

  validateServerPosition(clientPlayer, serverPlayer) {
    if (!clientPlayer) {
      return false;
    }

    const leeway = 500;
    const radius = (clientPlayer.speed * getApproxLatency()) / 2 + leeway;

    const [clientX, clientY] = clientPlayer.position;
    const [serverX, serverY] = serverPlayer.position;
    if (Math.abs(serverY - clientY) > radius) {
      return false;
    }
    if (Math.abs(serverX - clientX) > radius) {
      return false;
    }

    return true;
  }

  // Attempts to move the player according to elapsed time.
  // Returns the new position of the player.
  tryMove(player, timeDelta) {
    if (!player.moving) {
      return player.position;
    }
    const helperWindow = 30;

    const [playerX, playerY] = player.position;
    const canMoveUpDown = (playerX + 100) % 200 === 0;
    const canMoveLeftRight = (playerY + 100) % 200 === 0;
    let actualDirection = player.direction;

    if (
      !canMoveUpDown &&
      (player.direction === KEY.DOWN || player.direction === KEY.UP)
    ) {
      // If close to being able to up/move down, slightly modify x coordinate.
      if ((playerX + 100 + helperWindow) % 200 < helperWindow) {
        actualDirection = KEY.RIGHT;
      } else if ((playerX + 100) % 200 < helperWindow) {
        actualDirection = KEY.LEFT;
      } else {
        return player.position;
      }
    } else if (
      !canMoveLeftRight &&
      (player.direction === KEY.LEFT || player.direction === KEY.RIGHT)
    ) {
      // If close to being able to move left/right, slightly modify y coordinate.
      if ((playerY + 100 + helperWindow) % 200 < helperWindow) {
        actualDirection = KEY.DOWN;
      } else if ((playerY + 100) % 200 < helperWindow) {
        actualDirection = KEY.UP;
      } else {
        return player.position;
      }
    }

    let [newX, newY] = player.position;
    const usingHelper = actualDirection !== player.direction;
    if (actualDirection === KEY.UP) {
      newY -= timeDelta * player.speed;
      newY = usingHelper ? Math.max(Math.floor(playerY / 100) * 100, newY) : newY;
    } else if (actualDirection === KEY.DOWN) {
      newY += timeDelta * player.speed;
      newY = usingHelper ? Math.min(Math.floor(playerY / 100 + 1) * 100, newY) : newY;
    } else if (actualDirection === KEY.LEFT) {
      newX -= timeDelta * player.speed;
      newX = usingHelper ? Math.max(Math.floor(playerX / 100) * 100, newX) : newX;
    } else if (actualDirection === KEY.RIGHT) {
      newX += timeDelta * player.speed;
      newX = usingHelper ? Math.min(Math.floor(playerX / 100 + 1) * 100, newX) : newX;
    }

    let newBoardX, newBoardY;
    if (actualDirection === KEY.RIGHT) {
      [newBoardX, newBoardY] = [Math.floor((newX + 99) / 100), newY / 100];
    } else if (actualDirection === KEY.LEFT) {
      [newBoardX, newBoardY] = [Math.floor(newX / 100), newY / 100];
    } else if (actualDirection === KEY.DOWN) {
      [newBoardX, newBoardY] = [newX / 100, Math.floor((newY + 99) / 100)];
    } else if (actualDirection === KEY.UP) {
      [newBoardX, newBoardY] = [newX / 100, Math.floor(newY / 100)];
    }

    // Prevent passing through terrain, bombs, walls, etc.
    const objectOnBoard = this.boardState.board[newBoardX][newBoardY];
    if (
      objectOnBoard === OBJECTS.WALL ||
      objectOnBoard === OBJECTS.BOMB ||
      objectOnBoard === OBJECTS.BOX
    ) {
      // unless you're standing on top of it
      if (
        newBoardX !== Math.floor((playerX + 49) / 100) ||
        newBoardY !== Math.floor((playerY + 49) / 100)
      ) {
        return player.position;
      }
    }

    return [newX, newY];
  }

  componentDidMount() {
    this.listeners = listenForGameUpdates(this.gameUpdateHandler);
    this.buildBoard();
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
    this.animationFrameId = window.requestAnimationFrame(this.gameLoop);
  }

  componentWillUnmount() {
    const playerId = this.props.user.id;
    const players = this.boardState.players;

    if (players[playerId]) {
      window.clearInterval(this.updateServerLoop);
    }
    delete this.updateServerLoop;

    stopListenForGameUpdates(this.listeners);
    delete this.listeners;

    window.cancelAnimationFrame(this.animationFrameId);
    delete this.animationFrameId;

    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  buildBoard() {
    const { board, players } = this.boardState;
    const canvas = this.canvas.current;
    const context = canvas.getContext('2d');
    context.font = '20px Arial';

    for (var x = 0; x < WIDTH_IN_BLOCKS; x++) {
      for (var y = 0; y < HEIGHT_IN_BLOCKS; y++) {
        if (board[x][y] === OBJECTS.EMPTY) {
          context.fillStyle = 'green';
        } else if (board[x][y] === OBJECTS.WALL) {
          context.fillStyle = 'grey';
        } else if (board[x][y] === OBJECTS.BOMB) {
          context.fillStyle = 'black';
        } else if (board[x][y] === OBJECTS.BOX) {
          context.fillStyle = 'brown';
        } else if (board[x][y] === OBJECTS.EXPLOSION_PARTICLE) {
          context.fillStyle = 'red';
        } else {
          context.fillStyle = 'blue';
        }
        context.fillRect(100 * x, 100 * y, 100, 100);
      }
    }

    for (x = 0; x < WIDTH_IN_BLOCKS; x++) {
      for (y = 0; y < HEIGHT_IN_BLOCKS; y++) {
        if (board[x][y] === OBJECTS.EXTRA_BOMB_POWERUP) {
          context.fillStyle = 'black';
          context.fillText('+1 Bomb', 100 * x, 100 * y + 50);
        } else if (board[x][y] === OBJECTS.EXTRA_POWER_POWERUP) {
          context.fillStyle = 'black';
          context.fillText('+1 Power', 100 * x, 100 * y + 50);
        } else if (board[x][y] === OBJECTS.EXTRA_SPEED_POWERUP) {
          context.fillStyle = 'black';
          context.fillText('+1 Speed', 100 * x, 100 * y + 50);
        }
      }
    }

    context.fillStyle = 'orange';
    Object.values(players).forEach(player => {
      const [playerX, playerY] = player.position;
      context.fillRect(playerX, playerY, 100, 100);
    });
  }

  handleKeyDown(event) {
    const playerId = this.props.user.id;
    const players = this.boardState.players;
    if (players[playerId] && isArrowKey(event)) {
      players[playerId].moving = true;
      players[playerId].direction = event.keyCode;
    } else if (players[playerId] && isSpaceKey(event)) {
      plantBomb(players[playerId].position);
    }
  }

  handleKeyUp(event) {
    const playerId = this.props.user.id;
    const players = this.boardState.players;
    if (players[playerId] && players[playerId].direction === event.keyCode) {
      players[playerId].moving = false;
    }
  }

  checkPlayerCollision() {
    const playerId = this.props.user.id;
    const players = this.boardState.players;
    if (players[playerId]) {
      const [x, y] = players[playerId].position;
      const row = Math.floor((x + 49) / 100);
      const col = Math.floor((y + 49) / 100);
      const objectOnBoard = this.boardState.board[row][col];
      if (objectOnBoard === OBJECTS.EXPLOSION_PARTICLE) {
        // Player Dies
        killPlayer();
      } else if (
        objectOnBoard >= OBJECTS.EXTRA_BOMB_POWERUP &&
        objectOnBoard <= OBJECTS.EXTRA_SPEED_POWERUP
      ) {
        // Pick up powerup!
        console.log('Picked up powerup!');
      }
    }
  }

  render() {
    return (
      <main>
        <canvas
          className="bombGameCanvas"
          ref={this.canvas}
          width={WIDTH_IN_BLOCKS * 100}
          height={HEIGHT_IN_BLOCKS * 100}
        />
      </main>
    );
  }
}

export default BombGame;
