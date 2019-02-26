'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const statesArray = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

let telephoneValidate = function(v, cb) {
  setTimeout(function() {
    let phoneRegex = /\d{3}-\d{3}-\d{4}/;
    let msg = v + ' is not a valid phone number! Must be 123-123-1234';
    cb(phoneRegex.test(v), msg);
  }, 5);
}

const hoursValidation = function(v, cb) {
  setTimeout(function() {
    let hoursRegex = /^(open)\s([01]?[0-9]|2[0-3]):([0-5][0-9])\s(close)\s([01]?[0-9]|2[0-3]):([0-5][0-9])|(closed)$/;
    let msg = v + ' is not a valid hours format! Must be "open 01:12 close 12:12" or "closed"';
    cb(hoursRegex.test(v), msg);
  }, 5)
}

const hoursLogic = {
  type: String,
  validate: {
    isAsync: true,
    validator: hoursValidation,
    message: 'Default error message'
  },
  required: true
};

let longitudeValidation = function(v, cb) {
  setTimeout(function() {
    let longitudeRegex = /^[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;
    let msg = v + ' is not a valid longitude! Must be between -180 and +180';
    cb(longitudeRegex.test(v), msg);
  }, 5);
}

const longitude = {
  type: Number,
  validate: {
    isAsync: true,
    validator: longitudeValidation,
    message: 'Default error message'
  },
  required: true
}

let latitudeValidation = function(v, cb) {
  setTimeout(function() {
    let latitudeRegex = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;
    let msg = v + ' is not a valid latitude! Must be between -90 and +90';
    cb(latitudeRegex.test(v), msg);
  }, 5);
}

const latitude = {
  type: Number,
  validate: {
    isAsync: true,
    validator: latitudeValidation,
    message: 'Default error message'
  },
  required: true
}

let zipValidation = function(v, cb) {
  setTimeout(function() {
    let zipRegex = /^\d{5}(?:[-]\d{4})?$/;
    let msg = v + ' is not a valid zip code! Must be in this format 12345 or 12345-1234';
    cb(zipRegex.test(v), msg);
  }, 5);
}

const zipCode = {
  type: String,
  validate: {
    isAsync: true,
    validator: zipValidation,
    message: 'Default error message'
  }
}

const BusinessSchema = mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  name: {type: String, required: true},
  category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
  address: {
    street: String,
    city: {type: String, required: true},
    state: {
      type: String,
      uppercase: true,
      enum: statesArray,
      required: true},
    zip: zipCode,
    coordinates: [longitude, latitude]
  },
  hours: {
    monday: hoursLogic,
    tuesday: hoursLogic,
    wednesday: hoursLogic,
    thursday: hoursLogic,
    friday: hoursLogic,
    saturday: hoursLogic,
    sunday: hoursLogic
  },
  tel: {
    type: String,
    validate: {
      isAsync: true,
      validator: telephoneValidate,
      message: 'Default error message'
    },
    required: true
  }
});


BusinessSchema.methods.serialize = function () {
  return {
    id: this._id,
    user: this.user,
    name: this.name,
    category: this.category,
    address: this.address,
    hours: this.hours,
    tel: this.tel
  };
};

BusinessSchema.pre('find', function() {
  this.populate('category')
})

BusinessSchema.pre('findOne', function() {
  this.populate('category')
})

const Business = mongoose.model('Business', BusinessSchema);

module.exports = {Business};