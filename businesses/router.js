'use strict';

const express = require('express');
const router = express.Router();

// ---- might not need bodyParser ----
const bodyParser = require('body-parser');
// if body parser removed also remove jsonParser
const jsonParser = bodyParser.json();

// ---- activate passport later ----
// const passport = require('passport');

// ---- require passport/authentication later ---- 
// const {router: localStrategy, jwtStrategy} = require('../auth');
// passport.use(localStrategy);
// passport.use(jwtStrategy);
// const jwtAuth = passport.authenticate('jwt', {session: false});

const {Business} = require('./models');
const {User} = require('../users/models');

// Get request for all categories
