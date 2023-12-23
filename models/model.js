const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
      fullName: {
        type: String,
        required: true,
      },
      stack: {
        type: String,
        enum: ['Frontend', 'Backend'],
        required: true,
      },
      isAdmin: {
        type: Boolean,
      },
      email: {
          type: String,
          unique: true,
          required: true,
      },
      role: {
        type: String,
        enum: ['Teacher', 'Student'],
        required: true,
      }, 
      password: {
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
      }, 
      blacklist: {
        type: Array, 
        default: [],
      }

    },
    { timestamps: true }
  );

const studentModel = mongoose.model("Students", studentSchema);

module.exports = studentModel;