const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/socialmediaapi"
);

module.exports = mongoose.connection;
