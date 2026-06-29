import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ai_dashboard',
});

export const initDatabase = async () => {
  const client = await pool.connect();
  try {
    // Metrics table - stores current metrics
    await client.query(`
      CREATE TABLE IF NOT EXISTS metrics (
        id SERIAL PRIMARY KEY,
        metric_name VARCHAR(255) UNIQUE NOT NULL,
        metric_value DECIMAL(10, 2) NOT NULL,
        metric_unit VARCHAR(50),
        description TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by VARCHAR(255)
      );
    `);

    // Historical data table - tracks changes over time
    await client.query(`
      CREATE TABLE IF NOT EXISTS metric_history (
        id SERIAL PRIMARY KEY,
        metric_name VARCHAR(255) NOT NULL,
        metric_value DECIMAL(10, 2) NOT NULL,
        metric_unit VARCHAR(50),
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        source VARCHAR(100)
      );
    `);

    // Dashboard data table - stores aggregated dashboard metrics
    await client.query(`
      CREATE TABLE IF NOT EXISTS dashboard_data (
        id SERIAL PRIMARY KEY,
        data_key VARCHAR(255) UNIQUE NOT NULL,
        data_value JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Audit log - tracks all changes for compliance
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_log (
        id SERIAL PRIMARY KEY,
        action VARCHAR(255) NOT NULL,
        table_name VARCHAR(100),
        record_id INTEGER,
        old_value JSONB,
        new_value JSONB,
        user_id VARCHAR(255),
        ip_address VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Admin users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        role VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      );
    `);

    // Refresh schedules table
    await client.query(`
      CREATE TABLE IF NOT EXISTS refresh_schedules (
        id SERIAL PRIMARY KEY,
        data_source VARCHAR(255) NOT NULL,
        schedule_cron VARCHAR(100),
        last_run TIMESTAMP,
        next_run TIMESTAMP,
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // AI Learning Hub Tables
    // Users table for authentication
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // User profiles - stores role, industry, department preferences
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(100),
        industry VARCHAR(100),
        department VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Content library - prompts, tutorials, case studies
    await client.query(`
      CREATE TABLE IF NOT EXISTS content (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        roles JSONB,
        industries JSONB,
        difficulty VARCHAR(50),
        estimated_time VARCHAR(50),
        content JSONB NOT NULL,
        tags JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Saved/Favorite content for users
    await client.query(`
      CREATE TABLE IF NOT EXISTS saved_content (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content_id INTEGER NOT NULL REFERENCES content(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, content_id)
      );
    `);

    // Content history - tracks views and engagement
    await client.query(`
      CREATE TABLE IF NOT EXISTS content_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content_id INTEGER NOT NULL REFERENCES content(id) ON DELETE CASCADE,
        view_count INTEGER DEFAULT 0,
        last_viewed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, content_id)
      );
    `);

    // Notifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50),
        title VARCHAR(255),
        message TEXT,
        link VARCHAR(255),
        read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const query = (text, params) => {
  return pool.query(text, params);
};

export default pool;
