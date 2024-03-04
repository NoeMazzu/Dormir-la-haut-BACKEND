var express = require("express");
var express = require("express");
var router = express.Router();
const User = require("../models/users");
const { checkBody } = require("../middlewares/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");


//ROUTE SIGN UP 
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ['userName', 'lastName', 'firstName', 'mail', 'password'])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Vérifier l'existence du nom d'utilisateur
  User.findOne({ userName: req.body.userName }).then((usernameData) => {
    if (usernameData !== null) {
      res.json({ result: false, error: "Username already exists" });
      return;
    }

    // Vérifier l'existence de l'adresse e-mail
    User.findOne({ mail: req.body.mail }).then((emailData) => {
      if (emailData !== null) {
        res.json({ result: false, error: "Email already exists" });
        return;
      }

      // Si le nom d'utilisateur et l'adresse e-mail n'existent pas, enregistrez le nouvel utilisateur
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        userName: req.body.userName,
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        mail: req.body.mail,
        password: hash,
        token: uid2(32),
      });

      newUser.save().then((newDoc) => {
        res.json({ result: true, token: newDoc.token });
      });
    });
  });
});

//ROUTE SIGN IN

router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['mail', 'password'])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.findOne({mail: req.body.mail}).then(data => {
    if(data && bcrypt.compareSync(req.body.password, data.password)){
      res.json({result: true, token: data.token})
    } else {
      res.json({result: false, error: 'Invalid email adress or password'})
    }
  })
})



module.exports = router;
