const db = require('../config/db');
const { success, error } = require('../utils/responseHelper');

// GET /api/cities?search=&state_id=&page=1&limit=10&status=
exports.getCities = async (req, res) => {
  try {
    const search   = req.query.search?.trim() || '';
    const page     = Math.max(1, parseInt(req.query.page)  || 1);
    const limit    = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const stateId  = req.query.state_id ? parseInt(req.query.state_id) : null;
    const status   = req.query.status || '';
    const offset   = (page - 1) * limit;

    const searchParam = `%${search}%`;
    const statusParam = status || null;

    const countParams = [searchParam, stateId, stateId, statusParam, statusParam];
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total
       FROM cities c
       JOIN states s ON s.id = c.state_id
       WHERE c.city_name LIKE ?
         AND (? IS NULL OR c.state_id = ?)
         AND (? IS NULL OR c.status = ?)`,
      countParams
    );

    const [rows] = await db.query(
      `SELECT c.id, c.city_name, c.status, c.created_at,
              c.state_id, s.state_name
       FROM cities c
       JOIN states s ON s.id = c.state_id
       WHERE c.city_name LIKE ?
         AND (? IS NULL OR c.state_id = ?)
         AND (? IS NULL OR c.status = ?)
       ORDER BY c.created_at DESC
       LIMIT ? OFFSET ?`,
      [...countParams, limit, offset]
    );

    return success(res, {
      data: rows,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('getCities error:', err);
    return error(res, 'Failed to fetch cities');
  }
};

// GET /api/cities/:id
exports.getCityById = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.id, c.city_name, c.status, c.created_at, c.state_id, s.state_name
       FROM cities c JOIN states s ON s.id = c.state_id
       WHERE c.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return error(res, 'City not found', 404);
    return success(res, { data: rows[0] });
  } catch (err) {
    console.error('getCityById error:', err);
    return error(res, 'Failed to fetch city');
  }
};

// POST /api/cities
exports.createCity = async (req, res) => {
  try {
    const { state_id, city_name, status } = req.body;

    // Validate state exists and is Active
    const [stateRows] = await db.query(
      "SELECT id FROM states WHERE id = ? AND status = 'Active'", [state_id]
    );
    if (stateRows.length === 0) {
      return error(res, 'Validation failed', 422, { state_id: 'Selected state is invalid or inactive' });
    }

    // Unique city name per state
    const [dup] = await db.query(
      'SELECT id FROM cities WHERE state_id = ? AND city_name = ?',
      [state_id, city_name.trim()]
    );
    if (dup.length > 0) {
      return error(res, 'Validation failed', 422, { city_name: 'City name already exists in this state' });
    }

    const [result] = await db.query(
      'INSERT INTO cities (state_id, city_name, status) VALUES (?, ?, ?)',
      [state_id, city_name.trim(), status]
    );

    const [newCity] = await db.query(
      `SELECT c.*, s.state_name FROM cities c JOIN states s ON s.id = c.state_id WHERE c.id = ?`,
      [result.insertId]
    );
    return success(res, { data: newCity[0] }, 'City created successfully', 201);
  } catch (err) {
    console.error('createCity error:', err);
    return error(res, 'Failed to create city');
  }
};

// PUT /api/cities/:id
exports.updateCity = async (req, res) => {
  try {
    const { id } = req.params;
    const { state_id, city_name, status } = req.body;

    const [existing] = await db.query('SELECT id FROM cities WHERE id = ?', [id]);
    if (existing.length === 0) return error(res, 'City not found', 404);

    // Validate state exists and is Active
    const [stateRows] = await db.query(
      "SELECT id FROM states WHERE id = ? AND status = 'Active'", [state_id]
    );
    if (stateRows.length === 0) {
      return error(res, 'Validation failed', 422, { state_id: 'Selected state is invalid or inactive' });
    }

    // Unique city name per state (exclude self)
    const [dup] = await db.query(
      'SELECT id FROM cities WHERE state_id = ? AND city_name = ? AND id != ?',
      [state_id, city_name.trim(), id]
    );
    if (dup.length > 0) {
      return error(res, 'Validation failed', 422, { city_name: 'City name already exists in this state' });
    }

    await db.query(
      'UPDATE cities SET state_id = ?, city_name = ?, status = ? WHERE id = ?',
      [state_id, city_name.trim(), status, id]
    );

    const [updated] = await db.query(
      `SELECT c.*, s.state_name FROM cities c JOIN states s ON s.id = c.state_id WHERE c.id = ?`,
      [id]
    );
    return success(res, { data: updated[0] }, 'City updated successfully');
  } catch (err) {
    console.error('updateCity error:', err);
    return error(res, 'Failed to update city');
  }
};

// DELETE /api/cities/:id
exports.deleteCity = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await db.query('SELECT id FROM cities WHERE id = ?', [id]);
    if (existing.length === 0) return error(res, 'City not found', 404);

    await db.query('DELETE FROM cities WHERE id = ?', [id]);
    return success(res, {}, 'City deleted successfully');
  } catch (err) {
    console.error('deleteCity error:', err);
    return error(res, 'Failed to delete city');
  }
};
