const mongoose = require("mongoose");

const poiSchema = mongoose.Schema({});

const Poi = mongoose.model("pois", poiSchema);

module.exports = Poi;
