const bcrypt = require("bcrypt");
const database = require("./database");
const User = require("../model/User");

const registerUser = (username, password, email) => {
  return new Promise((resolve, reject) => {
    // Hash the password
    bcrypt.hash(password, 10).then((hash) => {
      const info = {
        username,
        password: hash,
        email,
      };
      database().query(
        "INSERT INTO Users SET ?",
        info,
        (error, results, fields) => {
          if (error) {
            if (error.code === "ER_DUP_ENTRY") {
              reject(new Error("This username is already taken."));
            } else {
              reject(new Error(error.sqlMessage));
            }
          } else {
            resolve();
          }
        }
      );
    });
  });
};

const login = (username, password) => {
  return new Promise((resolve, reject) => {
    database().query(
      "SELECT `id`, `password` FROM `Users` WHERE `username` = ?",
      [username],
      (error, results, fields) => {
        if (error) {
          reject(new Error(error.sqlMessage));
        } else if (results.length === 0) {
          // Username not found
          reject(new Error("These credentials are incorrect!"));
        } else {
          const matchedUser = results[0];
          // Check password
          bcrypt
            .compare(password, matchedUser.password)
            .then((passwordCorrect) => {
              if (passwordCorrect) {
                resolve(new User(matchedUser.id, username));
              } else {
                // Password is incorrect.
                reject(new Error("These credentials are incorrect!"));
              }
            });
        }
      }
    );
  });
};

module.exports = {
  login,
  registerUser,
};
