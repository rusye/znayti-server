'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const CategorySchema = mongoose.Schema({
  name: {type: String, required: true}
});

CategorySchema.methods.serialize = function () {
  return {
    id: this._id,
    name: this.name
  };
};

const Category = mongoose.model('Category', CategorySchema);

module.exports = {Category};