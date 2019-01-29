'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;


//---- Schema for hours of operation ----
// const HoursSchema = mongoose.Schema({
//   monday: {type: String, required: true},
//   tuesday: {type: String, required: true},
//   wednesday: {type: String, required: true},
//   thursday: {type: String, required: true},
//   friday: {type: String, required: true},
//   saturday: {type: String, required: true},
//   sunday: {type: String, required: true}
// });

// HoursSchema.methods.serialize = function () {
//   return {
//     monday: this.monday,
//     tuesday: this.tuesday,
//     wednesday: this.wednesday,
//     thursday: this.thursday,
//     friday: this.friday,
//     saturday: this.saturday,
//     sunday: this.sunday
//   };
// };

// const CategorySchema = mongoose.Schema({
//   name: {type: String, required: true}
// });

// CategorySchema.methods.serialize = function () {
//   return {
//     name: this.name || ''
//   };
// };

// ---- Schema for the address ----
const statesArray = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

// const AddressSchema = mongoose.Schema({
//   street: String,
//   city: String,
//   state: {
//     type: String,
//     uppercase: true,
//     enum: statesArray},
//   zip: Number
// });

// AddressSchema.methods.serialize = function () {
//   return {
//     street: this.street,
//     city: this.city,
//     state: this.state,
//     zip: this.zip
//   };
// };

const BusinessSchema = mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  name: {type: String, required: true},
  // categoryName: {type: String, required: true},
  categoryName: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
  // category: [CategorySchema],
  // address: {type: mongoose.Schema.Types.ObjectId, ref: 'Address'},
  address: {
    street: String,
    city: String,
    state: {
      type: String,
      uppercase: true,
      enum: statesArray},
    zip: Number
  },
  // hours: {type: mongoose.Schema.Types.ObjectId, ref: 'Hours'},
  hours: {
    monday: {type: String, required: true},
    tuesday: {type: String, required: true},
    wednesday: {type: String, required: true},
    thursday: {type: String, required: true},
    friday: {type: String, required: true},
    saturday: {type: String, required: true},
    sunday: {type: String, required: true}},
  tel: {type: Number, required: true}
});

BusinessSchema.methods.serialize = function () {
  return {
    id: this._id,
    user: this.user,
    name: this.name,
    categoryName: this.categoryName,
    address: this.address,
    hours: this.hours,
    tel: this.tel
  };
};

const Business = mongoose.model('Business', BusinessSchema);

// const Category = mongoose.model('Category', CategorySchema);

// const Hours = mongoose.model('Hours', HoursSchema);

// const Address = mongoose.model('Address', AddressSchema);

// module.exports = {Category, Business, Hours, Address};
module.exports = {Business};