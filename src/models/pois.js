const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");

const validator = require("validator");

const photos = new Schema({
  url: {
    type: String,
    // required: true,
    // validate(value) {
    //   if (!validator.isURL(value)) {
    //     throw new Error("Invalid URL");
    //   }
    // },
  },
  liked: [
    {
      type: ObjectId,
      ref: "users",
    },
  ],
});

const poiSchema = Schema({
  name: {
    type: String,
    required: true,
    maxLength: 50,
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
      type: ObjectId,
      ref: "users",
    },
  ],
  photos: [photos],
  createdBy: {
    type: ObjectId,
    ref: "users",
  },
  type: {
    type: String,
    enum: ["Bivouac", "Refuge", "Gîte", "Cabane", "Autre"],
  },
  isPublic: {
    type: Boolean,
    required: true,
  },
});

const Poi = model("pois", poiSchema);

module.exports = Poi;
