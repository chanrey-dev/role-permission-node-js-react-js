const express = require("express");
const router = express.Router();
const checkPermission = require("../middleware/checkPermission");

router.get("/", checkPermission("read_posts"), (req, res) => {
  res.json(["Post 1", "Post 2"]);
});

router.delete("/:id", checkPermission("delete_posts"), (req, res) => {
  res.send("Post deleted.");
});

module.exports = router;
