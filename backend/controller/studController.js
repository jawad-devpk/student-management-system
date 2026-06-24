
const Student = require("../model/studentSchema");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

function generatePassword() {
  return Math.random().toString(36).slice(-8);
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.addStudent = async (req, res) => {
  try {
    const { studentName, studentEmail, studentCourse } = req.body;

    const plainPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const student = await Student.create({
      studentName,
      studentEmail,
      studentCourse,
      studentPassword: hashedPassword
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: studentEmail,
      subject: "Your Student Account Password",
      text: `Hello ${studentName},\n\nEmail: ${studentEmail}\nPassword: ${plainPassword}\n\nPlease change it after login.`
    });

    res.status(201).json({ message: "Student created & password sent successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllStudents = async (req, res) => {
  const students = await Student.find();
  res.json(students);
};

exports.updateStudent = async (req, res) => {
  const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteStudent = async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
            