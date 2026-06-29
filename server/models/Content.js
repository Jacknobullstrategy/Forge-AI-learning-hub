import { query } from '../db.js';

export const createContent = async (type, title, description, roles, industries, difficulty, estimatedTime, content, tags) => {
  const result = await query(
    `INSERT INTO content (type, title, description, roles, industries, difficulty, estimated_time, content, tags)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [type, title, description, JSON.stringify(roles), JSON.stringify(industries), difficulty, estimatedTime, JSON.stringify(content), JSON.stringify(tags)]
  );
  return result.rows[0];
};

export const getContentById = async (id) => {
  const result = await query('SELECT * FROM content WHERE id = $1', [id]);
  if (result.rows[0]) {
    return parseContentRow(result.rows[0]);
  }
  return null;
};

export const listContent = async (filters = {}) => {
  let sql = 'SELECT * FROM content WHERE 1=1';
  const params = [];
  let paramCount = 1;

  if (filters.type) {
    sql += ` AND type = $${paramCount}`;
    params.push(filters.type);
    paramCount++;
  }

  if (filters.difficulty) {
    sql += ` AND difficulty = $${paramCount}`;
    params.push(filters.difficulty);
    paramCount++;
  }

  if (filters.role) {
    sql += ` AND roles @> $${paramCount}`;
    params.push(JSON.stringify([filters.role]));
    paramCount++;
  }

  if (filters.industry) {
    sql += ` AND industries @> $${paramCount}`;
    params.push(JSON.stringify([filters.industry]));
    paramCount++;
  }

  sql += ' ORDER BY created_at DESC';

  const result = await query(sql, params);
  return result.rows.map(parseContentRow);
};

export const searchContent = async (query_text) => {
  const result = await query(
    `SELECT * FROM content
     WHERE title ILIKE $1 OR description ILIKE $1
     ORDER BY created_at DESC`,
    [`%${query_text}%`]
  );
  return result.rows.map(parseContentRow);
};

export const updateContent = async (id, title, description, roles, industries, difficulty, estimatedTime, content, tags) => {
  const result = await query(
    `UPDATE content
     SET title = $1, description = $2, roles = $3, industries = $4, difficulty = $5,
         estimated_time = $6, content = $7, tags = $8, updated_at = CURRENT_TIMESTAMP
     WHERE id = $9
     RETURNING *`,
    [title, description, JSON.stringify(roles), JSON.stringify(industries), difficulty, estimatedTime, JSON.stringify(content), JSON.stringify(tags), id]
  );
  return result.rows[0] ? parseContentRow(result.rows[0]) : null;
};

export const deleteContent = async (id) => {
  const result = await query('DELETE FROM content WHERE id = $1 RETURNING id', [id]);
  return result.rows.length > 0;
};

export const addToSaved = async (userId, contentId) => {
  try {
    const result = await query(
      'INSERT INTO saved_content (user_id, content_id) VALUES ($1, $2) RETURNING *',
      [userId, contentId]
    );
    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') { // Unique constraint violation
      return null; // Already saved
    }
    throw error;
  }
};

export const removeFromSaved = async (userId, contentId) => {
  const result = await query(
    'DELETE FROM saved_content WHERE user_id = $1 AND content_id = $2 RETURNING *',
    [userId, contentId]
  );
  return result.rows.length > 0;
};

export const getSavedContent = async (userId) => {
  const result = await query(
    `SELECT c.* FROM content c
     INNER JOIN saved_content sc ON c.id = sc.content_id
     WHERE sc.user_id = $1
     ORDER BY sc.created_at DESC`,
    [userId]
  );
  return result.rows.map(parseContentRow);
};

export const isSaved = async (userId, contentId) => {
  const result = await query(
    'SELECT id FROM saved_content WHERE user_id = $1 AND content_id = $2',
    [userId, contentId]
  );
  return result.rows.length > 0;
};

export const trackContentView = async (userId, contentId) => {
  const result = await query(
    `INSERT INTO content_history (user_id, content_id, view_count, last_viewed)
     VALUES ($1, $2, 1, CURRENT_TIMESTAMP)
     ON CONFLICT (user_id, content_id)
     DO UPDATE SET view_count = view_count + 1, last_viewed = CURRENT_TIMESTAMP
     RETURNING *`,
    [userId, contentId]
  );
  return result.rows[0];
};

// Helper function to parse JSONB fields
function parseContentRow(row) {
  return {
    ...row,
    roles: typeof row.roles === 'string' ? JSON.parse(row.roles) : row.roles,
    industries: typeof row.industries === 'string' ? JSON.parse(row.industries) : row.industries,
    content: typeof row.content === 'string' ? JSON.parse(row.content) : row.content,
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
  };
}
