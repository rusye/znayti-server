'use strict';
const {router} = require('./router');
const {localStrategy, jwtStrategy, isAdmin} = require('./strategies');

module.exports = {router, localStrategy, jwtStrategy, isAdmin};
