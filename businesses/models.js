'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const statesArray = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

let telephoneValidate = function(v, cb) {
  setTimeout(function() {
    let phoneRegex = /\d{3}-\d{3}-\d{4}/;
    let msg = v + ' is not a valid phone number! Must be ###-###-####';
    cb(phoneRegex.test(v), msg);
  }, 5);
}

const hoursValidation = function(v, cb) {
  setTimeout(function() {
    let hoursRegex = /^(open)\s([01]?[0-9]|2[0-3]):([0-5][0-9])\s(close)\s([01]?[0-9]|2[0-3]):([0-5][0-9])|(closed)$/;
    let msg = v + ' is not a valid hours format! Must be "open ##:## close ##:##" or "closed"';
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

const BusinessSchema = mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  name: {type: String, required: true},
  categoryID: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
  address: {
    street: String,
    city: String,
    state: {
      type: String,
      uppercase: true,
      enum: statesArray},
    zip: String
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
    categoryID: this.categoryID,
    address: this.address,
    hours: this.hours,
    tel: this.tel
  };
};

BusinessSchema.post('remove',function(next) {
  return this.model('Category').update(
      { },
      { "$pull": { "business": this._id } },
      { "multi": true }
  );
})

const Business = mongoose.model('Business', BusinessSchema);

module.exports = {Business};