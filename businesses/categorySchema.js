'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const CategorySchema = mongoose.Schema({
  // name: {type: String, required: true}
  category: [{type: mongoose.Schema.Types.ObjectId, ref: 'Business'}]
});

CategorySchema.methods.serialize = function () {
  return {
    category: this.category,
    id: this._id
  };
};

const Category = mongoose.model('Category', CategorySchema);

module.exports = {Category};