const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const bcrypt = require("bcrypt");
const knex = require("knex");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

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
app.get("/", (req, res) => {});

//Sign In Route || OK
app.post("/signin", (req, res) => {
  signin.handleSignIn(req, res, db, bcrypt);
});

//Register Route || OK
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

//Profile Route || OK
app.get("/profile/:id", (req, res) => {
  profile.handleProfile(req, res, db);
});

//Updating entries route || OK
app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

//Start Listen Server || OK
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
