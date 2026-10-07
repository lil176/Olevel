const express = require("express");
const Topic = require("../models/Topic");

const router = express.Router();

// GET topics for a specific subject
router.get("/subject/:subjectId", async (req, res) => {
  try {
    const topics = await Topic.find({
      subject: req.params.subjectId,
    })
      .populate("subject", "name code")
      .sort({ name: 1 });

    res.json(topics);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get subject topics",
      error: error.message,
    });
  }
});

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

// DELETE a topic by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedTopic = await Topic.findByIdAndDelete(req.params.id);

    if (!deletedTopic) {
      return res.status(404).json({
        message: "Topic not found",
      });
    }

    res.json({
      message: "Topic deleted successfully",
      topic: deletedTopic,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete topic",
      error: error.message,
    });
  }
});

module.exports = router;