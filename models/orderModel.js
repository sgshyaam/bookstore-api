const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    username: {
      type: mongoose.Schema.Types.String,
      ref: "User",
    },
    books: [
      {
        book_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
        title: {
          type: mongoose.Schema.Types.String,
          ref: "Book",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    orderDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Ordered", "Shipped", "Delivered", "Cancelled"],
      default: "Ordered",
    },
    totalAmount: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
