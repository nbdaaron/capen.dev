import openSocket from 'socket.io-client';
import { TIMEOUT_ERROR } from './error';
const socket = openSocket('http://localhost:8000/');

const SEND_OPS = {
  // Account Registration
  REGISTER_ACCOUNT: 'REGISTER_ACCOUNT'
};

const RECV_OPS = {
  // Account Registration
  REGISTER_RESPONSE: 'REGISTER_RESPONSE'
};

const sendMessage = (msg, payload) => {
  socket.emit(msg, payload);
};

const addListener = (msg, callback) => {
  return socket.on(msg, (response) => callback(response));
};

const removeListener = (msg, listener) => {
  socket.off(msg, listener);
};

const sendAndListen = (send_op, payload, recv_op, timeout=5000) => {
  sendMessage(send_op, payload);

  return new Promise((resolve, reject) => {
    const listener = addListener(recv_op, (response) => {
      removeListener(recv_op, listener);
      resolve(response);
    });
    window.setTimeout(() => {
      removeListener(recv_op, listener);
      reject(TIMEOUT_ERROR);
    }, 5000);
  });
};

export const registerAccount = (username, password, email) => {
  const payload = { username, password, email };
  return sendAndListen(SEND_OPS.REGISTER_ACCOUNT, payload, RECV_OPS.REGISTER_RESPONSE);
};
