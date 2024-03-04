var express = require("express");
var router = express.Router();
const User = require("../models/users");
const { checkBody } = require("../middlewares/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

// ROUTE SIGN UP
router.post("/signup", (req, res) => {
  if (
    !checkBody(req.body, [
      "userName",
      "lastName",
      "firstName",
      "mail",
      "password",
    ])
  ) {
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

router.post("/signin", (req, res) => {
  // Vérifier la présence des champs requis dans la requête

  if (!checkBody(req.body, ["mail", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.findOne({ mail: req.body.mail }).then((data) => {
    // Vérifier si l'utilisateur existe et si le mot de passe correspond

    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      // Si l'authentification réussit, renvoyer un jeton d'authentification

      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: "Invalid email adress or password" });
    }
  });
});

//ADD NEW METEO
router.patch("/addMeteo", (req, res) => {
  // Recherche de l'utilisateur en fonction du jeton (token) fourni dans la requête

  User.findOne({ token: req.body.token }).then((data) => {
    // Vérification si l'utilisateur existe

    if (!data) return res.json({ result: false, error: "User do not exist" });
    // Mise à jour de l'utilisateur en ajoutant la nouvelle météo à son ensemble de favoris

    User.updateOne(
      { token: data.token },
      { $addToSet: { fav_meteo: req.body.newMeteo } }
    ).then((data) => {
      // Vérification si la mise à jour a été effectuée avec succès (au moins un document modifié)

      if (data.modifiedCount) {
        return res.json({
          result: true,
          meteo: "New Meteo saved in DDB",
        });
      }
      return res.json({ result: false, meteo: "Already added" });
    });
  });
});

//DELETE NEW METEO
router.patch("/removeMeteo", (req, res) => {
  User.findOne({ token: req.body.token }).then((data) => {
    if (!data) return res.json({ result: false, error: "User does not exist" });

    User.updateOne(
      { token: data.token },
      { $pull: { fav_meteo: req.body.newMeteo } }
    ).then((updateResult) => {
      console.log(updateResult);
      if (updateResult.modifiedCount) {
        return res.json({
          result: true,
          meteo: "Selected Meteo removed successfully",
        });
      }
      return res.json({ result: false, meteo: "Meteo not found" });
    });
  });
});

//Mettre de côté [Ajouter]

router.patch("/addAside", (req, res) => {
  User.findOne({ token: req.body.token }).then((data) => {
    if (!data) return res.json({ result: false, error: "User do not exist" });

    User.updateOne(
      { token: data.token },
      { $addToSet: { fav_POI: req.body.id } }
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
//Mettre de côté [Delete]
router.patch("/removeAside", (req, res) => {
  User.findOne({ token: req.body.token }).then((data) => {
    if (!data) return res.json({ result: false, error: "User does not exist" });

    User.updateOne(
      { token: data.token },
      { $pull: { fav_POI: req.body.id } }
    ).then((updateResult) => {
      console.log(updateResult);
      if (updateResult.modifiedCount) {
        return res.json({
          result: true,
          meteo: "Fav removed successfully",
        });
      }
      return res.json({ result: false, meteo: "Fav not found" });
    });
  });
});

module.exports = router;
