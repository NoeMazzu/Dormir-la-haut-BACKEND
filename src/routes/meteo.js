var express = require("express");
var router = express.Router();

const METEO_API_KEY = process.env.METEO_KEY;

//Données source pour trouver la météo par Massif - association d'une ville par massif
const massifSrc = [
  { massif: "Chartreuse", ville: "Saint-Pierre-de-chartreuse,fr" },
  { massif: "Bornes-Aravis", ville: "la clusaz,fr" },
  { massif: "Vercors", ville: "La chapelle-en-vercors,fr" },
  { massif: "Lauziere et Grand Arc", ville: "montsapey,fr" },
  { massif: "Belledonne", ville: "Fond de France,fr" },
  { massif: "Mont Blanc", ville: "chamonix-mont-blanc,fr" },
  { massif: "Vanoise", ville: "pralognan-la-vanoise,fr" },
  { massif: "Beaufortain", ville: "beaufort,fr" },
  { massif: "Aiguilles Rouge", ville: "sixt-fer-à-cheval,fr" },
  { massif: "Bauges", ville: "La motte-en-bauges,fr" },
  { massif: "Grandes Rousses - Arves", ville: "Saint-jean-d'arves,fr" },
  { massif: "Cerces-Ambin", ville: "les essarts,fr" },
  { massif: "Ecrins", ville: "villar-loubière,fr" },
  { massif: "Taillefer-Matheysine", ville: "villard-saint-christophe,fr" },
  { massif: "Chablais", ville: "essert-romand,fr" },
  { massif: "Queyras", ville: "villargaudin,fr" },
  { massif: "Bugey", ville: "rumilly,fr" },
];

//TODO - rebasculer dans un module a part
function directionDuVent(deg) {
    if (deg < 0 || deg >= 360) {
        return "Direction invalide";
    } else if (deg < 90) {
        return "N-NE";
    } else if (deg < 180) {
        return "E-SE";
    } else if (deg < 270) {
        return "S-SO";
    } else {
        return "O-NO";
    }
}

//TODO - Gerer le cas avec aucun retour de l'API (ville KO, non reconnue, n'existe plus sur l'API....)

async function fetchWeather(city, massif) {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${METEO_API_KEY}&units=metric`,
      requestOptions
    );
    const result = await response.json();
    console.log('[API RES]:', result);
    //TODO - Verifier le fonctionnement de la gestion des erreurs
    if (result.cod !== 200) {
      throw { cod: result.cod, message: result.message };
    }
    const meteoData = {
      massif,
      weather: result.weather[0].main,
      //utilisation des icones de l'API - https://openweathermap.org/weather-conditions
      weatherIcon:result.weather[0].icon, //https://openweathermap.org/img/wn/10d@2x.png - adresse de l'image ayant pour iconValue 10d
      temp: Math.round(result.main.temp),
      windSpe: Math.round(result.wind.speed),
      windOri: directionDuVent(result.wind.deg),
    };
    return meteoData;
  } catch (error) {
    console.log("erreur lors de l'appel de l'API de meteo", error);
    return error;
  }
}



//Massif saisie sous le format : Vercors,Belledonne
router.get("/:massifs", async (req, res) => {
  //Créer un tableau à partir des paramètre de l'appel de la route
  const massifs = req.params.massifs.split(",");
  console.log("massifs issus des params : ",massifs)
  const meteoResult = [];
  for (let massif of massifs) 
  {
    const massifDetails = massifSrc.filter((byMassif) => byMassif.massif === massif);
    const meteoCity = massifDetails[0].ville;
    const encodedMassif = encodeURIComponent(meteoCity);
    console.log("encodedMassif:",encodedMassif,"Massif:",massif)

    const meteo = await fetchWeather(encodedMassif, massif);
    console.log("Meteo retour API:",meteo)
    meteoResult.push(meteo);
  }
  return res.json({ result: true, meteoInfo: meteoResult });
});

module.exports = router;
