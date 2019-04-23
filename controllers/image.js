const Clarifai = require("clarifai");

//Initialize Clarifai instance
const app = new Clarifai.App({
  apiKey: "adc4336a7a8749eca7cdd95d594e1620"
});

const handleApiCall = (req, res) => {
  //Send URL to Clarifai
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json("Unable to work with API"))
}

const handleImage = (req, res, db) => {
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
};

module.exports = {
  handleImage: handleImage, 
  handleApiCall: handleApiCall
};
