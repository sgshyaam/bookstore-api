const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter user name"],
    },
    email: {
      type: String,
      required: [true, "Please enter email address"],
      unique: [true, "Email id already taken"],
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
    },
    admin: {
        type: Boolean,
        default: false
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
