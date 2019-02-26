'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const config = require('../config');
const router = express.Router();
const { isAdmin } = require('./strategies');

// FUTURE UPDATE: Create a duplicate token function but without passing through the admin piece
const createAuthToken = function(user) {
  return jwt.sign({user, 'admin': user.admin}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', {session: false});
router.use(bodyParser.json());

// FUTURE UPDATE: When regular user's are created.
// The user provides a username and password to login
// router.post('/login', localAuth, (req, res) => {
//   const user = req.user.serialize();
//   const authToken = createAuthToken(user);
//   res.json({authToken, user});
// });

router.post('/bigboss/login', [localAuth, isAdmin], (req, res) => {
  const user = req.user.serialize();
  const authToken = createAuthToken(user);
  res.json({authToken, user});
});

const jwtAuth = passport.authenticate('jwt', {session: false});

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});

module.exports = {router};
