// Require express router
const router = require("express").Router();

// Retrieve functions from user-controller
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require("../../controllers/user-controller");

// GET all users
// POST a new user
router.route("/").get(getUsers).post(createUser);

// GET a single user by its _id and populated thought and friend data
// PUT to update a user by its _id
// DELETE to remove user by its _id
router.route("/:userId").get(getSingleUser).put(updateUser).delete(deleteUser);

// POST to add a new friend to a user's friend list
// DELETE to remove a friend from a user's friend list
router.route("/:userId/friends/:friendId").post(addFriend).delete(removeFriend);

module.exports = router;
