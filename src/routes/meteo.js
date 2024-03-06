var express = require("express");
var router = express.Router();

const METEO_API_KEY = process.env.METEO_KEY;

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

//TODO - Gerer le cas avec aucun retour de l'API (ville KO, non reconnue, n'existe plus sur l'API....)

async function fetchWeather(city) 
{
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${METEO_API_KEY}&units=metric`, requestOptions);
        const result = await response.json();
        console.log(result);
        const meteoData = {weather: result.weather[0].main, temp: result.main.temp,wind: result.wind.speed};
        return meteoData;
    } catch (error) {
        console.log('error', error);
    }
}

const meteoResult = [];

router.get('/', async (req,res) => {
    for (let massif of req.params)
    {
        const massifDetails = massifSrc.filter(byMassif => byMassif.massif === massif)
        const meteoCity = massifDetails[0].ville
        const encodedMassif = encodeURIComponent(meteoCity);
        meteoResult.push(fetchWeather(encodedMassif))
    }
    return res.json(meteoResult)
})

module.exports = router;
