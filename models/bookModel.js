const mongoose = require("mongoose");

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter the book title"],
    },
    author: {
      type: String,
      required: [true, "Please enter the book author"],
    },
    description: {
      type: String,
      required: [true, "Please enter the book description"],
    },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", bookSchema);
