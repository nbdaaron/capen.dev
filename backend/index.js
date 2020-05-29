const https = require("https");
const fs = require("fs");
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

const handlers = require("./client_handlers");

io.on("connection", (socket) => {
  console.log("Client connected: " + socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected: " + socket.id);
  });
  handlers.forEach((handler) => {
    handler(socket);
  });
});
