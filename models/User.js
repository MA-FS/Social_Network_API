// Require Mongoose
const { Schema, model } = require("mongoose");

// Create new userSchema using Mongoose constructor

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Must match a valid email address!"],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought", // Array of _id values referencing the Thought model
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", // Array of _id values referencing the User model (self-reference)
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// Create a virtual called friendCount that retrieves the length of the user's friends array field on query.

userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

const User = model("User", userSchema);

module.exports = User;
