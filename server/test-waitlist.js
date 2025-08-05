// Load environment variables
require('dotenv').config();

async function testWaitlistIntegration() {
  console.log('🧪 Testing Waitlist + MailerLite Integration...\n');

  try {
    const response = await fetch('http://localhost:3001/api/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: 'Integration',
        last_name: 'Test',
        email: `integration-test-${Date.now()}@example.com`
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Waitlist signup successful!');
      console.log('   User ID:', result.user.id);
      console.log('   Email:', result.user.email);
      console.log('   Name:', result.user.first_name, result.user.last_name);
      console.log('   Message:', result.message);
      console.log('\n📧 This user should now be in your MailerLite group!');
    } else {
      console.log('❌ Waitlist signup failed');
      console.log('   Status:', response.status);
      console.log('   Error:', result.error);
    }
  } catch (error) {
    console.log('❌ Test error:', error.message);
    console.log('   Make sure the server is running on port 3001');
  }
}

testWaitlistIntegration(); 