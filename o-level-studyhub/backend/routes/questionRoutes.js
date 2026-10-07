const express = require("express");
const mongoose = require("mongoose");
const Question = require("../models/Question");

const router = express.Router();

function handleError(res, message, error) {
  const status = error.name === "ValidationError" || error.name === "CastError" ? 400 : 500;

  res.status(status).json({
    message,
    error: error.message,
  });
}

// GET questions for a specific topic
router.get("/topic/:topicId", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.topicId)) {
    return res.status(400).json({ message: "Invalid topic ID" });
  }

  try {
    const questions = await Question.find({ topic: req.params.topicId })
      .populate("topic", "name")
      .sort({ createdAt: 1 });

    res.json(questions);
  } catch (error) {
    handleError(res, "Failed to get topic questions", error);
  }
});

// GET all questions
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("topic", "name")
      .sort({ createdAt: 1 });

    res.json(questions);
  } catch (error) {
    handleError(res, "Failed to get questions", error);
  }
});

// POST a new question
router.post("/", async (req, res) => {
  try {
    const question = await Question.create({
      topic: req.body.topic,
      question: req.body.question,
      options: req.body.options,
      correctAnswer: req.body.correctAnswer,
      explanation: req.body.explanation,
      difficulty: req.body.difficulty,
    });
    const savedQuestion = await question.populate("topic", "name");

    res.status(201).json(savedQuestion);
  } catch (error) {
    handleError(res, "Failed to create question", error);
  }
});

// GET a question by ID
router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid question ID" });
  }

  try {
    const question = await Question.findById(req.params.id).populate("topic", "name");

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(question);
  } catch (error) {
    handleError(res, "Failed to get question", error);
  }
});

// DELETE a question by ID
router.delete("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid question ID" });
  }

  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question deleted successfully", question });
  } catch (error) {
    handleError(res, "Failed to delete question", error);
  }
});

module.exports = router;