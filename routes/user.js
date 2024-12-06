"use strict";
const express = require("express");
const { User } = require("../models");
// Construct a router instance??
const router = express.Router();
const { authenticateUser } = require("../middleware/user-auth");

//Handler function to wrap routes and to allow proper usager of asyncHandler
// function asyncHandler(cb) {
//   return async (req, res, next) => {
//     try {
//       await cb(req, res, next);
//     } catch (err) {
//       next(err);
//     }
//   };
// }

///api/users - GET:
//This will return all properties and values for the currently authenticated User
//along with a 200 HTTP status code
// router.get(
//   "/",
//authenticateUser,
//asyncHandler(
//   async (req, res) => {
//     const user = req.currentUser;
//     res.json(user); //return all properties from  user.js models
//     res.status(200).json({ message: "User successfully retrieved!" });
//     res.json({
//       firstName: user.firstName,
//       lastName: user.lastName,
//       emailAddress: user.emailAddress,
//       password: user.password,
//     });
//   }
// );
//);
router.get("/", async (req, res) => {
  try {
    //async and await to make sure we have our user data before we respond to the client.
    const user = res.currentUser;
    res.status(200).json(user);
    // json({
    //   firstName: user.firstName,
    //   lastName: user.lastName,
    //   emailAddress: user.emailAddress,
    //   password: user.password,
    // });
  } catch (err) {
    res.json({ message: err.message });
  }
});

///api/users - POST:
//This route should create a new user, set the Location header to "/",
//and return a 201 HTTP status code and no content.
router.post(
  "/",
  //asyncHandler(
  async (req, res) => {
    //console.log(req.body);
    try {
      await User.create(req.body);
      res.status(201).location("/").end();
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  }
);
//);

module.exports = router;
