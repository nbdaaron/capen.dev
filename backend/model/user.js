class User {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
    };
  }

  equals(user) {
    if (!(user instanceof User)) {
      return false;
    }
    return this.id === user.id && this.name === user.name;
  }
}

module.exports = User;
