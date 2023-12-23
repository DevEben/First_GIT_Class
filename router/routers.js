const express = require("express");

const router = express.Router();

const {signUp, logIn, getAll, addStudentScore, signOut, viewStudentScore, } = require("../controller/controller");
const { authenticate, admin, } = require("../middleware/authentication");

//endpoint to signUp a new user
router.post('/sign-up', signUp);

//endpoint to logIn a registered user
router.post('/login', logIn);

//endpoint to view registered users logged In as an Admin
router.get('/viewall', admin, getAll);

//endpoint to add score to the user data
router.put('/addscore/:id', admin, addStudentScore);

//endpoint to sigout a logged in user
router.post('/signout', authenticate, signOut)

//endpoint to view a logged in student score
router.get('/viewscore', authenticate, viewStudentScore)


module.exports = router;