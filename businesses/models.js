'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const statesArray = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

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
    zip: Number
  },
  hours: {
    monday: {type: String, required: true},
    tuesday: {type: String, required: true},
    wednesday: {type: String, required: true},
    thursday: {type: String, required: true},
    friday: {type: String, required: true},
    saturday: {type: String, required: true},
    sunday: {type: String, required: true}
  },
  tel: {
    type: String,
    validate: {
      isAsync: true,
      validator: function(v, cb) {
        setTimeout(function() {
          var phoneRegex = /\d{3}-\d{3}-\d{4}/;
          var msg = v + ' is not a valid phone number! Must be XXX-XXX-XXXX';
          cb(phoneRegex.test(v), msg);
        }, 5);
      },
      message: 'Default error message'
    },
    required: [true, 'User phone number required']
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

const Business = mongoose.model('Business', BusinessSchema);

module.exports = {Business};