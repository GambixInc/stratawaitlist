const {
  DynamoDBClient,
  CreateTableCommand,
  CreateGlobalSecondaryIndexCommand,
} = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
});

const tableName = process.env.DYNAMODB_TABLE_NAME || "strata-waitlist";

async function createTable() {
  try {
    console.log("🔄 Creating DynamoDB table:", tableName);

    const createTableCommand = new CreateTableCommand({
      TableName: tableName,
      AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
        { AttributeName: "email", AttributeType: "S" },
        { AttributeName: "tier_level", AttributeType: "N" },
        { AttributeName: "points", AttributeType: "N" },
      ],
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      GlobalSecondaryIndexes: [
        {
          IndexName: "email-index",
          KeySchema: [{ AttributeName: "email", KeyType: "HASH" }],
          Projection: {
            ProjectionType: "ALL",
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
        {
          IndexName: "points-index",
          KeySchema: [
            { AttributeName: "tier_level", KeyType: "HASH" },
            { AttributeName: "points", KeyType: "RANGE" },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    });

    await client.send(createTableCommand);
    console.log("✅ DynamoDB table created successfully!");
    console.log("📋 Table name:", tableName);
    console.log("🔍 Indexes created:");
    console.log("   - email-index (for email lookups)");
    console.log("   - points-index (for leaderboard)");
  } catch (error) {
    if (error.name === "ResourceInUseException") {
      console.log("ℹ️ Table already exists:", tableName);
    } else {
      console.error("❌ Error creating DynamoDB table:", error);
      throw error;
    }
  }
}

// Run the setup
createTable().catch(console.error);
