import bcrypt from 'bcryptjs';
import { query } from '../db.js';

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '10');

export const hashPassword = async (password) => {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
};

export const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const createUser = async (email, passwordHash) => {
  const result = await query(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
    [email, passwordHash]
  );
  return result.rows[0];
};

export const getUserByEmail = async (email) => {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

export const getUserById = async (userId) => {
  const result = await query('SELECT id, email, created_at, updated_at FROM users WHERE id = $1', [userId]);
  return result.rows[0];
};

export const getUserProfile = async (userId) => {
  const result = await query(
    'SELECT * FROM user_profiles WHERE user_id = $1',
    [userId]
  );
  return result.rows[0];
};

export const createUserProfile = async (userId, role, industry, department) => {
  const result = await query(
    'INSERT INTO user_profiles (user_id, role, industry, department) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, role, industry, department]
  );
  return result.rows[0];
};

export const updateUserProfile = async (userId, role, industry, department) => {
  const result = await query(
    'UPDATE user_profiles SET role = $1, industry = $2, department = $3, updated_at = CURRENT_TIMESTAMP WHERE user_id = $4 RETURNING *',
    [role, industry, department, userId]
  );
  return result.rows[0];
};

export const getUserWithProfile = async (userId) => {
  const user = await getUserById(userId);
  if (!user) return null;

  const profile = await getUserProfile(userId);
  return {
    ...user,
    profile: profile || null
  };
};
