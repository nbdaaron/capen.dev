const authenticatedOnly = (socket, fn) => {
  return (param) => {
    if (socket.user) {
      fn(param);
    }
  };
};

module.exports = { authenticatedOnly };
