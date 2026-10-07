const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (options) => options.length >= 2,
        message: "A question must have at least two options.",
      },
    },
    correctAnswer: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (answer) {
          return this.options.includes(answer);
        },
        message: "The correct answer must match one of the options.",
      },
    },
    explanation: {
      type: String,
      default: "",
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);