const RegisterAccountHandler = require("./handlers/RegisterAccountHandler");
const LoginHandler = require("./handlers/LoginHandler");
const UserInfoHandler = require("./handlers/UserInfoHandler");
const EmptyLobbyIdHandler = require("./handlers/EmptyLobbyIdHandler");
const AttemptAutoAuthHandler = require("./handlers/AttemptAutoAuthHandler");
const LogoutHandler = require("./handlers/LogoutHandler");

const handlers = [
  RegisterAccountHandler("REGISTER_ACCOUNT", "REGISTER_RESPONSE"),
  LoginHandler("TRY_LOGIN", "LOGIN_RESPONSE"),
  UserInfoHandler("GET_USER_INFO", "USER_INFO_RESPONSE"),
  EmptyLobbyIdHandler("GET_EMPTY_LOBBY_ID", "EMPTY_LOBBY_ID_RESPONSE"),
  /// TO BE IMPLEMENTED - maybe combine?
  /*
  JoinLobbyHandler("JOIN_LOBBY", ["LOBBY_STATE_CHANGE", "LOBBY_CHAT_MESSAGE"]),
  LeaveLobbyHandler("LEAVE_LOBBY"),
  SendLobbyChatMessageHandler("SEND_LOBBY_CHAT_MESSAGE"),
  */
  ///
  AttemptAutoAuthHandler("ATTEMPT_AUTO_AUTH"),
  LogoutHandler("LOGOUT"),
];

module.exports = handlers;
