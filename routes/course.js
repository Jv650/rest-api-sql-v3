"use strict";
const express = require("express");
const { Course } = require("../models");
const { User } = require("../models");
// Construct a router instance??
const router = express.Router();
const { authenticateUser } = require("../middleware/user-auth");

// function asyncHandler(cb) {
//   return async (req, res, next) => {
//     try {
//       await cb(req, res, next);
//     } catch (err) {
//       next(err);
//     }
//   };
// }

// ///api/courses - GET:
// //Return all courses including the User object associated with each course and
// //a 200 HTTP status code.
router.get("/", async (req, res) => {
  const course = await Course.findAll({
    include: [{ model: User }],
  });
  res.status(200).json({ message: "Courses successfully retrieved!" });
  //   res.json({
  //     title: res.body.title,
  //     description: res.body.description,
  //     estimatedTime: res.body.estimatedTime,
  //     materialsNeeded: res.body.materialsNeeded,
  //   });

  if (course) {
    res.json(course);
  } else {
    res.status(400);
    res.json({ message: "No courses found" });
  }
});

// ///api/courses/:id - GET:
// //Return the corresponding course including the User object associated with that course and
// //a 200 HTTP status code
router.get("/:id", async (req, res) => {
  try {
    //the await will wait and find the quote based on what the user inputs as the :id
    const course = await Course.findByPk(req.params.userId);
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ///api/courses - POST:
// //Create a new course, set the Location header to the URI for the newly created course,
// //and return a 201 HTTP status code and no content
// router.post("/", async (req, res) => {
//   try {
//     const course = await Course.create(req.body);
//     res.status(201).location(`/api/courses/${course.id}`).end();
//   } catch (err) {
//     console.log("Error: ", error.name);
//     if (
//       error.name === "SequelizeValidationError" ||
//       error.name === "SequelizeUniqueConstraintError"
//     ) {
//       const errors = error.errors.map((err) => err.message);
//       res.status(400).json({ errors });
//     } else {
//       throw error;
//     }
//   }
// });

router.post(
  "/",
  //asyncHandler(
  async (req, res) => {
    try {
      await Course.create(req.body);
      res.status(201).json({ message: "Course successfully created!" });
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

// // ///api/courses/:id - PUT:
// // //Update the corresponding course and
// // //return a 204 HTTP status code and no content
// router.put("/:id", async (req, res) => {
//   try {
//     const getCourse = await Course.findByPk(req.params.userId);
//     if (getCourse) {
//       //set course objects property equal to the new course property sent to us by the client
//       getCourse.course = req.body.course;
//       await getCourse.update({
//         title: req.body.title,
//         description: req.body.description,
//         estimatedTime: req.body.estimatedTime,
//         materialsNeeded: req.body.materialsNeeded,
//         userId: req.body.userId,
//       });

//       res.status(204).end(); //for put req, it's best practice to send a 204 status code which means everything was sent ok but there's nothing to send back
//     } else {
//       res.status(404).json({ message: "Course not found" });
//     }
//   } catch (error) {
//     //res.status(500).json({ message: err.message }); //you can inidicate your own status codes
//     if (
//       error.name === "SequelizeValidationError" ||
//       error.name === "SequelizeUniqueConstraintError"
//     ) {
//       const errors = error.errors.map((error) => error.message);
//       res.status(400).json({ errors });
//     } else {
//       throw error;
//     }
//   }
// });

router.put("/:id", async (req, res) => {
  try {
    const getCourse = await Course.create(req.body); //await records.getQuote(req.params.id);
    if (getCourse) {
      //set quote objects quote property equal to the new quote property sent to us by the client
      getCourse.title = req.body.title;
      getCourse.description = req.body.description;
      getCourse.estimatedTime = req.body.estimatedTime;
      getCourse.materialsNeeded = req.body.materialsNeeded;

      await Course.update(getCourse); //updateQuote method will save the new quote to the datastore - since its an async function you need to await it as well
      res.status(204).end(); //for put req, it's best practice to send a 204 status code which means everything was sent ok but there's nothing to send back
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message }); //you can inidicate your own status codes
  }
});

// ///api/courses/:id - DELETE:
// //Delete the corresponding course and
// //return a 204 HTTP status code and no content
router.delete("/:id", async (req, res) => {
  try {
    const course = await course.getCourse(req.params.userId);
    await course.deleteCourse(course);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message }); //you can inidicate your own status code
  }
});

module.exports = router;
