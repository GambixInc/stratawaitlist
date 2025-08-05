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
async function testMailerLiteIntegration() {
  console.log("🧪 Testing MailerLite Integration...\n");

  // Test 1: Connection Test
  console.log("1. Testing API Connection...");
  try {
    const connectionResult = await mailerLite.testConnection();
    if (connectionResult.success) {
      console.log("✅ MailerLite API connection successful");
      console.log("   Account info:", connectionResult.data);
    } else {
      console.log("❌ MailerLite API connection failed");
      console.log("   Error:", connectionResult.message);
    }
  } catch (error) {
    console.log("❌ Connection test error:", error.message);
  }

  console.log("\n2. Testing Groups API...");
  try {
    const groupsResult = await mailerLite.getGroups();
    if (groupsResult.success) {
      console.log("✅ Groups retrieved successfully");
      console.log("   Number of groups:", groupsResult.data.data?.length || 0);
      if (groupsResult.data.data && groupsResult.data.data.length > 0) {
        console.log("   First group:", groupsResult.data.data[0].name);
      }
    } else {
      console.log("❌ Failed to get groups");
      console.log("   Error:", groupsResult.message);
    }
  } catch (error) {
    console.log("❌ Groups test error:", error.message);
  }

  console.log("\n3. Testing Subscriber Addition...");
  const testEmail = `test-${Date.now()}@example.com`;
  const groupId = process.env.MAILERLITE_GROUP_ID;

  if (!groupId) {
    console.log("⚠️ MAILERLITE_GROUP_ID not set, skipping subscriber test");
  } else {
    try {
      const subscriberResult = await mailerLite.addSubscriberToGroup(
        testEmail,
        "Test",
        "User",
        groupId
      );

      if (subscriberResult.success) {
        console.log("✅ Test subscriber added successfully");
        console.log("   Email:", testEmail);
        console.log("   Group ID:", groupId);
      } else {
        console.log("❌ Failed to add test subscriber");
        console.log("   Error:", subscriberResult.message);
        if (subscriberResult.error === "DUPLICATE_SUBSCRIBER") {
          console.log("   (This is expected if the email already exists)");
        }
      }
    } catch (error) {
      console.log("❌ Subscriber test error:", error.message);
    }
  }

  console.log("\n4. Testing Waitlist Integration...");
  try {
    const response = await fetch("http://localhost:3001/api/waitlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: "Integration",
        last_name: "Test",
        email: `integration-test-${Date.now()}@example.com`,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("✅ Waitlist signup successful");
      console.log("   User ID:", result.user.id);
      console.log("   Email:", result.user.email);
      console.log("   Message:", result.message);
    } else {
      console.log("❌ Waitlist signup failed");
      console.log("   Status:", response.status);
      console.log("   Error:", result.error);
    }
  } catch (error) {
    console.log("❌ Waitlist integration test error:", error.message);
    console.log("   Make sure the server is running on port 3001");
  }

  console.log("\n🎯 Integration Test Complete!");
}

// Run the test
testMailerLiteIntegration().catch(console.error);
