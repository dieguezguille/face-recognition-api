const handleRegister = (req, res, db, bcrypt) => {
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
};

module.exports = {
  handleRegister: handleRegister
};
