const config = require("./config");

const connection = require("mysql").createConnection(config.databaseConfig);

connection.connect();

module.exports = connection;
