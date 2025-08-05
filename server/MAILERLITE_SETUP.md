# MailerLite Integration Setup

This guide will help you configure MailerLite integration for your waitlist application.

## Prerequisites

1. A MailerLite account
2. API access enabled in your MailerLite account

## Setup Steps

### 1. Get Your MailerLite API Key

1. Log in to your MailerLite account
2. Go to **Integrations** → **Developers** → **API**
3. Copy your API key

### 2. Create a Group in MailerLite

1. In MailerLite, go to **Subscribers** → **Groups**
2. Create a new group (e.g., "Waitlist Subscribers")
3. Copy the Group ID from the URL or group settings

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# MailerLite Configuration
MAILERLITE_API_KEY=your_mailerlite_api_key_here
MAILERLITE_GROUP_ID=your_mailerlite_group_id_here

# Other existing variables...
PORT=3001
NODE_ENV=development
```

### 4. Install Dependencies

Run the following command in the `server` directory:

```bash
npm install
```

### 5. Test the Integration

1. Start your server: `npm run dev`
2. Check the health endpoint: `GET /api/health`
3. The response should show `mailerlite: "connected"` if configured correctly

## API Endpoints

### Health Check
- `GET /api/health` - Check server and MailerLite connection status

### MailerLite Management
- `GET /api/mailerlite/groups` - Get all groups
- `POST /api/mailerlite/groups` - Create a new group
- `GET /api/mailerlite/subscribers/:email` - Get subscriber info
- `PUT /api/mailerlite/subscribers/:email` - Update subscriber
- `POST /api/mailerlite/campaigns` - Create and send campaign

### Waitlist Integration
- `POST /api/waitlist` - Automatically adds subscribers to MailerLite group

## Features

### Automatic Subscriber Addition
When someone joins the waitlist via `POST /api/waitlist`, they are automatically:
1. Saved to your local database
2. Saved to DynamoDB (if configured)
3. Added to your MailerLite group (if configured)

### Error Handling
- If MailerLite integration fails, the waitlist signup still succeeds
- All errors are logged but don't break the user experience
- Graceful fallback if API key is not configured

### Subscriber Fields
The following fields are automatically mapped:
- `email` - Subscriber email
- `name` - Full name (first_name + last_name)
- `first_name` - First name
- `last_name` - Last name

## Troubleshooting

### Common Issues

1. **"API key not configured" warning**
   - Make sure `MAILERLITE_API_KEY` is set in your `.env` file
   - Restart the server after adding the environment variable

2. **"Connection failed" in health check**
   - Verify your API key is correct
   - Check that your MailerLite account has API access enabled

3. **Subscribers not being added to group**
   - Verify `MAILERLITE_GROUP_ID` is set correctly
   - Check that the group exists in your MailerLite account

4. **Rate limiting errors**
   - MailerLite has API rate limits
   - The integration includes retry logic and error handling

### Testing

You can test the integration using curl:

```bash
# Test health endpoint
curl http://localhost:3001/api/health

# Test waitlist signup (will add to MailerLite if configured)
curl -X POST http://localhost:3001/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"first_name":"John","last_name":"Doe","email":"john@example.com"}'

# Get MailerLite groups
curl http://localhost:3001/api/mailerlite/groups
```

## Security Notes

- Never commit your `.env` file to version control
- Keep your API key secure and rotate it regularly
- The API key has full access to your MailerLite account
- Consider using environment-specific API keys for development/production 