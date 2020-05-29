import openSocket from 'socket.io-client';
import { TIMEOUT_ERROR } from './error';
const host =
  process.env.NODE_ENV === 'production'
    ? 'https://capen.dev:8000'
    : 'https://localhost:8000/';
const socket = openSocket(host, {
  transports: ['websocket', 'polling'],
});

const SEND_OPS = {
  // Account Registration
  REGISTER_ACCOUNT: 'REGISTER_ACCOUNT',
};

const RECV_OPS = {
  // Account Registration
  REGISTER_RESPONSE: 'REGISTER_RESPONSE',
};

const sendMessage = (msg, payload) => {
  socket.emit(msg, payload);
};

const addListener = (msg, callback) => {
  return socket.on(msg, response => callback(response));
};

const removeListener = (msg, listener) => {
  socket.off(msg, listener);
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

export const registerAccount = (username, password, email) => {
  const payload = { username, password, email };
  return sendAndListen(SEND_OPS.REGISTER_ACCOUNT, payload, RECV_OPS.REGISTER_RESPONSE);
};
