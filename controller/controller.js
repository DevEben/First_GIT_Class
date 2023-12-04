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
        message: `Student with ${studentId} found`,
        data: student,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Update a student
exports.updateStudent = async (req, res) => {
  try {
    // track the user id
    const studentId = req.params.studentId;
    // track student with the id gotten
    const student = await studentModel.findById(studentId);
    // check for error
    if (!student) {
      res.status(404).json({
        message: `Student with id: ${studentId} is not found.`,
      });
      return; 
    }

    // check for entity and replace with existing data
    const scores = req.body.score || {};

    const prevScores = {
      html: student.score.html,
      javascript: student.score.javascript,
      css: student.score.css,
      node: student.score.node,
    };

    const studentData = {
      name: req.body.name || student.name,
      stack: req.body.stack || student.stack,
      isAdmin: req.body.isAdmin || student.isAdmin,
      score: {
        html: scores.html || prevScores.html,
        javascript: scores.javascript || prevScores.javascript,
        css: scores.css || prevScores.css,
        node: scores.node || prevScores.node,
      },
    };

    // update the student
    const updateStudent = await studentModel.findByIdAndUpdate(studentId, studentData, {new: true});
    res.status(200).json({
      message: `Student with id: ${studentId} has been updated successfully.`,
      data: updateStudent,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};



// Delete a student
exports.deleteStudent = async (req, res) => {
  try{
    // track the user id
    const studentId = req.params.studentId;
    //track student with the id gotten
    const student = await studentModel.findById(studentId);
    // check for error
    if (!student){
        res.status(404).json({
          message: `Student with id: ${studentId} is not found.`
        });
    }
    // delete the student
    await studentModel.findByIdAndDelete(studentId)
    return res.status(200).json({
        message: `Student with id: ${studentId} was successfully deleted.`,
        data: student,
    });
}catch (err) {
    res.status(500).json({
        message: err.message});
}
} 


exports.makeAdmin = async (req, res) => {
  try {

    // track the user id
    const studentId = req.params.studentId;
    // track student with the id gotten
    const student = await studentModel.findById(studentId);
    // check for error
    if (!student) {
      res.status(404).json({
        message: `Student with id: ${studentId} is not found.`,
      });
      return; 
    }

    const admin = await studentModel.findByIdAndUpdate(studentId, {isAdmin: true}, {new: true})
    res.status(200).json({
      message: `Student with id: ${studentId} has been made Admin.`,
      data: admin
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
}