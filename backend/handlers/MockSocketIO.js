const User = require("../model/user");
const { remove } = require("lodash");

const rooms = {};

class MockSocket {
  constructor(authenticatedUser) {
    this.listeners = [];
    this.sentMessages = [];

    // Use a hardcoded mock user unless
    // a user is provided.
    if (authenticatedUser === true) {
      this.user = new User(421, "bob");
    } else if (authenticatedUser) {
      this.user = authenticatedUser;
    }
  }

  join(room) {
    if (!rooms[room]) {
      rooms[room] = [this];
    } else {
      rooms[room].push(this);
    }
  }

  leave(room) {
    if (rooms[room]) {
      remove(rooms[room], (socket) => socket === this);
    }
  }

  on(recvOp, callback) {
    this.listeners.push([recvOp, callback]);
  }

  mockReceive(recvOp, message) {
    this.listeners.forEach(([op, callback]) => {
      if (op === recvOp) {
        callback(message);
      }
    });
  }

  emit(sendOp, message) {
    this.sentMessages.push([sendOp, message]);
  }

  getEmittedMessages() {
    return this.sentMessages;
  }
}

class MockIO {
  static to(room) {
    return {
      emit: (sendOp, message) => {
        rooms[room].forEach((s) => {
          s.emit(sendOp, message);
        });
      },
    };
  }
}

module.exports = {
  MockSocket,
  MockIO,
};
