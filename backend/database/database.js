const config = require("../config");

var mysql = require("mysql");
var connection;

function handleDisconnect() {
  connection = mysql.createConnection(config.databaseConfig);
  connection.connect(function (err) {
    if (err) {
      console.log("Error when connecting to database: ", err);
      console.log("Retrying in 5 seconds");
      setTimeout(handleDisconnect, 5000);
    }
  });
  connection.on("error", function (err) {
    console.log("Error while connected to database: ", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.log(
        "Connection lost (probably due to timeout). Connecting again."
      );
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports = connection;
