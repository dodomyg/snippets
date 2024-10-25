const mongoose = require("mongoose");

const CodeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    pl: {
      type: String,
      required: true,
      enum: [
        "C",
        "C++",
        "Java",
        "Python",
        "Go",
        "Dart",
        "Javascript",
      ],
    },
    code: { type: String, required: true },
    desc: { type: String },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Code", CodeSchema);
