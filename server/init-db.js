const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Database file path - this will be in the same directory as the server
const dbPath = path.join(__dirname, "waitlist.db");

// Create/connect to database
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create waitlist table
      db.run(
        `
        CREATE TABLE IF NOT EXISTS waitlist (
          id TEXT PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          referral_count INTEGER DEFAULT 0,
          points INTEGER DEFAULT 0,
          tier_level INTEGER DEFAULT 1,
          referral_link TEXT UNIQUE,
          referred_by TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_referral_at DATETIME,
          FOREIGN KEY (referred_by) REFERENCES waitlist (id)
        )
      `,
        (err) => {
          if (err) {
            console.error("Error creating waitlist table:", err);
            reject(err);
            return;
          }
          console.log("✅ Waitlist table created successfully");
        }
      );

      // Create profiles table (for user authentication if needed)
      db.run(
        `
        CREATE TABLE IF NOT EXISTS profiles (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          first_name TEXT,
          last_name TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `,
        (err) => {
          if (err) {
            console.error("Error creating profiles table:", err);
            reject(err);
            return;
          }
          console.log("✅ Profiles table created successfully");
        }
      );

      // Create referral_rewards table
      db.run(
        `
        CREATE TABLE IF NOT EXISTS referral_rewards (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          points_required INTEGER NOT NULL,
          reward_type TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `,
        (err) => {
          if (err) {
            console.error("Error creating referral_rewards table:", err);
            reject(err);
            return;
          }
          console.log("✅ Referral rewards table created successfully");
        }
      );

      // Create user_achievements table
      db.run(
        `
        CREATE TABLE IF NOT EXISTS user_achievements (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          achievement_type TEXT NOT NULL,
          points_earned INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES waitlist (id)
        )
      `,
        (err) => {
          if (err) {
            console.error("Error creating user_achievements table:", err);
            reject(err);
            return;
          }
          console.log("✅ User achievements table created successfully");
        }
      );

      // Insert some default referral rewards
      db.run(
        `
        INSERT OR IGNORE INTO referral_rewards (id, name, description, points_required, reward_type) VALUES
        ('reward-1', 'Early Access', 'Get early access to the platform', 50, 'access'),
        ('reward-2', 'Premium Features', 'Unlock premium features', 100, 'features'),
        ('reward-3', 'VIP Status', 'Exclusive VIP status and benefits', 200, 'status')
      `,
        (err) => {
          if (err) {
            console.error("Error inserting default rewards:", err);
            reject(err);
            return;
          }
          console.log("✅ Default referral rewards inserted successfully");
        }
      );

      db.close((err) => {
        if (err) {
          console.error("Error closing database:", err);
          reject(err);
          return;
        }
        console.log("✅ Database initialization completed successfully");
        console.log(`📁 Database file created at: ${dbPath}`);
        resolve();
      });
    });
  });
};

// Run initialization
initDatabase()
  .then(() => {
    console.log("🎉 Database setup complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Database setup failed:", error);
    process.exit(1);
  });
