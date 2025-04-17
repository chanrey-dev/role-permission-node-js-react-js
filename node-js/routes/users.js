const express = require("express");
const router = express.Router();
const pool = require("../db");
const checkPermission = require("../middleware/permission");

// Get all users (requires read_users permission)
router.get("/", checkPermission("view_users"), async (req, res) => {
  const [users] = await pool.execute(
    `SELECT u.id, u.name, u.role_id, r.name AS role
     FROM users u
     JOIN roles r ON u.role_id = r.id`
  );
  res.json(users);
});

// Delete user (requires delete_users permission)
router.delete("/:id", checkPermission("delete_users"), async (req, res) => {
  const { id } = req.params;
  await pool.execute("DELETE FROM users WHERE id = ?", [id]);
  res.json({ message: "User deleted" });
});

// Update user (requires edit_users permission)
router.put("/:id", checkPermission("update_users"), async (req, res) => {
  const { id } = req.params;
  const { name, role_id } = req.body;

  await pool.execute("UPDATE users SET name = ?, role_id = ? WHERE id = ?", [
    name,
    role_id,
    id,
  ]);

  res.json({ message: "User updated" });
});

module.exports = router;
