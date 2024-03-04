
//ADD NEW METEO
router.patch("/addMeteo", (req, res) => {
  User.findOne({ token: req.body.token }).then((data) => {
    if (!data) return res.json({ result: false, error: "User do not exist" });
    User.updateOne(
      { token: data.token },
      { $addToSet: { fav_meteo: req.body.newMeteo } }
    ).then(data => {
      console.log(data);
      if (data.modifiedCount){ return res.json({
        result: true,
        meteo: "New Meteo saved in DDB",
      });} 
      return res.json({result: false, meteo: "Already added"})
 
    });
  });
});

