"use strict";
const express = require("express");
const { User } = require("./models");
// Construct a router instance??
const router = express.Router();

///api/users - GET:
//This will return all properties and values for the currently authenticated User
//along with a 200 HTTP status code

router.get(
  "/users",
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
  "/users",
  asyncHandler(async (req, res) => {
    await User.create(req.body);
    res.redirect("Location", "/");
    res.status(201).json({ message: "Account successfully created!" });
  })
);
