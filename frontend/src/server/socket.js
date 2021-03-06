import openSocket from 'socket.io-client';
import { TIMEOUT_ERROR } from '../util/error';
import Cookies from 'js-cookie';

const host =
  process.env.NODE_ENV === 'production'
    ? 'https://www.capen.dev:8000'
    : 'http://localhost:8000';

const socket = openSocket(host, {
  transports: ['websocket', 'polling'],
});

export const SEND_OPS = {
  // Latency check
  PING: 'PING',

  // Account Registration
  REGISTER_ACCOUNT: 'REGISTER_ACCOUNT',

  // Login/Authentication
  TRY_LOGIN: 'TRY_LOGIN',
  LOGIN_AS_GUEST: 'LOGIN_AS_GUEST',
  GET_USER_INFO: 'GET_USER_INFO',

  // Lobby
  GET_EMPTY_LOBBY_ID: 'GET_EMPTY_LOBBY_ID',
  JOIN_LOBBY: 'JOIN_LOBBY',
  LEAVE_LOBBY: 'LEAVE_LOBBY',
  SEND_LOBBY_CHAT_MESSAGE: 'SEND_LOBBY_CHAT_MESSAGE',
  SELECT_GAME: 'SELECT_GAME',
  START_GAME: 'START_GAME',

  // Test Game
  TEST_GAME_CLICK_BUTTON: 'TEST_GAME_CLICK_BUTTON',

  // Bomb Game
  BOMB_GAME_UPDATE_PLAYER: 'BOMB_GAME_UPDATE_PLAYER',
  BOMB_GAME_PLANT_BOMB: 'BOMB_GAME_PLANT_BOMB',
  BOMB_GAME_LOOT_POWERUP: 'BOMB_GAME_LOOT_POWERUP',
  BOMB_GAME_KILL_PLAYER: 'BOMB_GAME_KILL_PLAYER',

  // Drawing Game
  DRAWING_GAME_DRAW_LINE: 'DRAWING_GAME_DRAW_LINE',
  DRAWING_GAME_MAKE_GUESS: 'DRAWING_GAME_MAKE_GUESS',

  // SEND_OPS without an expected response
  ATTEMPT_AUTO_AUTH: 'ATTEMPT_AUTO_AUTH',
  LOGOUT: 'LOGOUT',
};

export const RECV_OPS = {
  // Latency check
  PONG: 'PONG',

  // Account Registration
  REGISTER_RESPONSE: 'REGISTER_RESPONSE',

  // Login/Authentication
  LOGIN_RESPONSE: 'LOGIN_RESPONSE',
  USER_INFO_RESPONSE: 'USER_INFO_RESPONSE',

  //Lobby
  EMPTY_LOBBY_ID_RESPONSE: 'EMPTY_LOBBY_ID_RESPONSE',
  LOBBY_STATE_CHANGE: 'LOBBY_STATE_CHANGE',
  LOBBY_CHAT_MESSAGE: 'LOBBY_CHAT_MESSAGE',
  DECLARE_WINNER: 'DECLARE_WINNER',

  // Bomb Game
  BOMB_GAME_UPDATE_BOARD: 'BOMB_GAME_UPDATE_BOARD',

  // Drawing Game
  DRAWING_GAME_UPDATE: 'DRAWING_GAME_UPDATE',
  DRAWING_GAME_LINE_DRAWN: 'DRAWING_GAME_LINE_DRAWN',
  DRAWING_GAME_SHOW_GUESS: 'DRAWING_GAME_SHOW_GUESS',
};

export const AUTH_TOKEN_COOKIE = 'AUTH_TOKEN_COOKIE';

export const sendMessage = (sendOp, payload) => {
  socket.emit(sendOp, payload);
};

export const addListener = (recvOp, callback) => {
  socket.on(recvOp, callback);
  return callback;
};

export const removeListener = (recvOp, listener) => {
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
 *   3. If the timeout elapses first (4 seconds by default), the promise
 *      rejects with a generic timeout error (see ./error.js)
 */
export const sendAndListen = (sendOp, payload, recvOp, timeout = 4000) => {
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

export const addListeners = recvOperations => {
  return recvOperations.map(([recvOp, callback]) => {
    addListener(recvOp, callback);
    return [recvOp, callback];
  });
};

export const removeListeners = listeners => {
  listeners.forEach(([recvOp, listenerId]) => removeListener(recvOp, listenerId));
};

export const sendAndAddListeners = (sendOp, payload, recvOperations) => {
  sendMessage(sendOp, payload);
  return addListeners(recvOperations);
};

var approxLatency;
var ping;
var ponged = true;

const checkPing = () => {
  if (!ponged) {
    return;
  }
  ping = Date.now();
  sendMessage(SEND_OPS.PING);
  ponged = false;
};

// Check ping every 5 seconds.
window.setInterval(checkPing, 5000);
checkPing();

addListener(RECV_OPS.PONG, () => {
  ponged = true;
  // Cap estimated latency at 5 seconds.
  // If it's worse, your gameplay is going to be
  // pretty bad regardless...
  approxLatency = Math.min(5000, Date.now() - ping);
});

export const getApproxLatency = () => {
  return approxLatency;
};

// Try to authenticate automatically initially.
sendMessage(SEND_OPS.ATTEMPT_AUTO_AUTH, Cookies.get(AUTH_TOKEN_COOKIE));

// Try to authenticate automatically on reconnect.
addListener('reconnect', () => {
  sendMessage(SEND_OPS.ATTEMPT_AUTO_AUTH, Cookies.get(AUTH_TOKEN_COOKIE));
});
