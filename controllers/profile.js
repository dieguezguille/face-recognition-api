const handleProfile = (req, res, db) => {
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
};

module.exports = {
  handleProfile: handleProfile
};
