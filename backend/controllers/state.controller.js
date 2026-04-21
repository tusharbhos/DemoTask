const db = require('../config/db');
const { success, error } = require('../utils/responseHelper');

// GET /api/states?search=&page=1&limit=10&status=
exports.getStates = async (req, res) => {
  try {
    const search = req.query.search?.trim() || '';
    const page   = Math.max(1, parseInt(req.query.page)  || 1);
    const limit  = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const status = req.query.status || '';
    const offset = (page - 1) * limit;

    const searchParam = `%${search}%`;
    const statusParam = status || null;

    const baseWhere = 'WHERE s.state_name LIKE ? AND (? IS NULL OR s.status = ?)';
    const params    = [searchParam, statusParam, statusParam];

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM states s ${baseWhere}`,
      params
    );

    const [rows] = await db.query(
      `SELECT s.id, s.state_name, s.status, s.created_at,
              COUNT(c.id) AS city_count
       FROM states s
       LEFT JOIN cities c ON c.state_id = s.id
       ${baseWhere}
       GROUP BY s.id
       ORDER BY s.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return success(res, {
      data: rows,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('getStates error:', err);
    return error(res, 'Failed to fetch states');
  }
};

// GET /api/states/all-active  (for dropdowns)
exports.getAllActiveStates = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, state_name FROM states WHERE status = 'Active' ORDER BY state_name ASC"
    );
    return success(res, { data: rows });
  } catch (err) {
    console.error('getAllActiveStates error:', err);
    return error(res, 'Failed to fetch active states');
  }
};

// GET /api/states/:id
exports.getStateById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, state_name, status, created_at FROM states WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return error(res, 'State not found', 404);
    return success(res, { data: rows[0] });
  } catch (err) {
    console.error('getStateById error:', err);
    return error(res, 'Failed to fetch state');
  }
};

// POST /api/states
exports.createState = async (req, res) => {
  try {
    const { state_name, status } = req.body;

    // Unique check
    const [existing] = await db.query(
      'SELECT id FROM states WHERE state_name = ?',
      [state_name.trim()]
    );
    if (existing.length > 0) {
      return error(res, 'Validation failed', 422, { state_name: 'State name already exists' });
    }

    const [result] = await db.query(
      'INSERT INTO states (state_name, status) VALUES (?, ?)',
      [state_name.trim(), status]
    );

    const [newState] = await db.query('SELECT * FROM states WHERE id = ?', [result.insertId]);
    return success(res, { data: newState[0] }, 'State created successfully', 201);
  } catch (err) {
    console.error('createState error:', err);
    return error(res, 'Failed to create state');
  }
};

// PUT /api/states/:id
exports.updateState = async (req, res) => {
  try {
    const { id } = req.params;
    const { state_name, status } = req.body;

    const [existing] = await db.query('SELECT id FROM states WHERE id = ?', [id]);
    if (existing.length === 0) return error(res, 'State not found', 404);

    // Unique check (exclude self)
    const [dup] = await db.query(
      'SELECT id FROM states WHERE state_name = ? AND id != ?',
      [state_name.trim(), id]
    );
    if (dup.length > 0) {
      return error(res, 'Validation failed', 422, { state_name: 'State name already exists' });
    }

    await db.query(
      'UPDATE states SET state_name = ?, status = ? WHERE id = ?',
      [state_name.trim(), status, id]
    );

    const [updated] = await db.query('SELECT * FROM states WHERE id = ?', [id]);
    return success(res, { data: updated[0] }, 'State updated successfully');
  } catch (err) {
    console.error('updateState error:', err);
    return error(res, 'Failed to update state');
  }
};

// DELETE /api/states/:id
exports.deleteState = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query('SELECT id FROM states WHERE id = ?', [id]);
    if (existing.length === 0) return error(res, 'State not found', 404);

    // Guard: check for associated cities
    const [[{ cnt }]] = await db.query(
      'SELECT COUNT(*) AS cnt FROM cities WHERE state_id = ?', [id]
    );
    if (cnt > 0) {
      return error(res, 'Cannot delete state with existing cities. Remove cities first.', 422);
    }

    await db.query('DELETE FROM states WHERE id = ?', [id]);
    return success(res, {}, 'State deleted successfully');
  } catch (err) {
    console.error('deleteState error:', err);
    return error(res, 'Failed to delete state');
  }
};
