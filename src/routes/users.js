var express = require("express");
var router = express.Router();
const User = require("../models/users");
const { checkBody } = require("../middlewares/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const createJWTToken = require('../middlewares/jwtGeneration.Middleware');

const userController = require('../controllers/user.controller');
const authenticationMiddleware = require('../middlewares/authentication.middleware');

// ROUTE SIGN UP
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["userName", "mail", "password"])) {
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
        mail: req.body.mail,
        password: hash,
        token: uid2(32),
      });

      const tokenJWT = createJWTToken({token : newUser.token});

      newUser.save().then((newDoc) => {
        res.json({
          result: true,
          token: tokenJWT,
          userName: newDoc.userName,
        });
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

      const tokenJWT = createJWTToken({token : data.token});

      res.json({ result: true, token: tokenJWT, userName: data.userName });
    } else {
      res.json({ result: false, error: "Invalid email adress or password" });
    }
  });
});

//ADD NEW METEO
//TODO - NON UTILISE
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

//NEWVERSION NEWMETEO
router.patch("/addMeteo2", authenticationMiddleware, (req, res) => 
{
  // Recherche de l'utilisateur en fonction du jeton (token) fourni dans la requête
  User.findOne({ token: req.uid }).then((user) => 
  {
    // Vérification si l'utilisateur existe
    if (!user) return res.json({ result: false, error: "User does not exist" });
    let newMeteo = req.body.newMeteo; 
    // Vérifier si newMeteo est une chaîne unique ou une chaîne de mots délimitée par des virgules
    if (typeof newMeteo === 'string') 
    {
      newMeteo = newMeteo.split(',');
    } 
    else if (!Array.isArray(newMeteo)) 
    {
      return res.json({ result: false, error: "Invalid value for newMeteo" });
    }
    // Mise à jour de l'utilisateur en remplaçant complètement le champ fav_meteo par les nouvelles valeurs - $set
    User.updateOne(
      { token: user.token },
      { $set: { fav_meteo: newMeteo } }
    ).then((result) => 
      {
          return res.json({
            result: true,
            meteo: "New Meteo saved in database",
          });
      }).catch(error => 
        {
          return res.status(500).json({ result: false, error: error.message });
        });
    }).catch(error => {
      return res.status(500).json({ result: false, error: error.message });
    });
});




//DELETE NEW METEO
//TODO - NON UTILISE
router.patch("/removeMeteo", authenticationMiddleware, (req, res) => {
  User.findOne({ token: req.uid }).then((data) => {
    if (!data) return res.json({ result: false, error: "User does not exist" });

    User.updateOne(
      { token: data.token },
      { $pull: { fav_meteo: req.body.newMeteo } }
    ).then((updateResult) => {
      // console.log(updateResult);
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

router.patch("/addAside", authenticationMiddleware, (req, res) => {
  User.findOne({ token: req.uid }).then((data) => {
    if (!data) return res.json({ result: false, error: "User do not exist" });

    User.updateOne(
      { token: data.token },
      { $addToSet: { fav_POI: req.body.id } }
    ).then((data) => {
      // console.log(data);
      if (data.modifiedCount) {
        return res.json({
          result: true,
          meteo: "New Fav added",
        });
      }
      return res.json({ result: false, meteo: "Already added" });
      // return res.redirect('/users/removeAside')
    });
  });
});
//Mettre de côté [Delete]
router.patch("/removeAside", authenticationMiddleware, (req, res) => {
  User.findOne({ token: req.uid }).then((data) => {
    if (!data) return res.json({ result: false, error: "User does not exist" });

    User.updateOne(
      { token: data.token },
      { $pull: { fav_POI: req.body.id } }
    ).then((updateResult) => {
      // console.log(updateResult);
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

// router.get("/myprofile", (req, res) => {
//   const bearer = req.headers.authorization;
//   const token = bearer.split(" ")[1];

//   User.findOne({ token })
//     .populate("fav_POI")
//     .then((data) => {
//       if (!data) {
//         return res.json({ result: false, error: "User does not exist" });
//       }
//       res.json({
//         result: true,
//         userName: data.userName,
//         fav_POI: data.fav_POI,
//         checklists: data.checklists,
//         meteo: data.fav_meteo,
//       });
//     });
// });

router.get('/myprofile', authenticationMiddleware, userController.getUserProfile);

// ROUTE CHECKLIST UPDATE
router.patch("/checklistUpdate", (req, res) => {
  User.findOne({ token: req.body.token }).then((data) => {
    if (!data) return res.json({ result: false, error: "User does not exist" });
  });

  User.updateOne(
    { checklists: { $elemMatch: { title: req.body.titleToSearch } } },
    { $set: { "checklists.$.title": req.body.newTitle } }
  )
    .then(() => {
      User.updateOne(
        {
          checklists: { $elemMatch: { title: req.body.newTitle } },
        },
        { $set: { "checklists.$.tasks.$[i]": req.body.newTaskDoc } },
        {
          arrayFilters: [{ "i.itemName": req.body.taskNameToSearch }],
        }
      ).then((data) => {
        if (data.modifiedCount) return res.json({ result: true, data });
      });
    })
    .catch((error) => res.json({ result: false, error }));
});

module.exports = router;
