"use strict";

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const passport = require("passport");
const axios = require("axios");

const { router: usersRouter } = require("./users");
const {
  router: authRouter,
  localStrategy,
  jwtStrategy,
  isAdmin
} = require("./auth");
const { router: catRouter } = require("./category");
const { router: bussRouter } = require("./businesses");
const { router: emailRouter } = require("./mailRouter");

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL, GOOGLEMAPS_API } = require("./config");

const app = express();
app.use(express.json());

// Logging
app.use(morgan("common"));

// CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  if (req.method === "OPTIONS") {
    return res.send(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use("/api/users/", usersRouter);
app.use("/api/auth/", authRouter);
app.use("/categories/", catRouter);
app.use("/business/", bussRouter);
app.use("/emailsupport/", emailRouter);

const jwtAuth = passport.authenticate("jwt", { session: false });

// A protected endpoint test, requires valid JWT + need to be admin to access it
app.get("/api/protected", [jwtAuth, isAdmin], (req, res) => {
  return res.json({
    data: "rosebud"
  });
});

app.post("/location", (req, res) => {
  const key = `?key=${GOOGLEMAPS_API}`;
  return axios
    .get(
      `https://maps.googleapis.com/maps/api/geocode/json${key}&address=${
        req.body.location
      }`
    )
    .then(results => {
      let lat = results.data.results[0].geometry.location.lat;
      let long = results.data.results[0].geometry.location.lng;
      res.json({ lat, long });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

app.post("/findbusiness", (req, res) => {
  const findBusiness = encodeURIComponent(req.body.textquery);
  const key = `?key=${GOOGLEMAPS_API}`;
  axios
    .get(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json${key}&input=${findBusiness}&inputtype=textquery`
    )
    .then(results => {
      if (results.data.status === "ZERO_RESULTS") {
        return Promise.reject({
          code: 422,
          reason: "ValidationError",
          message: "Unable to find business"
        });
      }
      let place_id = results.data.candidates[0].place_id;
      return place_id;
    })
    .then(place => {
      axios
        .get(
          `https://maps.googleapis.com/maps/api/place/details/json${key}&placeid=${place}&fields=geometry,url`
        )
        .then(data => {
          let { url } = data.data.result;
          let { lat, lng } = data.data.result.geometry.location;
          res.json({ url, lat, lng });
        });
    })
    .catch(err => {
      console.log(err);
      if (err.reason === "ValidationError") {
        return res.status(err.code).json(err);
      }

      res.status(500).json({ message: "Internal server error" });
    });
});

app.use("*", (req, res) => {
  return res.status(404).json({ message: "Not Found" });
});

let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    // mongoose.set('debug', true);
    mongoose.set("useCreateIndex", true);
    mongoose.connect(databaseUrl, { useNewUrlParser: true }, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
        .on("error", err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
