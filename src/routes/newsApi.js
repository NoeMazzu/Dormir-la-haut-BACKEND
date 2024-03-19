var express = require('express');
var router = express.Router();

const authenticationMiddleware = require('../middlewares/authentication.middleware');
const newsController = require('../controllers/news.controller');

router.get('/', authenticationMiddleware, newsController.get);

module.exports = router;
