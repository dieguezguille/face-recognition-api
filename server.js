const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();

// MIDDLEWARE
app.use(bodyParser.json());
app.use(cors());

//DATABASE
const db = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date()
    },
    {
      id: "124",
      name: "Sally",
      email: "sally@gmail.com",
      password: "bananas",
      entries: 0,
      joined: new Date()
    }
  ]
};

//ROUTES

//Home Route
app.get("/", (req, res) => {
  res.json(db.users);
});

//Sign In Route
app.post("/signin", (req, res) => {

    if(req.body.password === db.users[0].password && req.body.email === db.users[0].email){
        return res.json("success")
    }
    else{
        return res.json("error")
    }
  
});

//Register Route
app.post("/register", (req, res) => {

  const { email, name, password } = req.body;

  let hashedPass = "";
  //Hashing Pass
  bcrypt.hash(password, 7, (err, hash) => {
    // Store hash in your password DB.
    err ? console.log(err, "Oops! Error hashing password.") : console.log(hash);
    hashedPass = hash;
  });

  db.users.push({
    id: "125",
    name: name,
    email: email,
    entries: 0,
    joined: new Date()
  });

  res.json(db.users[db.users.length - 1]);

});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  db.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(404).json("No such user.");
  }
});

app.post("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  db.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(404).json("No such user.");
  }
});

//Server Listen / Start Server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

/* 

///////////////
API PLANNING
///////////////

ROUTES:

(/) -> GET res = this is working
(/signin) -> POST = success, fail
(/register) -> POST = user
(/profile:userId) -> GET = user
(/image) -> PUT = updated object

*/
