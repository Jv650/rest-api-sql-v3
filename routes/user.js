"use strict";
const express = require("express");
const { User } = require("../models");
// Construct a router instance??
const router = express.Router();
const { authenticateUser } = require("../middleware/user-auth");

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
  "/",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = await User.findAll({
      attributes: ["id", "firstName", "lastName", "emailAddress"],
    });

    //= await User.findAll({
    //   //include: [{ model: User }],
    // });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400);
      res.json({ message: "No users found" });
    }
  })
);

///api/users - POST:
//This route should create a new user, set the Location header to "/",
//and return a 201 HTTP status code and no content.
router.post(
  "/",
  asyncHandler(async (req, res) => {
    console.log(req.body);
    const { firstName, emailAddress, password } = req.body;
    console.log(firstName, emailAddress, password);
    try {
      const newUser = req.body;
      await User.create(newUser);
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
  })
);

module.exports = router;
