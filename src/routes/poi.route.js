var express = require("express");
var router = express.Router();
const Poi = require("../models/pois");
const User = require("../models/users");

router.post("/", function (req, res) {
  const newPoi = new Poi({
    name: req.body.namePoi,
    coordinates: {
      latitude: req.body.latitudePoi,
      longitude: req.body.longitudePoi,
    },
    desc: req.body.descPoi,
    photos: req.body.photosPoi,
    createdBy: req.body.username,
    type: req.body.typePoi,
    isPublic: false,
  });
  newPoi.save().then((data) => res.json(data));
});

router.get("/", (req, res) => {
  Poi.find().then((data) => {
    res.json({ poi: data });
  });
});

router.patch("/photoLike", async (req, res) => {
  const userId = await User.findOne({ token: req.body.token });
  const poi = await Poi.findOne({
    photos: { $elemMatch: { _id: req.body.photoId } },
  });
  console.log(poi.photos);
  const photo = await poi.photos.find((e) => e.id === req.body.photoId);
  photo.liked.push(userId);
  console.log(photo);
  const result = await poi.save();
  res.json(result);
  
});

module.exports = router;
