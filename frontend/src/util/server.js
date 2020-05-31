import openSocket from 'socket.io-client';
import { TIMEOUT_ERROR } from './error';
import Cookies from 'js-cookie';

const host =
  process.env.NODE_ENV === 'production'
    ? 'https://www.capen.dev:8000'
    : 'http://localhost:8000';

const socket = openSocket(host, {
  transports: ['websocket', 'polling'],
});

const SEND_OPS = {
  // Account Registration
  REGISTER_ACCOUNT: 'REGISTER_ACCOUNT',

  // Login/Authentication
  TRY_LOGIN: 'TRY_LOGIN',
  GET_USER_INFO: 'GET_USER_INFO',

  // Lobby
  GET_EMPTY_LOBBY_ID: 'GET_EMPTY_LOBBY_ID',
  JOIN_LOBBY: 'JOIN_LOBBY',
  LEAVE_LOBBY: 'LEAVE_LOBBY',
  SEND_LOBBY_CHAT_MESSAGE: 'SEND_LOBBY_CHAT_MESSAGE',

  // SEND_OPS without an expected response
  ATTEMPT_AUTO_AUTH: 'ATTEMPT_AUTO_AUTH',
  LOGOUT: 'LOGOUT',
};

const RECV_OPS = {
  // Account Registration
  REGISTER_RESPONSE: 'REGISTER_RESPONSE',

  // Login/Authentication
  LOGIN_RESPONSE: 'LOGIN_RESPONSE',
  USER_INFO_RESPONSE: 'USER_INFO_RESPONSE',

  //Lobby
  EMPTY_LOBBY_ID_RESPONSE: 'EMPTY_LOBBY_ID_RESPONSE',
  LOBBY_STATE_CHANGE: 'LOBBY_STATE_CHANGE',
  LOBBY_CHAT_MESSAGE: 'LOBBY_CHAT_MESSAGE',
};

export const AUTH_TOKEN_COOKIE = 'AUTH_TOKEN_COOKIE';

const sendMessage = (sendOp, payload) => {
  socket.emit(sendOp, payload);
};

const addListener = (recvOp, callback) => {
  return socket.on(recvOp, response => callback(response));
};

const removeListener = (recvOp, listener) => {
  socket.off(recvOp, listener);
};

const isSuccessResponse = response => response.success;

/**
 * Sends a packet to the server with the provided sendOp/payload.
 * Open the corresponding packet handler in the backend codebase
 * to see what kind of payload is expected.
 *
 * After the packet is sent, it listens for a response with the
 * corresponding recvOp as the header.
 *
 * This function returns a promise that does one of the following:
 *   1. If a successful response is received, the promise resolves
 *      with the response payload.
 *   2. If a failure response is received, the promise rejects
 *      with the error message.
 *   3. If the timeout elapses first (10 seconds by default), the promise
 *      rejects with a generic timeout error (see ./error.js)
 */
const sendAndListen = (sendOp, payload, recvOp, timeout = 10000) => {
  sendMessage(sendOp, payload);

  return new Promise((resolve, reject) => {
    const listener = addListener(recvOp, response => {
      removeListener(recvOp, listener);
      if (isSuccessResponse(response)) {
        resolve(response);
        return;
      }
      reject(response);
    });
    window.setTimeout(() => {
      removeListener(recvOp, listener);
      reject(TIMEOUT_ERROR);
    }, timeout);
  });
};

const sendAndAddListeners = (sendOp, payload, recvOperations) => {
  sendMessage(sendOp, payload);

  return recvOperations.map(({ recvOp, callback }) => [
    recvOp,
    addListener(recvOp, callback),
  ]);
};

const removeListeners = listeners => {
  listeners.forEach(([recvOp, listenerId]) => removeListener(recvOp, listenerId));
};

// Try to authenticate automatically
sendMessage(SEND_OPS.ATTEMPT_AUTO_AUTH, Cookies.get(AUTH_TOKEN_COOKIE));

export const registerAccount = (username, password, email) => {
  const payload = { username, password, email };
  return sendAndListen(SEND_OPS.REGISTER_ACCOUNT, payload, RECV_OPS.REGISTER_RESPONSE);
};

export const tryLogin = (username, password) => {
  const payload = { username, password };
  return sendAndListen(SEND_OPS.TRY_LOGIN, payload, RECV_OPS.LOGIN_RESPONSE);
};

export const logout = () => {
  sendMessage(SEND_OPS.LOGOUT);
};

export const getUserInfo = () => {
  return sendAndListen(SEND_OPS.GET_USER_INFO, {}, RECV_OPS.USER_INFO_RESPONSE);
};

export const getEmptyLobbyId = () => {
  return sendAndListen(SEND_OPS.GET_EMPTY_LOBBY_ID, {}, RECV_OPS.EMPTY_LOBBY_ID_RESPONSE);
};

export const joinLobby = (id, lobbyUpdateCallback, chatUpdateCallback) => {
  const listeners = sendAndAddListeners(SEND_OPS.JOIN_LOBBY, id, [
    [RECV_OPS.LOBBY_STATE_CHANGE, lobbyUpdateCallback],
    [RECV_OPS.LOBBY_CHAT_MESSAGE, chatUpdateCallback],
  ]);
  return listeners;
};

export const leaveLobby = (id, listeners) => {
  sendMessage(SEND_OPS.LEAVE_LOBBY, id);
  removeListeners(listeners);
};

export const sendLobbyChatMessage = msg => {
  sendMessage(SEND_OPS.SEND_LOBBY_CHAT_MESSAGE, msg);
};
