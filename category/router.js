"use strict";

const express = require("express");
const router = express.Router();

// ---- activate passport later ----
// const passport = require('passport');

// ---- require passport/authentication later ----
// const { router: localStrategy, jwtStrategy, isAdmin } = require('./auth');
// passport.use(localStrategy);
// passport.use(jwtStrategy);
// const jwtAuth = passport.authenticate('jwt', {session: false});

const { Category } = require("./models");
const { Business } = require("../businesses/models");
const { User } = require("../users/models");

// GET request for all categories
router.get("/", (req, res) => {
  Category.find()
    .sort("name")
    .then(categories =>
      res.json(categories.map(category => category.serialize()))
    )
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

// GET request for specific category
router.get("/:id", (req, res) => {
  Business.find({ category: req.params.id })
    .then(businesses => {
      res.json(
        businesses.map(business => {
          return {
            id: business._id,
            name: business.name,
            city: business.address.city,
            state: business.address.state,
            category: business.category.name
          };
        })
      );
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

// ---- Require jwtAuth later ----
// POST request to create a new category
router.post("/", (req, res) => {
  if (!("name" in req.body)) {
    const message = "Missing name in request body";
    console.error(message);
    return res.status(400).json({ code: 400, message });
  }

  if (!req.body.name.match(/^(\b[A-Z]\w*\s*)+.{2,}$/)) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message:
        "Please enter category name that is 3+ characters, first letters are capitalized",
      location: "Name"
    });
  }

  User.findById(req.body.user_id)
    .then(user => {
      if (user) {
        Category.find({ name: req.body.name })
          .count()
          .then(count => {
            if (count > 0) {
              return Promise.reject({
                code: 422,
                reason: "ValidationError",
                message: "Category already exists",
                location: "name"
              });
            }
            return count;
          })
          .then(category => {
            return Category.create({
              user: req.body.user_id,
              name: req.body.name
            });
          })
          .then(category => {
            return res.status(201).json(category.serialize());
          })
          .catch(err => {
            console.error(err);
            if (err.reason === "ValidationError") {
              return res.status(err.code).json(err);
            }
            res
              .status(500)
              .json({ code: 500, message: "Internal server error" });
          });
      } else {
        const message = "User not found";
        console.error(message);
        return res.status(400).send(message);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Something went wrong" });
    });
});

// ---- Require jwtAuth later ----
// PUT request to update a category
router.put("/:id", (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({ code: 400, message: `ID's do not match` });
  }

  const toUpdate = {};
  const updateableFields = ["name"];
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Category.find({ name: req.body.name })
    .count()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: "ValidationError",
          message: "Category already exists",
          location: "name"
        });
      }
      return count;
    })
    .then(count => {
      Category.findByIdAndUpdate(
        req.params.id,
        { $set: toUpdate },
        { new: true }
      )
        .then(updatedCategory => res.status(204).end())
        .catch(err =>
          res.status(500).json({ message: "Something went wrong" })
        );
    })
    .catch(err => {
      console.error(err);
      if (err.reason === "ValidationError") {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ message: "Something went wrong" });
    });
});

// ---- Require jwtAuth later ----
// DELETE request to delete a category
router.delete("/:id", (req, res) => {
  Business.find({ category: req.params.id })
    .count()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 400,
          reason: "ClientError",
          message: "Removal of category prohibited, this category is in use."
        });
      }
      return count;
    })
    .then(del => {
      Category.findByIdAndRemove(req.params.id)
        .then(category => res.status(204).end())
        .catch(err =>
          res.status(500).json({ message: "Internal server error" })
        );
    })
    .catch(err => {
      console.error(err);
      if (err.reason === "ClientError") {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ message: "Something went wrong" });
    });
});

module.exports = { router };
