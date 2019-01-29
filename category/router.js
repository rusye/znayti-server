'use strict';

const express = require('express');
const router = express.Router();

// ---- activate passport later ----
// const passport = require('passport');

// ---- require passport/authentication later ---- 
// const {router: localStrategy, jwtStrategy} = require('../auth');
// passport.use(localStrategy);
// passport.use(jwtStrategy);
// const jwtAuth = passport.authenticate('jwt', {session: false});

// Do I need to import all of them?
const {Business} = require('./models');
const {Category} = require('./categorySchema');
const {User} = require('../users/models');


// GET request for all categories
router.get('/', (req, res) => {
  Category.find()
    .then(categories => res.json(categories.map(category => category.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});


// ---- Require jwtAuth later ----
// POST request to create a new business
router.post('/', (req, res) => {
  const requiredFields = ['name', 'categoryName', 'address', 'hours', 'tel'];
  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  });

  // I forgot but where will it compare the req to the schema?
  User.findById(req.body.user_id)
    .then(user => {
      if (user) {
        Business
          .create({
            user: req.body.user_id,
            name: req.body.name,
            categoryName: req.body.categoryName,
            address: req.body.address,
            hours: req.body.hours,
            tel: req.body.tel
          })
          .then(business => {
            // Category.update(
            //   { $push: { category: business.category } }
            // );
            // I'm not sure if the above works correctly
            // Basically I need to check if that "Category first exists"
            // If it doesn't, it will create a new document
            // Then it will push the business.id to the new document
            // Would it be something like
            // Category .find(business.category).then(category => {
            //   if(category) {
            //     category.category.push(business._id)
            //   } else {
            //     Category.create({category: business.category}).then(category => {
            //       category.category.push(business._id)
            //     })
            //   }
            // })
            business.save();
            res.status(201).json({
              id: business.id,
              name: business.name,
              category: business.category,
              address: business.address,
              hours: business.hours,
              tel: business.tel
            })
          })
          .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Something went wrong'});
          });
      }
      else {
        const message = 'User not found';
        console.error(message);
        return res.status(400).send(message);
      }
    })
    
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Something went wrong'});
    });
});

// Make a Business GET request above the POST

module.exports = {router};