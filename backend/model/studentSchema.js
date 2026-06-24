
  const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentName: String,
  studentEmail: { type: String, unique: true },
  studentPassword: String,
  studentCourse: String,
  duration: String,
  image: String
});

module.exports = mongoose.model("Student", studentSchema);

