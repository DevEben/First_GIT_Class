const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      stack: {
        type: String,
        required: true,
      },
      score: {
        html: {
            type: Number
        },
        javascript: {
            type: Number
        }, 
        css: {
            type: Number
        },
        node: {
            type: Number
        }
      }

    },
    { timestamps: true }
  );

const studentModel = mongoose.model("Students", studentSchema);

module.exports = studentModel;