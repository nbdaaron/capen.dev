import { SEND_OPS, RECV_OPS, sendAndListen, sendMessage } from './socket';

export const registerAccount = (username, password, email) => {
  const payload = { username, password, email };
  return sendAndListen(SEND_OPS.REGISTER_ACCOUNT, payload, RECV_OPS.REGISTER_RESPONSE);
};

export const tryLogin = (username, password) => {
  const payload = { username, password };
  return sendAndListen(SEND_OPS.TRY_LOGIN, payload, RECV_OPS.LOGIN_RESPONSE);
};

export const loginAsGuest = () => {
  return sendAndListen(SEND_OPS.LOGIN_AS_GUEST, null, RECV_OPS.LOGIN_RESPONSE);
};

export const logout = () => {
  sendMessage(SEND_OPS.LOGOUT);
};

export const getUserInfo = () => {
  return sendAndListen(SEND_OPS.GET_USER_INFO, {}, RECV_OPS.USER_INFO_RESPONSE);
};
