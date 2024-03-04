var express = require("express");
var router = express.Router();
const User = require("../models/users");

router.patch("/addAside", (req, res) => {
    User.findOne({ token: req.body.token }).then((data) => {
      if (!data) return res.json({ result: false, error: "User do not exist" });
        
      User.updateOne(
        { token: data.token },
        { $addToSet: { fav_POI: req.body.id }}
      ).then((data) => {
        console.log(data);
        if (data.modifiedCount) {
          return res.json({
            result: true,
            meteo: "New Fav added",
          });
        }
        return res.json({ result: false, meteo: "Already added" });
      });
    });
  });

module.exports = router;