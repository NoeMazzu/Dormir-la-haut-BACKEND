var express = require("express");
var router = express.Router();
const User = require("../models/users");
const { checkBody } = require("../middlewares/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
/* GET users listing. */
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Check if the user has not already been registered
  User.findOne(
    { email: req.body.email } || { username: req.body.username }
  ).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        password: hash,
        token: uid2(32),
        canBookmark: true,
      });

      newUser.save().then((newDoc) => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: "User already exists" });
    }
  });
});

module.exports = router;
