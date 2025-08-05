const axios = require('axios');

class MailerLiteService {
  constructor() {
    this.apiKey = process.env.MAILERLITE_API_KEY;
    this.baseURL = 'https://connect.mailerlite.com/api';
    
    if (!this.apiKey) {
      console.warn('⚠️ MAILERLITE_API_KEY environment variable is not set');
    }
  }

  // Create axios instance with default headers
  getClient() {
    return axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  // Add subscriber to a group
  async addSubscriberToGroup(email, firstName, lastName, groupId) {
    if (!this.apiKey) {
      console.warn('⚠️ MailerLite API key not configured, skipping subscriber addition');
      return { success: false, message: 'API key not configured' };
    }

    try {
      const client = this.getClient();
      
      const subscriberData = {
        email: email,
        fields: {
          name: `${firstName} ${lastName}`,
          first_name: firstName,
          last_name: lastName
        },
        groups: [groupId],
        status: 'active'
      };

      const response = await client.post('/subscribers', subscriberData);
      
      console.log('✅ Subscriber added to MailerLite:', email);
      return {
        success: true,
        data: response.data,
        message: 'Subscriber added successfully'
      };
    } catch (error) {
      console.error('❌ Error adding subscriber to MailerLite:', error.response?.data || error.message);
      
      // Handle specific error cases
      if (error.response?.status === 409) {
        return {
          success: false,
          message: 'Subscriber already exists',
          error: 'DUPLICATE_SUBSCRIBER'
        };
      }
      
      return {
        success: false,
        message: 'Failed to add subscriber',
        error: error.response?.data || error.message
      };
    }
  }

  // Update subscriber information
  async updateSubscriber(email, updateData) {
    if (!this.apiKey) {
      console.warn('⚠️ MailerLite API key not configured, skipping subscriber update');
      return { success: false, message: 'API key not configured' };
    }

    try {
      const client = this.getClient();
      
      const response = await client.put(`/subscribers/${email}`, updateData);
      
      console.log('✅ Subscriber updated in MailerLite:', email);
      return {
        success: true,
        data: response.data,
        message: 'Subscriber updated successfully'
      };
    } catch (error) {
      console.error('❌ Error updating subscriber in MailerLite:', error.response?.data || error.message);
      return {
        success: false,
        message: 'Failed to update subscriber',
        error: error.response?.data || error.message
      };
    }
  }

  // Get subscriber information
  async getSubscriber(email) {
    if (!this.apiKey) {
      console.warn('⚠️ MailerLite API key not configured, skipping subscriber retrieval');
      return { success: false, message: 'API key not configured' };
    }

    try {
      const client = this.getClient();
      
      const response = await client.get(`/subscribers/${email}`);
      
      return {
        success: true,
        data: response.data,
        message: 'Subscriber retrieved successfully'
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'Subscriber not found',
          error: 'SUBSCRIBER_NOT_FOUND'
        };
      }
      
      console.error('❌ Error getting subscriber from MailerLite:', error.response?.data || error.message);
      return {
        success: false,
        message: 'Failed to get subscriber',
        error: error.response?.data || error.message
      };
    }
  }

  // Get all groups
  async getGroups() {
    if (!this.apiKey) {
      console.warn('⚠️ MailerLite API key not configured, skipping groups retrieval');
      return { success: false, message: 'API key not configured' };
    }

    try {
      const client = this.getClient();
      
      const response = await client.get('/groups');
      
      return {
        success: true,
        data: response.data,
        message: 'Groups retrieved successfully'
      };
    } catch (error) {
      console.error('❌ Error getting groups from MailerLite:', error.response?.data || error.message);
      return {
        success: false,
        message: 'Failed to get groups',
        error: error.response?.data || error.message
      };
    }
  }

  // Create a new group
  async createGroup(name) {
    if (!this.apiKey) {
      console.warn('⚠️ MailerLite API key not configured, skipping group creation');
      return { success: false, message: 'API key not configured' };
    }

    try {
      const client = this.getClient();
      
      const response = await client.post('/groups', { name });
      
      console.log('✅ Group created in MailerLite:', name);
      return {
        success: true,
        data: response.data,
        message: 'Group created successfully'
      };
    } catch (error) {
      console.error('❌ Error creating group in MailerLite:', error.response?.data || error.message);
      return {
        success: false,
        message: 'Failed to create group',
        error: error.response?.data || error.message
      };
    }
  }

  // Send a campaign to a group
  async sendCampaign(groupId, subject, content) {
    if (!this.apiKey) {
      console.warn('⚠️ MailerLite API key not configured, skipping campaign send');
      return { success: false, message: 'API key not configured' };
    }

    try {
      const client = this.getClient();
      
      // First create a campaign
      const campaignData = {
        name: subject,
        type: 'regular',
        subject: subject,
        content: {
          html: content
        },
        groups: [groupId]
      };

      const response = await client.post('/campaigns', campaignData);
      
      console.log('✅ Campaign created in MailerLite:', subject);
      return {
        success: true,
        data: response.data,
        message: 'Campaign created successfully'
      };
    } catch (error) {
      console.error('❌ Error creating campaign in MailerLite:', error.response?.data || error.message);
      return {
        success: false,
        message: 'Failed to create campaign',
        error: error.response?.data || error.message
      };
    }
  }

  // Test API connection
  async testConnection() {
    if (!this.apiKey) {
      return { success: false, message: 'API key not configured' };
    }

    try {
      const client = this.getClient();
      const response = await client.get('/account');
      
      return {
        success: true,
        data: response.data,
        message: 'Connection successful'
      };
    } catch (error) {
      console.error('❌ MailerLite API connection test failed:', error.response?.data || error.message);
      return {
        success: false,
        message: 'Connection failed',
        error: error.response?.data || error.message
      };
    }
  }
}

module.exports = new MailerLiteService(); 