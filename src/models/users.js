const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      mail: {
        type: String,
        required: true
      },
      fav_POI: [{
        type: Schema.Types.ObjectId,
        ref: 'POIS'
      }],
      fav_meteo: [{
        type: String
      }],
      checklists: [checklist_user],
      userName: {
        type: String,
        required: true
      },
      myLocation: {
        longitude: {
          type: Number
        },
        latitude: {
          type: Number
        }
      }
});

const checklist_user = new Schema({
    title: {
      type: String,
      required: true
    },
    tasks:[task]
  });

const task = new Schema({
itemName: {
    type: String,
    required: true
},
complete: {
    type: Boolean
}
});  

const User = mongoose.model("users", userSchema);

module.exports = User;
