var express = require("express");
var router = express.Router();
const User = require("../models/users");

router.patch("/updateChecklist", (req, res) => {
    User.findOne({token: req.body.token})
    .then(data => {
        //Est ce qu'il y a un utilisateur ?
        if (!data){ result: false }
    })
})

module.exports = router;