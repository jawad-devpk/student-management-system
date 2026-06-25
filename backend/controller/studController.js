
// const Student = require("../model/studentSchema");
// const bcrypt = require("bcrypt");
// const nodemailer = require("nodemailer");

// function generatePassword() {
//   return Math.random().toString(36).slice(-8);
// }

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// exports.addStudent = async (req, res) => {
//   try {
//     const { studentName, studentEmail, studentCourse } = req.body;

//     const plainPassword = generatePassword();
//     const hashedPassword = await bcrypt.hash(plainPassword, 10);

//     const student = await Student.create({
//       studentName,
//       studentEmail,
//       studentCourse,
//       studentPassword: hashedPassword
//     });

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: studentEmail,
//       subject: "Your Student Account Password",
//       text: `Hello ${studentName},\n\nEmail: ${studentEmail}\nPassword: ${plainPassword}\n\nPlease change it after login.`
//     });

//     res.status(201).json({ message: "Student created & password sent successfully" });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.getAllStudents = async (req, res) => {
//   const students = await Student.find();
//   res.json(students);
// };

// exports.updateStudent = async (req, res) => {
//   const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
//   res.json(updated);
// };

// exports.deleteStudent = async (req, res) => {
//   await Student.findByIdAndDelete(req.params.id);
//   res.json({ message: "Deleted" });
// };


const Student = require("../model/studentSchema");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

function generatePassword() {
  return Math.random().toString(36).slice(-8);
}

function createTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER or EMAIL_PASS is missing in environment variables");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

exports.addStudent = async (req, res) => {
  try {
    const {
      studentName,
      studentEmail,
      studentCourse,
      studentPassword,
    } = req.body;

    if (!studentName || !studentEmail || !studentCourse) {
      return res.status(400).json({
        success: false,
        message: "Student name, email, and course are required.",
      });
    }

    const existingStudent = await Student.findOne({ studentEmail });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student with this email already exists.",
      });
    }

    // Frontend se generated password aaye to wahi use hoga,
    // warna backend apna password generate karega.
    const plainPassword =
      studentPassword && studentPassword.trim()
        ? studentPassword.trim()
        : generatePassword();

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const student = await Student.create({
      studentName,
      studentEmail,
      studentCourse,
      studentPassword: hashedPassword,
    });

    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"Student Management System" <${process.env.EMAIL_USER}>`,
      to: studentEmail,
      subject: "Your Student Account Login Details",
      html: `
        <div style="font-family: Arial, sans-serif; background:#f4f7fb; padding:24px;">
          <div style="max-width:520px; margin:auto; background:#ffffff; border-radius:12px; padding:24px; border:1px solid #e5e7eb;">
            <h2 style="color:#0f172a; margin-bottom:10px;">Student Account Created</h2>
            <p style="color:#475569; font-size:15px;">
              Hello <strong>${studentName}</strong>, your student account has been created successfully.
            </p>

            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:16px; margin:20px 0;">
              <p style="margin:0 0 10px; color:#334155;"><strong>Email:</strong> ${studentEmail}</p>
              <p style="margin:0; color:#334155;"><strong>Password:</strong> ${plainPassword}</p>
            </div>

            <p style="color:#64748b; font-size:14px;">
              Please use this email and password to login to your student portal.
            </p>
          </div>
        </div>
      `,
      text: `Hello ${studentName},

Your student account has been created successfully.

Email: ${studentEmail}
Password: ${plainPassword}

Please use this email and password to login to your student portal.`,
    });

    return res.status(201).json({
      success: true,
      message: "Student created and password sent successfully.",
      student: {
        id: student._id,
        studentName: student.studentName,
        studentEmail: student.studentEmail,
        studentCourse: student.studentCourse,
      },
    });
  } catch (err) {
    console.log("Add student error:", err.message);

    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Student with this email already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message || "Server error. Please try again.",
    });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    return res.json(students);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    return res.json({
      success: true,
      message: "Student updated successfully.",
      student: updated,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    return res.json({
      success: true,
      message: "Student deleted successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};