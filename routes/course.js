"use strict";
const express = require("express");
const { Course } = require("../models");
const { User } = require("../models");
// Construct a router instance??
const router = express.Router();
const { authenticateUser } = require("../middleware/user-auth");

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

///api/courses - GET:
//Return all courses including the User object associated with each course and
//a 200 HTTP status code.
router.get("/api/courses", (req, res) => {
  res.json(course);
  res.status(200).json({ message: "Courses successfully retrieved!" });
  res.json({
    title: res.body.title,
    description: res.body.description,
    estimatedTime: res.body.estimatedTime,
    materialsNeeded: res.body.materialsNeeded,
  });

  if (course) {
    res.json(course);
  } else {
    res.status(400);
    res.json({ message: "No courses found" });
  }
});

///api/courses/:id - GET:
//Return the corresponding course including the User object associated with that course and
//a 200 HTTP status code
router.get("/api/courses/:id", (req, res) => {
  const courses = req.currentCourse; //req.body.course??
  const user = req.currentUser; //req.body.user??
  if (courses) {
    res.json(course);
    res.json(user);
    res.json({ courses: courses, users: users });
    res.status(200).json({ message: "Course successfully retrieved!" });
  } else {
    res.status(400);
    res.json({ message: "No course found" });
  }
});

///api/courses - POST:
//Create a new course, set the Location header to the URI for the newly created course,
//and return a 201 HTTP status code and no content
router.post("/api/courses", async (req, res) => {
  try {
    //will check if user and course have been submitted with if statement
    if (req.body.users && req.body.courses) {
      //throw new Error("Oh no something went wrong!");
      const course = await course.createCourse({
        //here is the object which must be passed a course and user property by the user
        course: req.body.courses,
        user: req.body.users,
      });
      res.status(201).json(course);
      res.redirect("Location", "/"); //edit??
    } else {
      res.status(400).json({ message: "Course and user required." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message }); //you can inidicate your own status codes
  }
});

///api/courses/:id - PUT:
//Update the corresponding course and
//return a 204 HTTP status code and no content
router.put("/api/courses/:id", async (req, res) => {
  try {
    const getCourse = await course.getCourse(req.params.userId);
    if (getCourse) {
      //set course objects property equal to the new course property sent to us by the client
      getCourse.course = req.body.course;
      await courses.update({
        title: req.body.title,
        description: req.body.description,
        estimatedTime: req.body.estimatedTime,
        materialsNeeded: req.body.materialsNeeded,
      });

      res.status(204).end(); //for put req, it's best practice to send a 204 status code which means everything was sent ok but there's nothing to send back
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    //res.status(500).json({ message: err.message }); //you can inidicate your own status codes
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      const errors = error.errors.map((error) => error.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
});

///api/courses/:id - DELETE:
//Delete the corresponding course and
//return a 204 HTTP status code and no content
router.delete("/api/courses/:id", async (req, res) => {
  try {
    const course = await course.getCourse(req.params.userId);
    await course.deleteCourse(course);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message }); //you can inidicate your own status code
  }
});

module.exports = router;
