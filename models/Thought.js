// Require Mongoose & Moment
const { Schema, model } = require("mongoose");
const moment = require("moment");

const reactionSchema = require("./Reaction");

// Create new thoughtSchema using Mongoose constructor
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: "A thought is required",
      minlength: 1,
      maxlength: 280, // Must be between 1 and 280 characters
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => moment(timestamp).format("MMM Do, YYYY [at] hh:mm a"), // Use a getter method to format the timestamp on query using Moment
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema], // Array of nested documents created with the reactionSchema
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

// Create a virtual called reactionCount that retrieves the length of the thought's reactions array field on query.
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model("Thought", thoughtSchema);

module.exports = Thought;
