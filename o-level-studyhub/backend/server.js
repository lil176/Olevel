const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const subjectRoutes = require("./routes/subjectRoutes");
const topicRoutes = require("./routes/topicRoutes");
const noteRoutes = require("./routes/noteRoutes");
const questionRoutes = require("./routes/questionRoutes");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/subjects", subjectRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/questions", questionRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "O-Level StudyHub backend is running!",
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });