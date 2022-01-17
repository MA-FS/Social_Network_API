// Require express router
const router = require("express").Router();

// Retrieve functions from thought-controller
const {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require("../../controllers/thought-controller");

// GET to get all thoughts
// POST to create a new thought
router.route("/").get(getThoughts).post(createThought);

// GET to get a single thought by its _id
// PUT to update a thought by its _id
// DELETE to remove a thought by its _id
router
  .route("/:thoughtId")
  .get(getSingleThought)
  .put(updateThought)
  .delete(deleteThought);

// POST to create a reaction stored in a single thought's reactions array field
router.route("/:thoughtId/reactions").post(addReaction);

// DELETE to pull and remove a reaction by the reaction's reactionId value
router.route("/:thoughtId/reactions/:reactionId").delete(removeReaction);

module.exports = router;
