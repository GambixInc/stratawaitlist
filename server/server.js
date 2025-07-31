const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const database = require("./database");

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [
            "http://localhost:5173",
            "http://localhost:8080",
            "https://yourdomain.com",
          ] // Update with your domain
        : [
            "http://localhost:3001",
            "http://localhost:5173",
            "http://localhost:8080",
            "http://localhost:4173",
          ],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Waitlist endpoints
app.post("/api/waitlist", async (req, res) => {
  try {
    const { first_name, last_name, email, referral_code } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !email) {
      return res.status(400).json({
        error: "Missing required fields: first_name, last_name, email",
      });
    }

    // Check if email already exists
    const existingUser = await database.getWaitlistEntryByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: "Email already registered",
        user: existingUser,
      });
    }

    // Check referral code if provided
    let referredBy = null;
    if (referral_code) {
      const referrer = await database.getWaitlistEntryByReferralLink(
        referral_code
      );
      if (referrer) {
        referredBy = referrer.id;

        // Update referrer's stats
        const newReferralCount = (referrer.referral_count || 0) + 1;
        const newPoints = (referrer.points || 0) + 10;

        await database.updateWaitlistEntry(referrer.id, {
          referral_count: newReferralCount,
          points: newPoints,
          last_referral_at: new Date().toISOString(),
        });
      }
    }

    // Create new waitlist entry
    const userData = {
      first_name,
      last_name,
      email,
      referred_by: referredBy,
    };

    const newEntry = await database.createWaitlistEntry(userData);

    res.status(201).json({
      message: "Successfully joined waitlist",
      user: newEntry,
    });
  } catch (error) {
    console.error("Error creating waitlist entry:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to join waitlist",
    });
  }
});

// Get waitlist entry by email
app.get("/api/waitlist/email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await database.getWaitlistEntryByEmail(email);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error getting waitlist entry:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Get waitlist entry by ID
app.get("/api/waitlist/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await database.getWaitlistEntryById(id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error getting waitlist entry:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Add this after the POST /api/waitlist endpoint in server.js
app.get("/api/waitlist", async (req, res) => {
  try {
    // Just return a status message since we don't need all entries
    res.json({
      message: "Waitlist endpoint available",
      status: "ok",
    });
  } catch (error) {
    console.error("Error getting waitlist:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Get leaderboard
app.get("/api/leaderboard", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = await database.getLeaderboard(limit);

    res.json({ leaderboard });
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Get referral rewards
app.get("/api/rewards", async (req, res) => {
  try {
    const rewards = await database.getReferralRewards();
    res.json({ rewards });
  } catch (error) {
    console.error("Error getting rewards:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Get user achievements
app.get("/api/users/:userId/achievements", async (req, res) => {
  try {
    const { userId } = req.params;
    const achievements = await database.getUserAchievements(userId);
    res.json({ achievements });
  } catch (error) {
    console.error("Error getting user achievements:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Create user achievement
app.post("/api/users/:userId/achievements", async (req, res) => {
  try {
    const { userId } = req.params;
    const { achievement_type, points_earned } = req.body;

    if (!achievement_type || !points_earned) {
      return res.status(400).json({
        error: "Missing required fields: achievement_type, points_earned",
      });
    }

    await database.createUserAchievement(
      userId,
      achievement_type,
      points_earned
    );

    res.status(201).json({
      message: "Achievement created successfully",
    });
  } catch (error) {
    console.error("Error creating achievement:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Update user stats
app.patch("/api/waitlist/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated
    delete updates.id;
    delete updates.created_at;
    delete updates.email;

    const updatedUser = await database.updateWaitlistEntry(id, updates);

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: "Something went wrong",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not found",
    message: "The requested endpoint does not exist",
  });
});

// Start server
async function startServer() {
  try {
    // Connect to database
    await database.connect();
    console.log("✅ Connected to SQLite database");

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down server...");
  try {
    await database.close();
    console.log("✅ Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Shutting down server...");
  try {
    await database.close();
    console.log("✅ Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
});

startServer();
