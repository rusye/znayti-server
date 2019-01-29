'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const CategorySchema = mongoose.Schema({
  name: {type: String, required: true}
});

CategorySchema.methods.serialize = function () {
  return {
    name: this.name || '',
    id: this._id
  };
};

const Category = mongoose.model('Category', CategorySchema);

module.exports = {Category};