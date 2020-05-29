const RegisterAccountHandler = require("./handlers/RegisterAccountHandler");
const LoginHandler = require("./handlers/LoginHandler");
const UserInfoHandler = require("./handlers/UserInfoHandler");

const handlers = [RegisterAccountHandler, LoginHandler, UserInfoHandler];

module.exports = handlers;
