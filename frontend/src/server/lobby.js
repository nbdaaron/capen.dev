import {
  SEND_OPS,
  RECV_OPS,
  sendAndListen,
  sendAndAddListeners,
  sendMessage,
  removeListeners,
} from './socket';

export const getEmptyLobbyId = () => {
  return sendAndListen(SEND_OPS.GET_EMPTY_LOBBY_ID, {}, RECV_OPS.EMPTY_LOBBY_ID_RESPONSE);
};

export const joinLobby = (
  id,
  lobbyUpdateCallback,
  chatUpdateCallback,
  declareWinnerCallback
) => {
  const listeners = sendAndAddListeners(SEND_OPS.JOIN_LOBBY, id, [
    [RECV_OPS.LOBBY_STATE_CHANGE, lobbyUpdateCallback],
    [RECV_OPS.LOBBY_CHAT_MESSAGE, chatUpdateCallback],
    [RECV_OPS.DECLARE_WINNER, declareWinnerCallback],
  ]);
  return listeners;
};

// TODO - remove id here...
export const leaveLobby = (id, listeners) => {
  sendMessage(SEND_OPS.LEAVE_LOBBY, id);
  removeListeners(listeners);
};

export const sendLobbyChatMessage = msg => {
  sendMessage(SEND_OPS.SEND_LOBBY_CHAT_MESSAGE, msg);
};

export const selectGame = game => {
  sendMessage(SEND_OPS.SELECT_GAME, game);
};

export const startGame = () => {
  sendMessage(SEND_OPS.START_GAME);
};
