const express = require("express");
const Subject = require("../models/Subject");

const router = express.Router();

// GET all subjects
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });

    res.json(subjects);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get subjects",
      error: error.message,
    });
  }
});

// POST a new subject
router.post("/", async (req, res) => {
  try {
    const { name, code, level, description } = req.body;

    const subject = await Subject.create({
      name,
      code,
      level,
      description,
    });

    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create subject",
      error: error.message,
    });
  }
});

module.exports = router;