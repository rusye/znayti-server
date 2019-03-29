"use strict";
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const statesArray = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DC",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY"
];

let telephoneValidate = function(v, cb) {
  setTimeout(function() {
    let phoneRegex = /^[0-9]{10,10}$/;
    let msg = v + " is not a valid phone number! Must be 1234567890";
    cb(phoneRegex.test(v), msg);
  }, 5);
};

const hoursValidation = function(v, cb) {
  if (v.toString() == "") {
    return true;
  } else {
    let hoursRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    let msg =
      v + ' is not a valid hours format! Must be between 00:00 and 23:59 or ""';
    cb(hoursRegex.test(v), msg);
  }
};

const hoursLogic = {
  type: String,
  validate: {
    isAsync: true,
    validator: hoursValidation,
    message: "Default error message"
  },
  default: ""
};

const longitude = {
  type: Number,
  required: true
};
const latitude = {
  type: Number,
  required: true
};

let zipValidation = function(v, cb) {
  setTimeout(function() {
    let zipRegex = /^\d{5}(?:[-]\d{4})?$/;
    let msg =
      v +
      " is not a valid zip code! Must be in this format 12345 or 12345-1234";
    cb(zipRegex.test(v), msg);
  }, 5);
};

const zipCode = {
  type: String,
  validate: {
    isAsync: true,
    validator: zipValidation,
    message: "Default error message"
  }
};

const BusinessSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  contactName: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  googlePlace: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: {
      type: String,
      uppercase: true,
      enum: statesArray,
      required: true
    },
    zip: zipCode,
    coordinates: [longitude, latitude]
  },
  hours: {
    Monday: { open: hoursLogic, close: hoursLogic },
    Tuesday: { open: hoursLogic, close: hoursLogic },
    Wednesday: { open: hoursLogic, close: hoursLogic },
    Thursday: { open: hoursLogic, close: hoursLogic },
    Friday: { open: hoursLogic, close: hoursLogic },
    Saturday: { open: hoursLogic, close: hoursLogic },
    Sunday: { open: hoursLogic, close: hoursLogic }
  },
  telephone: {
    type: String,
    validate: {
      isAsync: true,
      validator: telephoneValidate,
      message: "Default error message"
    },
    required: true
  }
});

BusinessSchema.methods.serialize = function() {
  return {
    id: this._id,
    user: this.user,
    name: this.name,
    contactName: this.contactName,
    googlePlace: this.googlePlace,
    category: this.category,
    address: this.address,
    hours: this.hours,
    telephone: this.telephone
  };
};

BusinessSchema.pre("find", function() {
  this.populate("category");
});

BusinessSchema.pre("findOne", function() {
  this.populate("category");
});

const Business = mongoose.model("Business", BusinessSchema);

module.exports = { Business };
