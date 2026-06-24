

const express = require("express");
const router = express.Router();
const Student = require("../model/studentSchema");
const studentController = require("../controller/studController");

const studentAuthController = require("../controller/studentAuthController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

router.post("/students", studentController.addStudent);
router.get("/students", studentController.getAllStudents);
router.put("/students/:id/update", studentController.updateStudent);
router.delete("/students/:id/delete", studentController.deleteStudent);

router.post("/student/login", studentAuthController.studentLogin);

router.post("/student/profile", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image is required" });

    const updated = await Student.findByIdAndUpdate(req.body.id, {
      studentName: req.body.name,
      studentEmail: req.body.email,
      studentCourse: req.body.course,
      duration: req.body.duration,
      image: req.file.filename
    }, { new: true });

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

// -----------------------------------------------------------------------------------
router.get("/student/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



