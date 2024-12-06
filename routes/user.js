"use strict";
const express = require("express");
const { User } = require("../models");
// Construct a router instance??
const router = express.Router();
var bcrypt = require("bcryptjs");

//Handler function to wrap routes and to allow proper usager of asyncHandler
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}
///api/users - GET:
//This will return all properties and values for the currently authenticated User
//along with a 200 HTTP status code
router.get(
  "/api/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;
    res.json(user); //return all properties from  user.js models
    res.status(200).json({ message: "User successfully retrieved!" });
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      password: user.password,
    });
  })
);

///api/users - POST:
//This route should create a new user, set the Location header to "/",
//and return a 201 HTTP status code and no content.
router.post(
  "/api/users",
  asyncHandler(async (req, res) => {
    console.log(req.body);
    try {
      await User.create(req.body);
      //   await User.create({
      //     firstName: req.user.firstName,
      //     lastName: req.user.lastName,
      //     emailAddress: req.user.emailAddress,
      //     password: req.user.password,
      //   });
      res.status(201).json({ message: "Account successfully created!" });
      res.redirect("Location", "/");
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
  })
);

module.exports = router;
