const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");

class DynamoDBService {
  constructor() {
    // Initialize DynamoDB client
    this.client = new DynamoDBClient({
      region: process.env.AWS_REGION || "us-east-1",
      // AWS credentials will be automatically loaded from:
      // 1. Environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
      // 2. IAM role (if running on EC2)
      // 3. AWS credentials file
    });

    this.docClient = DynamoDBDocumentClient.from(this.client);
    this.tableName = process.env.DYNAMODB_TABLE_NAME || "strata-waitlist";
  }

  // Create a new waitlist entry in DynamoDB
  async createWaitlistEntry(userData) {
    const timestamp = new Date().toISOString();
    const item = {
      id: userData.id,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      referral_link: userData.referral_link,
      referred_by: userData.referred_by || null,
      referral_count: 0,
      points: 0,
      tier_level: 1,
      created_at: timestamp,
      last_referral_at: null,
      // Add any additional fields you want to track
      source: userData.source || "direct",
      utm_source: userData.utm_source || null,
      utm_medium: userData.utm_medium || null,
      utm_campaign: userData.utm_campaign || null,
    };

    const command = new PutCommand({
      TableName: this.tableName,
      Item: item,
      // Ensure email is unique
      ConditionExpression: "attribute_not_exists(email)",
    });

    try {
      await this.docClient.send(command);
      console.log("✅ User saved to DynamoDB:", userData.email);
      return item;
    } catch (error) {
      if (error.name === "ConditionalCheckFailedException") {
        console.log("⚠️ User already exists in DynamoDB:", userData.email);
        throw new Error("Email already registered");
      }
      console.error("❌ DynamoDB error:", error);
      throw error;
    }
  }

  // Get waitlist entry by email
  async getWaitlistEntryByEmail(email) {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: "email-index", // You'll need to create this GSI
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    });

    try {
      const response = await this.docClient.send(command);
      return response.Items?.[0] || null;
    } catch (error) {
      console.error("❌ DynamoDB query error:", error);
      return null;
    }
  }

  // Get waitlist entry by ID
  async getWaitlistEntryById(id) {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { id },
    });

    try {
      const response = await this.docClient.send(command);
      return response.Item || null;
    } catch (error) {
      console.error("❌ DynamoDB get error:", error);
      return null;
    }
  }

  // Update waitlist entry
  async updateWaitlistEntry(id, updates) {
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.entries(updates).forEach(([key, value]) => {
      const attributeName = `#${key}`;
      const attributeValue = `:${key}`;

      updateExpressions.push(`${attributeName} = ${attributeValue}`);
      expressionAttributeNames[attributeName] = key;
      expressionAttributeValues[attributeValue] = value;
    });

    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { id },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    try {
      const response = await this.docClient.send(command);
      return response.Attributes;
    } catch (error) {
      console.error("❌ DynamoDB update error:", error);
      throw error;
    }
  }

  // Get leaderboard (top users by points)
  async getLeaderboard(limit = 10) {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: "points-index", // You'll need to create this GSI
      KeyConditionExpression: "tier_level = :tier",
      ExpressionAttributeValues: {
        ":tier": 1, // Assuming tier_level 1 is the main tier
      },
      ScanIndexForward: false, // Sort in descending order
      Limit: limit,
    });

    try {
      const response = await this.docClient.send(command);
      return response.Items || [];
    } catch (error) {
      console.error("❌ DynamoDB leaderboard error:", error);
      return [];
    }
  }

  // Test connection
  async testConnection() {
    try {
      const command = new GetCommand({
        TableName: this.tableName,
        Key: { id: "test" },
      });
      await this.docClient.send(command);
      return true;
    } catch (error) {
      if (error.name === "ResourceNotFoundException") {
        console.log("⚠️ DynamoDB table not found:", this.tableName);
        return false;
      }
      console.error("❌ DynamoDB connection error:", error);
      return false;
    }
  }
}

// Create and export a singleton instance
const dynamoDB = new DynamoDBService();

module.exports = dynamoDB;
