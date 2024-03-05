var express = require("express");
var router = express.Router();

const NEWS_API_KEY = process.env.NEWS_API_KEY;

const today = new Date();
const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
const formattedToday = today.toISOString().split('T')[0];
const formattedSevenDaysAgo = sevenDaysAgo.toISOString().split('T')[0];

//chaine de recherche utilisée pour filtrer les mots clés - permet de gérer les espaces à passer dans l'url
const searchQuery = "alpes AND (meteo OR météo)";
const encodedSearchQuery = encodeURIComponent(searchQuery);

router.get('/',(req,res) => 
{
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    console.log('Cle:', NEWS_API_KEY)
    const apiUrl = `https://newsapi.org/v2/everything?q=${encodedSearchQuery}&apiKey=${NEWS_API_KEY}&language=fr&from=${formattedSevenDaysAgo}&to=${formattedToday}&searchIn=title`;
    
    fetch(apiUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            return res.json({result : data.status, numOfArticles: data.totalResults, articles: data.articles,  })})
        .catch(error => console.error('Error fetching data:', error));
  
})
module.exports = router;