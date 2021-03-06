const { inGameOnly } = require("./util");

const GAME_ID = "bomb";

// RECV_OPS
const BOMB_GAME_UPDATE_PLAYER = "BOMB_GAME_UPDATE_PLAYER";
const BOMB_GAME_PLANT_BOMB = "BOMB_GAME_PLANT_BOMB";
const BOMB_GAME_KILL_PLAYER = "BOMB_GAME_KILL_PLAYER";
const BOMB_GAME_LOOT_POWERUP = "BOMB_GAME_LOOT_POWERUP";

const BombGameHandler = (socket, io) => {
  socket.on(
    BOMB_GAME_UPDATE_PLAYER,
    inGameOnly(socket, GAME_ID, function (game, player) {
      game.updatePlayer(socket.user, player);
    })
  );

  socket.on(
    BOMB_GAME_PLANT_BOMB,
    inGameOnly(socket, GAME_ID, function (game, position) {
      game.requestPlantBomb(socket.user, position);
    })
  );

  socket.on(
    BOMB_GAME_KILL_PLAYER,
    inGameOnly(socket, GAME_ID, function (game, position) {
      game.killPlayer(socket.user);
    })
  );

  socket.on(
    BOMB_GAME_LOOT_POWERUP,
    inGameOnly(socket, GAME_ID, function (game, position) {
      game.lootPowerup(socket.user, position);
    })
  );
};

module.exports = BombGameHandler;
