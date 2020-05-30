var config;
if (process.env.NODE_ENV === "production") {
  // eslint-disable-next-line import/no-absolute-path
  config = require("/home/ec2-user/db_config");
} else {
  config = require("./config");
}

const connection = require("mysql").createConnection(config);

connection.connect();

module.exports = connection;
