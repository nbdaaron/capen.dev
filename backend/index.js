const io = require('socket.io');
const server = new io.listen(8000);

server.on('connection', (socket) => {
  console.log('Client connected: ' + socket.id);
  socket.on('disconnect', () => {
  	console.log('Client disconnected: ' + socket.id);
  });
  socket.on('REGISTER_ACCOUNT', function (info) {
  	// emit dummy response
  	socket.emit('REGISTER_RESPONSE', {
  	  success: true
  	});
  }); 
});