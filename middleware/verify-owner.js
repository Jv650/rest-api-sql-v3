const { Course } = require("../models");

//middleware to verify if it's the correct course owner (id)

exports.verifyCourseOwner = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id); //await .getCourse(req.params.id);
    //console.log(getCount.userId);
    //console.log()
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Verify logged in user matches the course id belonging to that user
    if (course.userId != req.currentUser.id) {
      res
        .status(403)
        .json({ message: "You're not authorized to update this course" });
    }
    // attaches course to request object so that they next guy can use it
    req.course = course;
  } catch (err) {
    next(err);
  }
};
