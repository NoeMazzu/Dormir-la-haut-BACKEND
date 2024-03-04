const mongoose = require("mongoose");

const poiSchema = mongoose.Schema({
    name: {
        type: String
      },
      coordinates: {
        latitude: {
          type: Number,
          required: true
        },
        longitude: {
          type: Number,
          required: true
        }
      },
      desc: {
        type: String,
        required: true
      },
      favorite: [{
        type: Schema.Types.ObjectId,
        ref: 'users'
      }],
      photos: [photos],
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      type: {
        type: String
      },
      isPublic: {
        type: Boolean,
        required: true
      }
});

const photos = new Schema({
    url: {
      type: String,
      required: true
    },
    liked: [{
      type: Schema.Types.ObjectId,
      ref: 'users'
    }]
  });

const Poi = mongoose.model("pois", poiSchema);

module.exports = Poi;
