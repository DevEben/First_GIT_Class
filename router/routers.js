const express = require("express");

const router = express.Router();

const {createStudent, getAll} = require("../controller/controller");

router.post("/create", createStudent);

router.get("/all", getAll);

module.exports = router;