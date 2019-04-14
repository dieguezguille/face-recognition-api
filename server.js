const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const bcrypt = require("bcrypt");
const knex = require("knex");
const app = express();

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "",
    database: "facerecognitionapp"
  }
});

// MIDDLEWARE
app.use(bodyParser.json());
app.use(cors());

//ROUTES
//Home Route
app.get("/", (req, res) => {
});

//Sign In Route || OK
app.post("/signin", (req, res) => {
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        db.select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => {
            res.status(400).json("Unable to get user.");
          });
      } else {
        res.status(400).json("Wrong credentials");
      }
    })
    .catch(err => {
      res.status(400).json("Wrong credentials.");
    });
});

//Register Route || OK
app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  //Hago una transacción en la DB p/ condensar 2 manipulaciones en un solo stream
  db.transaction(trx => {
    //Hashing password syncronously inside the transaction async
    const saltRounds = 10;
    const plainPassword = password;
    let salt = bcrypt.genSaltSync(saltRounds);
    let hash = bcrypt.hashSync(plainPassword, salt);

    trx
      //Add user to login table
      .returning("email")
      .insert({
        hash: hash,
        email: email
      })
      .into("login")
      .then(returnedEmail => {
        //Add user to login table
        return trx
          .returning("*")
          .insert({
            email: returnedEmail[0],
            name: name,
            joined: new Date()
          })
          .into("users")
          .then(user => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(err => {
    res.status(400).json("Unable to register this user.");
  });
});

//Profile Route || OK
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({
      id: id
    })
    .then(user => {
      if (user.length) {
        res.status(200).json(user[0]);
      } else {
        throw new Error("No such user");
      }
    })
    .catch(() => {
      res.status(400).json("Error retrieving the requested user.");
    });
});

//Updating entries route || OK
app.put("/image", (req, res) => {
  const { id } = req.body;

  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => {
      res.status(400).json("Unable to update entries");
    });
});

//Start Listen Server || OK
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});