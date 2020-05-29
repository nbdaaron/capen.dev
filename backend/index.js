const https = require("https");
const fs = require("fs");
const config = require("./config");

const options = {
  key: fs.readFileSync(config.key),
  cert: fs.readFileSync(config.cert),
};

const server = https.createServer(options).listen(8000);
const io = require("socket.io")(server, {
  transports: ["websocket", "polling"],
});

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
