"use strict";
const express = require("express");
const { Course } = require("../models");
const { User } = require("../models");
// Construct a router instance??
const router = express.Router();
const { authenticateUser } = require("../middleware/user-auth");
const { verifyCourseOwner } = require("../middleware/verify-owner");

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

// ///api/courses - GET:
// //Return all courses including the User object associated with each course and
// //a 200 HTTP status code.
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const course = await Course.findAll({
      attributes: [
        "id",
        "title",
        "description",
        "estimatedTime",
        "materialsNeeded",
      ],
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "emailAddress"],
        },
      ],
    });

    if (course) {
      res.status(200).json(course);
    } else {
      res.status(400);
      res.json({ message: "No courses found" });
    }
  })
);

// ///api/courses/:id - GET:
// //Return the corresponding course including the User object associated with that course and
// //a 200 HTTP status code
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    try {
      //the await will wait and find the course based on what the user inputs as the :id
      const course = await Course.findByPk(req.params.id, {
        attributes: [
          "id",
          "title",
          "description",
          "estimatedTime",
          "materialsNeeded",
        ],
        include: [
          {
            model: User,
            attributes: ["id", "firstName", "lastName", "emailAddress"],
          },
        ],
      });
      if (course) {
        res.json(course);
      } else {
        res.status(404).json({ message: "Course not found" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
);

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
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.create(req.body);
      res.status(201).location(`/courses/${course.id}`).end();
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        console.log("Validation errors: ", errors);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

// // ///api/courses/:id - PUT:
// // //Update the corresponding course and
// // //return a 204 HTTP status code and no content
// router.put("/:id",
// authenticateUser,
//   verifyCourseOwner,
//   asyncHandler(async (req, res) => {
//     try {
//       const course = req.course;
//       if (course) {
//         //set course objects property equal to the new course property sent to us by the client
//         getCourse.course = req.body.course;
//         await getCourse.update({
//           title: req.body.title,
//           description: req.body.description,
//           estimatedTime: req.body.estimatedTime,
//           materialsNeeded: req.body.materialsNeeded,
//           userId: req.body.userId,
//         });
//         await course.save();
//         res.status(204).end(); //for put req, it's best practice to send a 204 status code which means everything was sent ok but there's nothing to send back
//       } else {
//         res.status(404).json({ message: "Course not found" });
//       }
//     } catch (error) {
//       //res.status(500).json({ message: err.message }); //you can inidicate your own status codes
//       if (
//         error.name === "SequelizeValidationError" ||
//         error.name === "SequelizeUniqueConstraintError"
//       ) {
//         const errors = error.errors.map((error) => error.message);
//         res.status(400).json({ errors });
//       } else {
//         throw error;
//       }
//     }
//   });

router.put(
  "/:id",
  //security check point
  authenticateUser,
  verifyCourseOwner,
  asyncHandler(async (req, res) => {
    try {
      //set course objects course property equal to the new course property sent to us by the client
      const course = req.course; //retrieved from middleware
      course.title = req.body.title;
      course.description = req.body.description;
      course.estimatedTime = req.body.estimatedTime;
      course.materialsNeeded = req.body.materialsNeeded;

      await course.save(); //await because save takes time
      res.status(204).end();
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        console.log("Validation errors: ", errors);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

// ///api/courses/:id - DELETE:
// //Delete the corresponding course and
// //return a 204 HTTP status code and no content
router.delete(
  "/:id",
  //security check point
  authenticateUser,
  verifyCourseOwner,
  asyncHandler(async (req, res) => {
    try {
      const course = req.course; //req.params.id; //course(req.params.id);
      await course.destroy();
      //await course.delete();
      //course.destr(req.params);
      //const result = await Course.destroy({ where: { id: courseId } });

      res
        .status(204)
        .json({ message: `Course with id ${req.params.id} has been deleted` })
        .end();
    } catch (err) {
      res.status(500).json({ message: err.message }); //you can inidicate your own status code
    }
  })
);

module.exports = router;
