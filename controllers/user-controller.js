const { User, Thought } = require("../models");

const userController = {
  // GET all users
  getUsers(req, res) {
    User.find()
      .select("-__v")
      .then((dbUserData) => {
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // GET a single user by its _id and populated thought and friend data
  getSingleUser(req, res) {
    const id = req.params.userId;
    // Ensure string is a valid ObjectID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ message: "No user with this ID exists." });
    } else
      User.findOne({ _id: id })
        .select("-__v")
        .populate("friends")
        .populate("thoughts")
        .then((dbUserData) => {
          if (!dbUserData) {
            return res
              .status(404)
              .json({ message: "No user with this ID exists." });
          }
          res.json(dbUserData);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
  },

  // POST a new user:
  createUser(req, res) {
    User.create(req.body)
      .then((dbUserData) => {
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // PUT to update a user by its _id
  updateUser(req, res) {
    const id = req.params.userId;
    // Ensure string is a valid ObjectID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ message: "No user with this ID exists." });
    } else
      User.findOneAndUpdate(
        { _id: id },
        {
          $set: req.body,
        },
        {
          runValidators: true,
          new: true,
        }
      )
        .then((dbUserData) => {
          if (!dbUserData) {
            return res
              .status(404)
              .json({ message: "No user with this ID exists." });
          }
          res.json(dbUserData);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
  },

  // DELETE to remove user by its _id
  deleteUser(req, res) {
    const id = req.params.userId;
    // Ensure string is a valid ObjectID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ message: "No user with this ID exists." });
    } else
      User.findOneAndDelete({ _id: id })
        .then((dbUserData) => {
          if (!dbUserData) {
            return res
              .status(404)
              .json({ message: "No user with this ID exists." });
          }

          // BONUS: Remove a user's associated thoughts when deleted.
          return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
        })
        .then(() => {
          res.json({ message: "User and thoughts deleted!" });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
  },

  // POST to add a new friend to a user's friend list
  addFriend(req, res) {
    const id = req.params.userId;
    // Ensure string is a valid ObjectID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ message: "No user with this ID exists." });
    } else
      User.findOneAndUpdate(
        { _id: id },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      )
        .then((dbUserData) => {
          if (!dbUserData) {
            return res
              .status(404)
              .json({ message: "No user with this ID exists." });
          }
          res.json(dbUserData);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
  },

  // DELETE to remove a friend from a user's friend list
  removeFriend(req, res) {
    const id = req.params.userId;
    // Ensure string is a valid ObjectID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ message: "No user with this ID exists." });
    } else
      User.findOneAndUpdate(
        { _id: id },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      )
        .then((dbUserData) => {
          if (!dbUserData) {
            return res
              .status(404)
              .json({ message: "No user with this ID exists." });
          }
          res.json(dbUserData);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
  },
};

module.exports = userController;
