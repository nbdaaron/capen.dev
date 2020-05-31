const RegisterAccountHandler = require("./handlers/RegisterAccountHandler");
const LoginHandler = require("./handlers/LoginHandler");
const UserInfoHandler = require("./handlers/UserInfoHandler");
const LobbyHandler = require("./handlers/LobbyHandler");
const AttemptAutoAuthHandler = require("./handlers/AttemptAutoAuthHandler");
const LogoutHandler = require("./handlers/LogoutHandler");

const handlers = [
  RegisterAccountHandler,
  LoginHandler,
  UserInfoHandler,
  LobbyHandler,
  AttemptAutoAuthHandler,
  LogoutHandler,
];

module.exports = handlers;
