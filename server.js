require("dotenv").config();

const express = require("express");
const path = require("path");

const connectDB = require("./backend/config/db");
const teacherRoutes = require("./backend/routes/teacherRouter");
const studentRoutes = require("./backend/routes/studentRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", teacherRoutes);
app.use("/api", studentRoutes);

const PORT = process.env.PORT || 4000;

async function startServer() {
  await connectDB();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();