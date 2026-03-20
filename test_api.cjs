const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAuth() {
    try {
        const timestamp = Date.now();
        const testUser = {
            name: `Test User ${timestamp}`,
            email: `test${timestamp}@example.com`,
            password: 'password123'
        };

        console.log('Testing Registration...');
        const regRes = await axios.post(`${API_URL}/auth/register`, testUser);
        console.log('Registration successful:', regRes.data);

        console.log('\nTesting Login...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: testUser.email,
            password: testUser.password
        });
        console.log('Login successful:', loginRes.data);
        const token = loginRes.data.token;

        console.log('\nTesting Get Me...');
        const meRes = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Get Me successful:', meRes.data);

        console.log('\nAll Auth tests passed!');
    } catch (error) {
        console.error('Test failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

testAuth();
