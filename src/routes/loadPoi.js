var express = require("express");
var router = express.Router();

var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch("https://www.refuges.info/api/massif?type_points=cabane, refuge, gite, bivouac&massif=53,14,18,20,12,8,3,11,7,9,17,22,6,16", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

module.exports = router;