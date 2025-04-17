const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// REGISTER
router.post("/register", async (req, res) => {
  const { name, password, role_id } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  await pool.execute(
    "INSERT INTO users (name, password, role_id) VALUES (?, ?, ?)",
    [name, hashed, role_id]
  );

  res.json({ message: "User registered" });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  const [users] = await pool.execute("SELECT * FROM users WHERE name = ?", [
    name,
  ]);

  if (users.length === 0)
    return res.status(404).json({ message: "User not found" });

  const user = users[0];

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) return res.status(401).json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: user.id, username: user.username },
    "your_jwt_secret",
    { expiresIn: "1m" }
  );

  res.json({ token });
});

// GET CURRENT USER + PERMISSIONS
router.get("/me", auth, async (req, res) => {
  const [permissions] = await pool.execute(
    `SELECT p.name FROM users u
     JOIN roles r ON u.role_id = r.id
     JOIN role_permissions rp ON r.id = rp.role_id
     JOIN permissions p ON rp.permission_id = p.id
     WHERE u.id = ?`,
    [req.user.id]
  );

  res.json({
    id: req.user.id,
    username: req.user.username,
    permissions: permissions.map((p) => p.name),
  });
});

module.exports = router;
