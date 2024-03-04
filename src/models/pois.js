const mongoose = require("mongoose");

const poiSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 30,
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  desc: {
    type: String,
    required: true,
    maxLength: 300,
  },
  favorite: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  photos: [photos],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  type: {
    type: String,
    enum: ["bivouac", "refuge", "gîte", "cabane", "autre"],
  },
  isPublic: {
    type: Boolean,
    required: true,
  },
});

const photos = new Schema({
  url: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error("Invalid URL");
      }
    },
  },
  liked: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
});

const Poi = mongoose.model("pois", poiSchema);

module.exports = Poi;
