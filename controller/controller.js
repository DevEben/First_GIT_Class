const studentModel = require('../models/model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const signUp = async (req, res) => {
  try {
    //Get the required fields from the request object body
    const { fullName, email, password, stack, role } = req.body;

    //Make sure all required fields are present
    if (!fullName || !email || !password || !stack || !role) {
      return res.status(400).json({
        message: 'Please provide all necessary information'
      })
    }

    //Check if the user already  exist in the database
    const checkEmail = await studentModel.findOne({ email: email.toLowerCase() })
    if (checkEmail) {
      return res.status(200).json({
        message: 'Email already exists'
      })
    }
    //Encrypt the user's password
    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(password, salt);

    //Use the role to determine an admin
    let admin;

    if (role === 'Teacher') {
      admin = true
    } else {
      admin = false
    }

    // Create a new user
    const user = new studentModel({
      fullName,
      email,
      stack,
      password: hashedPassword,
      isAdmin: admin,
      role,

    })

    //Make sure to save the user data to the database
    await user.save();
    return res.status(201).json({
      message: 'User saved successfully',
      data: user
    })

  } catch (err) {
    return res.status(500).json({
      Error: 'Internal Server Error' + err.message,
    })
  }

};


//Function to logIn a registered user
const logIn = async (req, res) => {
  try {
    // Get the user's login details 
    const { email, password } = req.body;

    //Make sure both fields are provided
    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide your email and password'
      })
    }

    //Check if the user already  exist in the database
    const checkEmail = await studentModel.findOne({ email: email.toLowerCase() })

    //Check if the user is not existing and return a response
    if (!checkEmail) {
      return res.status(404).json({
        message: 'User does not exist'
      })
    }

    //Verify the user's password
    const checkPassword = bcrypt.compareSync(password, checkEmail.password)
    if (!checkPassword) {
      return res.status(400).json({
        message: "Password is incorrect",
      })
    }

    //Generate a token for the user
    const token = jwt.sign({
      userId: checkEmail._id,
      email: checkEmail.email,
      isAdmin: checkEmail.isAdmin
    }, process.env.secret, { expiresIn: "1d" })
    return res.status(200).json({
      message: `Login Successful, welcome ${checkEmail.fullName}`,
      token: token
    });


  } catch (err) {
    return res.status(500).json({
      Error: 'Internal Server Error' + err.message,
    });
  }
};

//Get all user in the database
const getAll = async (req, res) => {
  try {
    // Retreive all the users data from the database
    const user = await studentModel.find().sort({ createdAt: -1 })
    if (user.length === 0) {
      return res.status(200).json({
        message: 'There are currently no users in the database'
      })
    }

    // Return a success message 
    if (req.user.isAdmin === true) {
      return res.status(200).json({
        message: `There are ${user.length} users in the database`,
        data: user
      })
    } else {
      return res.status(400).json({
        message: "Permission not allowed as you're not an Admin"
      })
    }
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error: " + err.message
    });
  }
};


//Function to Add a student score 
const addStudentScore = async (req, res) => {
  try {
    // Get the student's ID to be update score
    const id = req.params.id;

    //Get the score from the body
    const { html, node, javascript, css } = req.body.score;

    // Find the student with the ID 
    const student = await studentModel.findById(id);

    // Check if the student is not found
    if (!student) {
      return res.status(404).json({
        message: `Student with ID ${id} not found`
      })
    }

    // Update the student's score sheet 
    const data = {
      score: {
        html,
        node,
        javascript,
        css
      }
    }

    // To check if the user adding score is an admin and if the user been added score to is also an admin
    if (student.isAdmin === true) {
      return res.status(400).json({
        message: "A Teacher can't add score to another Teacher",
      })
    }

    //Update the database with the entered score
    const updatedStudent = await studentModel.findByIdAndUpdate(id, data, { new: true });

    // Return a response 
    return res.status(201).json({
      message: 'Score updated successfully',
      data: updatedStudent
    })
  } catch (err) {
    return res.status(500).json({
      Error: 'Internal Server Error: ' + err.message
    })
  }
}


// Functions to sign the user out
const signOut = async (req, res) => {
  try {
    const { userId } = req.user
    const hasAuthorization = req.headers.authorization;
    if (!hasAuthorization) {
      return res.status(400).json({
        message: 'Authorization token not found',
      })
    }
    const token = hasAuthorization.split(' ')[1];
    const user = await studentModel.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: 'Not authorization: user not found',
      })
    }
    // Blacklist the token
    user.blacklist.push(token);

    await user.save();
    return res.status(200).json({
      message: 'User logged out successfully',

    })


  } catch (err) {
    return res.status(500).json({
      message: 'Internal server error: ' + err.message
    })
  }
}


// Function to view a logged in student score
const viewStudentScore = async (req, res) => {
  try {
    // Retrieve the userId from the token logged in with
    const userId = req.user.userId;

    //Get the student data using the userId
    const user = await studentModel.findById(userId)

    //If the student is not found
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    // Return a success message and the student data
    return res.status(200).json({
      message: `Welcome ${user.fullName} here is your score: `,
      data: {
        score: {
          html: user.score.html,
          node: user.score.node,
          javascript: user.score.javascript,
          css: user.score.css
        },
        fullName: user.fullName,
        stack: user.stack,
        role: user.role,
      }
    })

  } catch (err) {
    return res.status(500).json({
      Error: 'Internal server error: ' + err.message,
    })
  }
}


module.exports = {
  signUp,
  logIn,
  getAll,
  addStudentScore,
  signOut,
  viewStudentScore,

}