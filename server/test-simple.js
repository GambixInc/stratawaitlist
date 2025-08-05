// Load environment variables
require('dotenv').config();

const mailerLite = require("./mailerlite");

console.log("🔍 Environment Check:");
console.log(
  "MAILERLITE_API_KEY:",
  process.env.MAILERLITE_API_KEY ? "✅ Set" : "❌ Not set"
);
console.log(
  "MAILERLITE_GROUP_ID:",
  process.env.MAILERLITE_GROUP_ID ? "✅ Set" : "❌ Not set"
);
console.log("");

async function testConnection() {
  console.log("🧪 Testing MailerLite Connection...");

  try {
    const result = await mailerLite.testConnection();

    if (result.success) {
      console.log("✅ MailerLite connection successful!");
      console.log("Account connected successfully");
    } else {
      console.log("❌ MailerLite connection failed");
      console.log("Error:", result.message);
    }
  } catch (error) {
    console.log("❌ Test error:", error.message);
  }
}

testConnection();
