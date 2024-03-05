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
  if (!photo.liked.map(id => id.toString()).includes(userId._id.toString()))
  {
    photo.liked.push(userId); //ajouter ici si l'élément est déjà présent dans tableau -toggle pour supprimer des likes
    console.log("PhotoLiked:",photo.liked);
    console.log("UserID:",userId._id);
    const result = await poi.save();  
    return res.json({result: true, message: 'Ajout du like effectué'});
  }
  else
  {
    return res.json({result: false, message : 'La photo a déjà été liké par l\'utilisateur'})
  }
});


router.patch("/photoUnLike", async (req, res) => {
  const userId = await User.findOne({ token: req.body.token });
  const poi = await Poi.findOne({
    photos: { $elemMatch: { _id: req.body.photoId } },
  });
  console.log(poi.photos);
  const photo = await poi.photos.find((e) => e.id === req.body.photoId);
  if (photo.liked.map(id => id.toString()).includes(userId._id.toString())) {
    // Supprimer l'élément du tableau liked
    photo.liked = photo.liked.filter(id => id.toString() !== userId._id.toString());
    console.log("PhotoLiked:",photo.liked);
    console.log("UserID:",userId._id);
    const result = await poi.save();  
    return res.json({result: true, message: 'Like retiré avec succès'});
  } else {
    return res.json({result: false, message : 'La photo n\'a pas encore été likée par l\'utilisateur'});
  }
});


//*************Test Mongoose - ne pas utiliser******************** */
// Route pour ajouter un like sur une photo
router.patch('/addLike', (req, res) => {
  const { poiId, photoId, userId } = req.body;

  // $addToSet pour ajouter l'ID de l'utilisateur ayant liké la photo au tableau liked
  const update = {
    $addToSet: { 'photos.$[elem].liked': userId }
  };

  // Options pour l'opérateur $addToSet afin de cibler le bon sous-document % ID de la photo
  const options = {
    arrayFilters: [{ 'elem._id': photoId }]
  };

  // MAJ du document principal identifié par son ID (poiID) en utilisant l'opérateur $addToSet
  Poi.findByIdAndUpdate(poiId, update, options)
    .then((data) => {
      console.log('poi:',poiId,'photo:',photoId,'userId:',userId)
      console.log("resultat chargement:",data)
      return res.status(200).json({ result:true, message: 'Like ajouté avec succès à la phot' });
    })
    .catch(error => {
      return res.status(500).json({ result: false, message: error.message });
    });
});


module.exports = router;
