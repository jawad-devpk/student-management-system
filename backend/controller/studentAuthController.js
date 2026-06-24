
const Student = require("../model/studentSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.studentLogin = async (req, res) => {
  const { email, password } = req.body;
  const student = await Student.findOne({ studentEmail: email });
  if (!student) return res.status(401).json({ message: "Invalid Email" });

  const match = await bcrypt.compare(password, student.studentPassword);
  if (!match) return res.status(401).json({ message: "Invalid Password" });

  const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token, id: student._id });
};