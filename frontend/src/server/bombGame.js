import { SEND_OPS, RECV_OPS, sendMessage, addListener, removeListener } from './socket';

export const listenForGameUpdates = updateBoard => {
  return addListener(RECV_OPS.BOMB_GAME_UPDATE_BOARD, updateBoard);
};

export const stopListenForGameUpdates = listener => {
  removeListener(RECV_OPS.BOMB_GAME_UPDATE_BOARD, listener);
};

export const updatePlayer = player => {
  sendMessage(SEND_OPS.BOMB_GAME_UPDATE_PLAYER, player);
};

export const plantBomb = position => {
  sendMessage(SEND_OPS.BOMB_GAME_PLANT_BOMB, position);
};

export const killPlayer = () => {
  sendMessage(SEND_OPS.BOMB_GAME_KILL_PLAYER);
};

export const lootPowerup = () => {
  sendMessage(SEND_OPS.BOMB_GAME_LOOT_POWERUP);
};
