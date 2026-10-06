const express = require("express");
const Topic = require("../models/Topic");

const router = express.Router();

// GET all topics
router.get("/", async (req, res) => {
  try {
    const topics = await Topic.find()
      .populate("subject", "name code")
      .sort({ name: 1 });

    res.json(topics);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get topics",
      error: error.message,
    });
  }
});

// POST a new topic
router.post("/", async (req, res) => {
  try {
    const { name, subject, description } = req.body;

    const topic = await Topic.create({
      name,
      subject,
      description,
    });

    const savedTopic = await topic.populate("subject", "name code");

    res.status(201).json(savedTopic);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create topic",
      error: error.message,
    });
  }
});

module.exports = router;