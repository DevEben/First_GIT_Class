const studentModel = require('../models/model')

// create a new students
exports.createStudent = async (req, res) => {
    try {
      const student = new studentModel(req.body);
      if (!student) {
        res.status(400).json({
          message: "can not create a new student",
        });
      }
      await student.save();
      res.status(201).json({
        message: "successfully created a new student",
        data: student
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };


// get all students
exports.getAll = async (req, res) => {
  try {
    const student = await studentModel.find();
    if (student.length == 0) {
      res.status(404).json({
        message: "Student database is empty",
      });
    } else {
      res.status(201).json({
        message: "List of all students in this database",
        data: student,
        totalNumberOfTrainees: student.length,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// get a student
exports.getOne = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const student = await studentModel.findById(studentId);
    if (!student) {
      res.status(404).json({
        message: "Student database is empty",
      });
    } else {
      res.status(201).json({
        message: "Student with "+studentId+ "found",
        data: student,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};