const User = require("./user");
const MAX_GUEST_ID = 1e6;

class Guest extends User {
  constructor() {
    const randomId = Guest.generateRandomId();
    super(randomId, `guest-${randomId}`);
  }

  static generateRandomId() {
    return Math.floor(Math.random() * MAX_GUEST_ID) + 1e9;
  }
}

module.exports = Guest;
