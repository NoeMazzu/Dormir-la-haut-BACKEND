const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isAlpha(value)) {
        throw new Error(
          "Invalid Firstname - Firstname does not only contain letters"
        );
      }
    },
  },
  lastName: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isAlpha(value)) {
        throw new Error(
          "Invalid Lastname - Lastname does not only contain letters"
        );
      }
    },
  },
  token: {
    type: String,
    required: true,
    trim: true,
    minLength: 32, // TODO: Valider la longueur du token
  },
  password: {
    type: String,
    required: true,
    minLength: 9,
    validate(value) {
      if (
        !value.match(/\d/) ||
        !value.match(/[a-zA-Z]/) ||
        !value.match(/[!@#$%&]/)
      ) {
        throw new Error(
          "Password must contain at least one letter, one number, and one special character"
        );
      }
    },
  },
  mail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email");
      }
    },
  },
  fav_POI: [
    {
      type: Schema.Types.ObjectId,
      ref: "POIS",
    },
  ],
  fav_meteo: [
    {
      type: String,
    },
  ],
  checklists: [checklist_user],
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxLength: 20,
  },
  myLocation: {
    longitude: {
      type: Number,
    },
    latitude: {
      type: Number,
    },
  },
});

const checklist_user = new Schema({
  title: {
    type: String,
    required: true,
    maxLength: 20,
  },
  tasks: [task],
});

const task = new Schema({
  itemName: {
    type: String,
    required: true,
  },
  complete: {
    type: Boolean,
  },
});

const User = mongoose.model("users", userSchema);

module.exports = User;
