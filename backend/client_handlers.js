const RegisterAccountHandler = require("./handlers/RegisterAccountHandler");
const LoginHandler = require("./handlers/LoginHandler");
const UserInfoHandler = require("./handlers/UserInfoHandler");
const AttemptAutoAuthHandler = require("./handlers/AttemptAutoAuthHandler");
const LogoutHandler = require("./handlers/LogoutHandler");

// Handlers for unauthenticated users.
const UNAUTHENTICATED_HANDLERS = [
  RegisterAccountHandler,
  LoginHandler,
  AttemptAutoAuthHandler,
  UserInfoHandler,
];

// Handlers only permitted for logged-in users.
// These handlers assume socket.user is defined.
const AUTHENTICATED_HANDLERS = [LogoutHandler];

module.exports = {
  UNAUTHENTICATED_HANDLERS: UNAUTHENTICATED_HANDLERS,
  AUTHENTICATED_HANDLERS: AUTHENTICATED_HANDLERS,
};
