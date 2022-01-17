const { Thought, User } = require("../models");

const thoughtController = {
  // GET to get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .sort({ createdAt: -1 })
      .then((dbThoughtData) => {
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // GET to get a single thought by its _id
  getSingleThought(req, res) {
    const id = req.params.thoughtId;
    // Ensure string is a valid ObjectID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ message: "No user with this ID exists." });
    } else
      Thought.findOne({ _id: id })
        .then((dbThoughtData) => {
          if (!dbThoughtData) {
            return res
              .status(404)
              .json({ message: "No thought with this ID exists." });
          }
          res.json(dbThoughtData);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
  },

  // POST to create a new thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((dbThoughtData) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: dbThoughtData._id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({
            message:
              "Thought has been created but no user with this ID exists.",
          });
        }

        res.json({ message: "Thought has been created!" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // PUT to update a thought by its _id
  updateThought(req, res) {
    const id = req.params.thoughtId;
    // Ensure string is a valid ObjectID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ message: "No user with this ID exists." });
    } else
      Thought.findOneAndUpdate(
        { _id: id },
        { $set: req.body },
        { runValidators: true, new: true }
      )
        .then((dbThoughtData) => {
          if (!dbThoughtData) {
            return res
              .status(404)
              .json({ message: "No thought with this ID exists." });
          }
          res.json(dbThoughtData);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
  },

  // DELETE to pull and remove a reaction by the reaction's reactionId value
  deleteThought(req, res) {
    const id = req.params.thoughtId;
    // Ensure string is a valid ObjectID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ message: "No user with this ID exists." });
    } else
      Thought.findOneAndRemove({ _id: id })
        .then((dbThoughtData) => {
          if (!dbThoughtData) {
            return res
              .status(404)
              .json({ message: "No thought with this ID exists." });
          }

          // Remove Thought ID
          return User.findOneAndUpdate(
            { thoughts: id },
            { $pull: { thoughts: id } },
            { new: true }
          );
        })
        .then((dbUserData) => {
          if (!dbUserData) {
            return res.status(404).json({
              message:
                "Thought has been created but no user with this ID exists.",
            });
          }
          res.json({ message: "Thought has been deleted!" });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
  },

  // Add a reaction to a Thought
  addReaction(req, res) {
    const id = req.params.thoughtId;
    // Ensure string is a valid ObjectID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ message: "No user with this ID exists." });
    } else
      Thought.findOneAndUpdate(
        { _id: id },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      )
        .then((dbThoughtData) => {
          if (!dbThoughtData) {
            return res
              .status(404)
              .json({ message: "No user with this ID exists." });
          }
          res.json(dbThoughtData);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
  },

  // Remove reaction from a Thought
  removeReaction(req, res) {
    const id = req.params.thoughtId;
    // Ensure string is a valid ObjectID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ message: "No user with this ID exists." });
    } else
      Thought.findOneAndUpdate(
        { _id: id },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      )
        .then((dbThoughtData) => {
          if (!dbThoughtData) {
            return res
              .status(404)
              .json({ message: "No thought with this ID exists." });
          }
          res.json(dbThoughtData);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
  },
};

module.exports = thoughtController;
