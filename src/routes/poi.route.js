var express = require("express");
var router = express.Router();
const Poi = require("../models/pois");
const User = require("../models/users");
const { ObjectId } = require('mongodb');

router.post("/", (req, res) => {
  const newPoi = new Poi(req.body);
  console.log('[APPEL Route POST - contenu req.body]',req.body)
  newPoi.save().then((data) => res.json({result: true, data}));
});

router.get("/", (req, res) => {
  Poi.find().then((data) => {
    res.json({ poi: data });
  });
});

router.get('/listOfPoi', (req, res) => {
  const poisFav = req.query.poisFav;
  const arrPoisFav = poisFav.split(',');

  if (!arrPoisFav || !Array.isArray(arrPoisFav) || arrPoisFav.length === 0) {
    return res.status(400).json({ error: 'Invalid parameter: poisFav should be a non-empty array' });
  }

  const filter = {
    '_id': {
      '$in': arrPoisFav.map(element => new ObjectId(element))
    }
  };

  Poi.find(filter)
    .then((data) => {
      return res.json(data);
    })
});


router.patch("/photoLike", async (req, res) => {
  const userId = await User.findOne({ token: req.body.token });
  const poi = await Poi.findOne({
    photos: { $elemMatch: { _id: req.body.photoId } },
  });

  const photo = await poi.photos.find((e) => e.id === req.body.photoId);
  if (!photo.liked.map((id) => id.toString()).includes(userId._id.toString())) {
    photo.liked.push(userId); //ajouter ici si l'élément est déjà présent dans tableau -toggle pour supprimer des likes
    const result = await poi.save();
    return res.json({ result: true, message: "Ajout du like effectué" });
  } else {
    return res.json({
      result: false,
      message: "La photo a déjà été liké par l'utilisateur",
    });
  }
});

router.patch("/photoUnLike", async (req, res) => {
  const userId = await User.findOne({ token: req.body.token });
  const poi = await Poi.findOne({
    photos: { $elemMatch: { _id: req.body.photoId } },
  });
  
  const photo = await poi.photos.find((e) => e.id === req.body.photoId);
  if (photo.liked.map((id) => id.toString()).includes(userId._id.toString())) {
    // Supprimer l'élément du tableau liked
    photo.liked = photo.liked.filter(
      (id) => id.toString() !== userId._id.toString()
    );
    // console.log("PhotoLiked:", photo.liked);
    // console.log("UserID:", userId._id);
    const result = await poi.save();
    return res.json({ result: true, message: "Like retiré avec succès" });
  } else {
    return res.json({
      result: false,
      message: "La photo n'a pas encore été likée par l'utilisateur",
    });
  }
});

router.patch("/poiBookMark", async (req, res) => {
  const userId = await User.findOne({ token: req.body.token });
  // Check si userId._id est déjà présent dans le tableau favorite
  const poi = await Poi.findOne({ _id: req.body.poiId, favorite: userId._id });
  if (!poi) {
    // Si userId._id n'est pas déjà présent, mettre  à jour le tableau avec $addToSet
    await Poi.updateOne(
      { _id: req.body.poiId },
      { $addToSet: { favorite: userId._id } }
    );
    return res.json({
      result: true,
      message: "POI marqué comme favori par l'utilisateur",
    });
  } else {
    // Si userId._id est déjà présent, ne rien faire
    return res.json({
      result: false,
      message: "POI déjà marqué comme favori par l'utilisateur",
    });
  }
});

router.patch("/poiUnBookMark", async (req, res) => {
  const userId = await User.findOne({ token: req.body.token });
  // Check si userId._id est déjà présent dans le tableau favorite
  const poi = await Poi.findOne({ _id: req.body.poiId, favorite: userId._id });
  if (poi) {
    // Si userId._id est déjà présent, supprimez-le du tableau avec $pull
    await Poi.updateOne(
      { _id: req.body.poiId },
      { $pull: { favorite: userId._id } }
    );
    return res.json({
      result: true,
      message: "POI désépinglé par l'utilisateur",
    });
  } else {
    // Si userId._id n'est pas présent, ne rien faire
    return res.json({
      result: false,
      message: "POI non épinglé par l'utilisateur",
    });
  }
});

router.get("/getPhotos/:poiId", async (req, res) => {
  try {
    const poiId = req.params.poiId;

    // Recherche du POI par son ID
    const poi = await Poi.findById(poiId);

    // Vérifiez si le POI existe
    if (!poi) {
      return res.status(404).json({ error: "POI non trouvé" });
    }

    // Récupérez toutes les photos du POI
    const allPhotos = poi.photos;

    res.json({ photos: allPhotos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error" });
  }
});

router.get("/getPoi/:poiId", async (req, res) => {
  try {
    const poiId = req.params.poiId;

    // Recherche du POI par son ID
    const poi = await Poi.findById(poiId);

    // Vérifiez si le POI existe
    if (!poi) {
      return res.status(404).json({ error: "POI non trouvé" });
    }

    res.json({ poi: poi });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error" });
  }
});

//! ROUTE POUR SUPP DES POI
router.delete('/delete-random-elements', async (req, res) => {
  try {
    // Get total count of documents in the collection
    const totalCount = await Poi.countDocuments();

    // Generate 400 random indexes
    const indexesToDelete = Array.from({ length: 50 }, () =>
      Math.floor(Math.random() * totalCount)
    );

    // Fetch documents at random indexes and delete them
    const deletedElements = await Promise.all(
      indexesToDelete.map(async index => {
        const docToDelete = await Poi.findOne().skip(index);
        if (docToDelete) {
          await Poi.deleteOne({ _id: docToDelete._id });
          return docToDelete;
        }
      })
    );

    res.json({ deletedElements });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//! ROUTE POUR SUPP DES POI Privés
router.delete('/delete-private', async (req, res) => {
  try {
    const deletedElements = await Poi.deleteMany({isPublic:false})
    res.json({ deletedElements });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})


//*************Test Mongoose - ne pas utiliser******************** */
// Route pour ajouter un like sur une photo
router.patch("/addLike", (req, res) => {
  const { poiId, photoId, userId } = req.body;

  // $addToSet pour ajouter l'ID de l'utilisateur ayant liké la photo au tableau liked
  const update = {
    $addToSet: { "photos.$[elem].liked": userId },
  };

  // Options pour l'opérateur $addToSet afin de cibler le bon sous-document % ID de la photo
  const options = {
    arrayFilters: [{ "elem._id": photoId }],
  };

  // MAJ du document principal identifié par son ID (poiID) en utilisant l'opérateur $addToSet
  Poi.findByIdAndUpdate(poiId, update, options)
    .then((data) => {
      // console.log("poi:", poiId, "photo:", photoId, "userId:", userId);
      // console.log("resultat chargement:", data);
      return res
        .status(200)
        .json({ result: true, message: "Like ajouté avec succès à la phot" });
    })
    .catch((error) => {
      return res.status(500).json({ result: false, message: error.message });
    });
});


module.exports = router;
