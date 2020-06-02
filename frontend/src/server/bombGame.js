import { SEND_OPS, RECV_OPS, sendMessage, addListener, removeListener } from './socket';

export const listenForGameUpdates = updateBoard => {
  return addListener(RECV_OPS.BOMB_GAME_UPDATE_BOARD, updateBoard);
};

export const stopListenForGameUpdates = listener => {
  removeListener(RECV_OPS.BOMB_GAME_UPDATE_BOARD, listener);
};

export const updatePosition = position => {
  sendMessage(SEND_OPS.BOMB_GAME_UPDATE_PLAYER, position);
};

export const plantBomb = () => {
  sendMessage(SEND_OPS.BOMB_GAME_PLANT_BOMB);
};

export const lootPowerup = () => {
  sendMessage(SEND_OPS.BOMB_GAME_LOOT_POWERUP);
};
