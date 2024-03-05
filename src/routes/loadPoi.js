var express = require("express");
var router = express.Router();
const Poi = require("../models/pois");

const typeQuery = "gite"; //MAJ sur refuge uniquement - type par type "cabane, refuge, gite, bivouac"
const encodedTypeQuery = encodeURIComponent(typeQuery);
const massifQuery = "53,14,18,20,12,8,3,11,7,9,17,22,6,16";
const encodedMassifQuery = encodeURIComponent(massifQuery);

//Chargement des données existantes depuis l'API du site Refuge Info
//Chargement successif par type de données afin de pouvoir outrepasser la limite de 250 items
router.post('/', async (req, res) => {
    try {
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        
        const response = await fetch(`https://www.refuges.info/api/massif?type_points=${encodedTypeQuery}&massif=${encodedMassifQuery}`, requestOptions);

        if (response.ok) {
            const result = await response.json();

            const poiArray = result.features.map(poi => 
                ({
                    name: poi.properties.nom.substring(0,30),
                    coordinates: 
                        {
                            latitude: poi.geometry.coordinates[0],
                            longitude: poi.geometry.coordinates[1],
                        },
                    desc: poi.properties.lien,
                    createdBy: "65e73b95b75d7ce954718af9",
                    type:"gîte",
                    isPublic:true
                }))
            
            const itemLoaded = await Poi.insertMany(poiArray)

            return res.json({result: true, message:'Chargement Ok', data: itemLoaded})


            // type: req.body.typePoi,
            // isPublic: false,
        } else {
            throw new Error(`Erreur lors de l'appel de l'API refuge infos : ${response.status}`);
        }
    } catch (error) {
        console.error('error', error);
    }
});

module.exports = router;