import { SEND_OPS, RECV_OPS, sendMessage, addListeners, removeListeners } from './socket';

export const listenForGameUpdates = (updateGame, lineDrawn) => {
  const listeners = [
    [RECV_OPS.DRAWING_GAME_UPDATE, updateGame],
    [RECV_OPS.DRAWING_GAME_LINE_DRAWN, lineDrawn],
  ];
  return addListeners(listeners);
};

export const stopListenForGameUpdates = listeners => {
  removeListeners(listeners);
};

export const drawLine = (fromPos, toPos) => {
  sendMessage(SEND_OPS.DRAWING_GAME_DRAW_LINE, { fromPos, toPos });
};
