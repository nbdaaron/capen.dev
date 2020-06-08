const database = require("./database");

const recordResults = (gameId, users, winner) => {
  database.query(
    "INSERT INTO Games SET ?; SELECT LAST_INSERT_ID() as id;",
    { gameId: gameId, winner: winner.id },
    (err, results, fields) => {
      if (err) {
        throw err;
      }
      const id = results[1][0].id;
      users.forEach((user) => {
        database.query("INSERT INTO Players SET ?", {
          gameId: id,
          userId: user.id,
        });
      });
    }
  );
};

module.exports = {
  recordResults,
};
