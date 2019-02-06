'use strict';

const express = require('express');
const router = express.Router();

// ---- activate passport later ----
// const passport = require('passport');

// ---- require passport/authentication later ---- 
// const { router: localStrategy, jwtStrategy, isAdmin } = require('./auth');
// passport.use(localStrategy);
// passport.use(jwtStrategy);
// const jwtAuth = passport.authenticate('jwt', {session: false});

const {Business} = require('./models');
const {Category} = require('../category/models');
const {User} = require('../users/models');


// GET request for all business
router.get('/', (req, res) => {
  Business.find()
    .then(businesses => res.json(businesses.map(business => business.serialize())))
    .catch(err => {
      console.log(err);
      res.status(500).json({message: 'Internal server error'})
    });
});


// GET request for a business
router.get('/:id', (req, res) => {
  Business.findById(req.params.id)
    .then(business => res.json(business))
    .catch(err => {
      console.log(err);
      res.status(500).json({message: 'Internal server error'})
    });
});


// ---- Figure out how to check for business name also
// ---- Require jwtAuth later ----
// POST request to create a new business
router.post('/', (req, res) => {
  const requiredFields = ['name', 'categoryID', 'address', 'hours', 'tel'];
  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  });

  User.findById(req.body.user_id)
    .then(user => {
      if (user) {
        Business
          .create({
            user: req.body.user_id,
            name: req.body.name,
            categoryID: req.body.categoryID,
            address: req.body.address,
            hours: req.body.hours,
            tel: req.body.tel
          })
          .then(business => {
            Category.findById(business.categoryID).then(category => {
              if(category) {
                category.business.push(business._id)
                category.save();
              } else {
                const message = 'Category not found';
                console.error(message);
                return res.status(400).send(message);
              }
            });
            business.save();
            res.status(201).json({
              id: business.id,
              name: business.name,
              categoryID: business.categoryID,
              address: business.address,
              hours: business.hours,
              tel: business.tel
            })
          })
          .catch(err => {
            console.error('im inside the error ' + err);
            res.status(500).json({message: err.message});
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


// ---- Require jwtAuth later ----
// PUT request to update a business
router.put('/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({message: `ID's do not match`});
  }

  const toUpdate = {};
  const updateableFields = ['user', 'name', 'categoryID', 'address', 'hours', 'tel'] 
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  function dotNotate(obj,target,prefix) {
    target = target || {},
    prefix = prefix || "";
  
    Object.keys(obj).forEach(function(key) {
      if ( typeof(obj[key]) === "object" ) {
        dotNotate(obj[key],target,prefix + key + ".");
      } else {
        return target[prefix + key] = obj[key];
      }
    });
  
    return target;
  }

  const theUpdate = dotNotate(toUpdate)

  // If name change then also check that the business doesn't exist already
  let oldCategoryID;
  if('categoryID' in req.body) {
    Business.findById(req.params.id)
      .then(business => {
        oldCategoryID = business.categoryID
      })
      .then(
        Business
        .findByIdAndUpdate(req.params.id, {$set: theUpdate}, {new: true, runValidators: true})
        .then(business => {
          Category.findById(business.categoryID)
            .then(category => {
              category.business.push(business._id)
              category.save();
          })
        })
        .then(category => {
          Category.findById(oldCategoryID)
            .then(category => {
              category.business.pull(req.body.id)
              category.save()
            })
          }
        )
        .then(updatedPost => res.status(204).end())
        .catch(err => res.status(500).json({message: err.message}))
      )
  } else {
    Business
      .findByIdAndUpdate(req.params.id, {$set: theUpdate}, {new: true, runValidators: true})
      .then(updatedPost => res.status(204).end())
      .catch(err => res.status(500).json({message: err.message}));
  }
})


// ---- Require jwtAuth later ----
// DELETE request to delete a business
router.delete('/:id', (req, res) => {
  Business
    .findById(req.params.id)
    .then(business => business.remove())
    .then(business => res.status(204).end())
    .catch(err => res.status(500).json({message: "Internal server error"}));
});

module.exports = {router};