require("dotenv").config();
require("./src/models/connection");

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./src/routes/index");
var usersRouter = require("./src/routes/users");
var poiRouter = require("./src/routes/poi.route");
var checklistsRouter = require('./src/routes/checklists');
var newsApiRouter = require('./src/routes/newsApi');
var loadPoiRouter = require('./src/routes/loadPoi');
var meteoRouter = require('./src/routes/meteo');
var cloudinaryRouter = require('./src/routes/cloudinary');

var app = express();
const fileUpload = require('express-fileupload');
app.use(fileUpload());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/poi", poiRouter);
app.use("/users", usersRouter);
app.use('/checklists', checklistsRouter);
app.use('/newsApi', newsApiRouter);
app.use('/loadPoi', loadPoiRouter);
app.use('/meteo', meteoRouter);
app.use('/cloudinary', cloudinaryRouter);

module.exports = app;
