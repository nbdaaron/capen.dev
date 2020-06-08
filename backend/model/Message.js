// Randomly generated message IDs will be (for the most part) 13-digit numbers.
const MAX_MESSAGE_ID = 1e14;

class Message {
  constructor(sender, message, id) {
    this.sender = sender;
    this.message = message;
    this.id = id || Message.generateRandomId();
  }

  static generateRandomId() {
    return Math.floor(Math.random() * MAX_MESSAGE_ID);
  }
}

module.exports = Message;
