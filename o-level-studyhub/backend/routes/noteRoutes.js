const express = require("express");
const Note = require("../models/Note");

const router = express.Router();

// GET all notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find()
      .populate("topic", "name")
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get notes",
      error: error.message,
    });
  }
});

// GET notes for a specific topic
router.get("/topic/:topicId", async (req, res) => {
  try {
    const notes = await Note.find({
      topic: req.params.topicId,
    }).sort({ createdAt: 1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get topic notes",
      error: error.message,
    });
  }
});

// POST a new note
router.post("/", async (req, res) => {
  try {
    const { title, topic, content } = req.body;

    const note = await Note.create({
      title,
      topic,
      content,
    });

    const savedNote = await note.populate("topic", "name");

    res.status(201).json(savedNote);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create note",
      error: error.message,
    });
  }
});

module.exports = router;