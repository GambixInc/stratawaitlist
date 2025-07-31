const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Database file path
const dbPath = path.join(__dirname, 'waitlist.db');

class Database {
  constructor() {
    this.db = null;
  }

  // Initialize database connection
  connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err);
          reject(err);
        } else {
          console.log('Connected to SQLite database');
          resolve();
        }
      });
    });
  }

  // Close database connection
  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error('Error closing database:', err);
            reject(err);
          } else {
            console.log('Database connection closed');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  // Generic query method
  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.error('Database query error:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Generic run method for INSERT, UPDATE, DELETE
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          console.error('Database run error:', err);
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  // Get single row
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          console.error('Database get error:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Waitlist operations
  async createWaitlistEntry(userData) {
    const id = uuidv4();
    const referralLink = `ref_${id.substring(0, 8)}`;
    
    const sql = `
      INSERT INTO waitlist (id, first_name, last_name, email, referral_link, referred_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      id,
      userData.first_name,
      userData.last_name,
      userData.email,
      referralLink,
      userData.referred_by || null
    ];

    await this.run(sql, params);
    
    // Return the created entry
    return this.getWaitlistEntryById(id);
  }

  async getWaitlistEntryByEmail(email) {
    const sql = 'SELECT * FROM waitlist WHERE email = ?';
    return this.get(sql, [email]);
  }

  async getWaitlistEntryById(id) {
    const sql = 'SELECT * FROM waitlist WHERE id = ?';
    return this.get(sql, [id]);
  }

  async getWaitlistEntryByReferralLink(referralLink) {
    const sql = 'SELECT * FROM waitlist WHERE referral_link = ?';
    return this.get(sql, [referralLink]);
  }

  async updateWaitlistEntry(id, updates) {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);
    
    const sql = `UPDATE waitlist SET ${fields} WHERE id = ?`;
    await this.run(sql, values);
    
    return this.getWaitlistEntryById(id);
  }

  async getLeaderboard(limit = 10) {
    const sql = `
      SELECT id, first_name, last_name, referral_count, created_at, tier_level, points
      FROM waitlist
      ORDER BY points DESC, referral_count DESC
      LIMIT ?
    `;
    return this.query(sql, [limit]);
  }

  async getReferralRewards() {
    const sql = 'SELECT * FROM referral_rewards ORDER BY points_required ASC';
    return this.query(sql);
  }

  async createUserAchievement(userId, achievementType, pointsEarned) {
    const id = uuidv4();
    const sql = `
      INSERT INTO user_achievements (id, user_id, achievement_type, points_earned)
      VALUES (?, ?, ?, ?)
    `;
    return this.run(sql, [id, userId, achievementType, pointsEarned]);
  }

  async getUserAchievements(userId) {
    const sql = 'SELECT * FROM user_achievements WHERE user_id = ? ORDER BY created_at DESC';
    return this.query(sql, [userId]);
  }
}

// Create and export a singleton instance
const database = new Database();

module.exports = database; 