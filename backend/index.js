const https = require("https");
const fs = require("fs");
const clientHandlers = require("./clientHandlers");

var io;
if (process.env.NODE_ENV === "production") {
  const options = {
    key: fs.readFileSync("/etc/letsencrypt/live/capen.dev/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/capen.dev/cert.pem"),
  };

  const server = https.createServer(options).listen(8000);
  io = require("socket.io")(server, {
    transports: ["websocket", "polling"],
  });
} else {
  io = require("socket.io").listen(8000, {
    transports: ["websocket", "polling"],
  });
}

io.on("connection", (socket) => {
  clientHandlers.forEach((handler) => {
    handler(socket, io);
  });
});
