const jwt = require("jsonwebtoken");
const pool = require("../db");

module.exports = async function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // Extract token from 'Bearer <token>'

  if (!token) {
    console.log("❌ No token provided");
    return res.sendStatus(401); // Unauthorized if no token
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret"); // Replace with your real secret
    console.log("✅ Token decoded:", decoded);

    const [userResult] = await pool.execute(
      "SELECT * FROM users WHERE id = ?",
      [decoded.id]
    );

    if (!userResult.length) {
      console.log("❌ User not found for token ID:", decoded.id);
      return res.sendStatus(401); // Unauthorized if user is not found
    }

    const user = userResult[0];

    // Assign user data and permissions
    const [permResult] = await pool.execute(
      `
      SELECT p.name FROM permissions p
      JOIN role_permissions rp ON rp.permission_id = p.id
      WHERE rp.role_id = ?
    `,
      [user.role_id]
    );

    user.permissions = permResult.map((p) => p.name);
    req.user = user;

    console.log("✅ User authenticated:", req.user.name);
    next(); // Proceed to the next middleware (route handler)
  } catch (err) {
    console.log("❌ Error verifying token:", err.message);
    res.sendStatus(403); // Forbidden if JWT is invalid or expired
  }
};
