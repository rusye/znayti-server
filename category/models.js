'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const CategorySchema = mongoose.Schema({
  name: {type: String, required: true},
  business: [{type: mongoose.Schema.Types.ObjectId, ref: 'Business'}]
});

CategorySchema.methods.serialize = function () {
  return {
    name: this.name,
    business: this.business
  };
};

const Category = mongoose.model('Category', CategorySchema);

module.exports = {Category};