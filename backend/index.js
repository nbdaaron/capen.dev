const io = require("socket.io");
const server = new io.listen(8000, {
  transports: ["websocket", "polling"],
});
const handlers = require("./client_handlers");

server.on("connection", (socket) => {
  console.log("Client connected: " + socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected: " + socket.id);
  });

  handlers.forEach((handler) => {
    handler(socket);
  });
});
