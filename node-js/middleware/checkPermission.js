const pool = require("../db");

const checkPermission = (permission) => {
  return async (req, res, next) => {
    const [rows] = await pool.execute(
      `SELECT p.name FROM users u
       JOIN roles r ON u.role_id = r.id
       JOIN role_permissions rp ON r.id = rp.role_id
       JOIN permissions p ON rp.permission_id = p.id
       WHERE u.id = ? AND p.name = ?`,
      [req.user.id, permission]
    );

    if (rows.length === 0) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};

module.exports = checkPermission;
