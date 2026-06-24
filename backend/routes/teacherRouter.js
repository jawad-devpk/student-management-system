
const express = require("express");
const teacherController = require("../controller/teacherController");
const router = express.Router();

router.get("/", (req, res) => res.sendFile("signup.html", { root: "public" }));
router.get("/signup", (req, res) => res.sendFile("signup.html", { root: "public" }));
router.get("/login", (req, res) => res.sendFile("login.html", { root: "public" }));
router.get("/dashboard", (req, res) => res.sendFile("dashboard.html", { root: "public" }));

router.post("/signup", teacherController.signup);
router.post("/login", teacherController.login);

module.exports = router;