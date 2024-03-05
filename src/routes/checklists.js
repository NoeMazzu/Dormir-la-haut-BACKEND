var express = require("express");
var router = express.Router();

const ChecklistTemplate = require('../models/checklistTemplates');

// router.patch("/updateChecklist", (req, res) => {
//     User.findOne({token: req.body.token})
//     .then(data => {
//         //Est ce qu'il y a un utilisateur ?
//         if (!data){ result: false }
//     })
// })



//Récup tout les infos de checklist
router.get('/', (req, res) => {
  ChecklistTemplate.find().then((data) => {
    if (!data) {
      return res.json({ result: false, error: "No Checklist" });
    }
    res.json({ result: true, ChecklistTemplate: data });
  })
  });

module.exports = router;