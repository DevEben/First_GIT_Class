const express = require("express");

const router = express.Router();

const {createStudent, getAll, getOne, updateStudent, deleteStudent} = require("../controller/controller");

router.post("/create", createStudent);

router.get("/all", getAll);

router.get("/one/:studentId", getOne);

router.put("/update/:studentId", updateStudent);

router.delete("/delete/:studentId", deleteStudent);

module.exports = router;