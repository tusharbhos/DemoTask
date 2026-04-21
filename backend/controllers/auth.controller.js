const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { success, error } = require('../utils/responseHelper');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const [rows] = await db.query(
      'SELECT id, name, email, password FROM admins WHERE email = ?',
      [email.toLowerCase()]
    );

    if (rows.length === 0) {
      return error(res, 'Invalid email or password', 401);
    }

    const admin = rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return error(res, 'Invalid email or password', 401);
    }

    // Sign JWT
    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    return success(res, {
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email },
    }, 'Login successful');
  } catch (err) {
    console.error('Login error:', err);
    return error(res, 'Server error during login');
  }
};

exports.getMe = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, created_at FROM admins WHERE id = ?',
      [req.admin.id]
    );
    if (rows.length === 0) return error(res, 'Admin not found', 404);
    return success(res, { admin: rows[0] });
  } catch (err) {
    console.error('GetMe error:', err);
    return error(res, 'Server error');
  }
};
