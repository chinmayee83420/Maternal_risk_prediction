const axios = require('axios');

async function testAll() {
  console.log('=== Step 1: Health Check ===');
  const healthRes = await axios.get('http://127.0.0.1:5000/api/health');
  console.log('Health:', healthRes.data);

  console.log('\n=== Step 2: User Registration ===');
  const testUsername = `user_${Date.now()}`;
  const regRes = await axios.post('http://127.0.0.1:5000/api/auth/register', {
    username: testUsername,
    email: `${testUsername}@example.com`,
    password: 'securePassword123'
  });
  console.log('Register Response:', regRes.data);
  const token = regRes.data.token;

  console.log('\n=== Step 3: User Login ===');
  const loginRes = await axios.post('http://127.0.0.1:5000/api/auth/login', {
    identifier: testUsername,
    password: 'securePassword123'
  });
  console.log('Login Response:', loginRes.data);

  console.log('\n=== Step 4: Get Current User Profile ===');
  const meRes = await axios.get('http://127.0.0.1:5000/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('Profile:', meRes.data);

  console.log('\n=== Step 5: Prediction via Express -> Python ML Service ===');
  const predRes = await axios.post('http://127.0.0.1:5000/api/predict', {
    age: 28,
    systolic_bp: 125,
    diastolic_bp: 80,
    blood_sugar: 6.8,
    body_temp: 98.4,
    heart_rate: 74
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('Prediction Response:', predRes.data);

  console.log('\n=== Step 6: Fetch Prediction History ===');
  const histRes = await axios.get('http://127.0.0.1:5000/api/history', {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('History Records count:', histRes.data.history.length);
  console.log('First Record:', histRes.data.history[0]);

  console.log('\n>>> ALL END-TO-END TESTS PASSED SUCCESSFULLY! <<<');
}

testAll().catch(err => {
  console.error('Test failed:', err.response ? err.response.data : err.message);
  process.exit(1);
});
