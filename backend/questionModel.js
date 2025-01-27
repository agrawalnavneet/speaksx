const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  blocks: [
    {
      text: String,
      showInOption: Boolean,
      isAnswer: Boolean,
    },
  ],
  options: [
    {
      text: String,
      isCorrectAnswer: Boolean,
    },
  ],
  siblingId: mongoose.Types.ObjectId,
  solution: String,
});

module.exports = mongoose.model("Question", questionSchema);
