const RegisterAccountHandler = require("./handlers/RegisterAccountHandler");
const LoginHandler = require("./handlers/LoginHandler");
const UserInfoHandler = require("./handlers/UserInfoHandler");
const AttemptAutoAuthHandler = require("./handlers/AttemptAutoAuthHandler");
const LogoutHandler = require("./handlers/LogoutHandler");

const handlers = [
  RegisterAccountHandler("REGISTER_ACCOUNT", "REGISTER_RESPONSE"),
  LoginHandler("TRY_LOGIN", "LOGIN_RESPONSE"),
  UserInfoHandler("GET_USER_INFO", "USER_INFO_RESPONSE"),
  AttemptAutoAuthHandler("ATTEMPT_AUTO_AUTH"),
  LogoutHandler("LOGOUT"),
];

module.exports = handlers;
