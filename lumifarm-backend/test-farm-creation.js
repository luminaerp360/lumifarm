require('dotenv').config();
const http = require('http');

async function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3400,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : null,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
          });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function testFarmCreation() {
  console.log('========================================');
  console.log('TESTING FARM CREATION ENDPOINT');
  console.log('========================================\n');

  try {
    // Step 1: Login
    console.log('Step 1: Logging in...');
    const loginRes = await makeRequest('POST', '/auth/login', {
      email: 'admin@lumifarm.co.ke',
      password: 'Lumifarm@2026',
    });

    if (loginRes.status !== 201 && loginRes.status !== 200) {
      console.error('❌ Login failed:', loginRes.body);
      return;
    }

    console.log('✓ Login successful');
    const token = loginRes.body.token;
    const user = loginRes.body.user;
    
    console.log('  User:', user.name);
    console.log('  Email:', user.email);
    console.log('  Role:', user.role);

    // Step 2: Check token payload
    console.log('\nStep 2: Checking JWT token payload...');
    const tokenParts = token.split('.');
    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
    
    console.log('  Token includes:');
    console.log('    - tenantIds:', payload.tenantIds);
    console.log('    - tenantId:', payload.tenantId);

    if (!payload.tenantId) {
      console.warn('⚠️  WARNING: tenantId is empty in JWT token!');
      console.warn('    This means the token was issued before the database was updated.');
      console.warn('    Try logging out and logging in again from the UI.');
      return;
    }

    console.log('✓ Token has tenant context');

    // Step 3: Create farm
    console.log('\nStep 3: Creating a farm...');
    const farmData = {
      name: 'Test Farm',
      description: 'Test farm created via API',
      type: 'mixed_farming',
      status: 'under_cultivation',
      address: 'Nakuru, Kenya',
      city: 'Nakuru',
      county: 'Nakuru',
      totalAcreage: 10,
      soilType: 'loamy',
      irrationType: 'rainwater',
      dominantCrops: ['maize', 'beans'],
      currency: 'KES',
      managerId: '',
      ownerName: 'Test Owner',
      ownerPhone: '+254712345678',
      ownerEmail: 'owner@test.com',
      latitude: -0.3031,
      longitude: 36.0899,
    };

    const createRes = await makeRequest('POST', '/farms', farmData, token);

    if (createRes.status === 201 || createRes.status === 200) {
      console.log('✓ Farm created successfully!');
      console.log('\nFarm details:');
      console.log('  ID:', createRes.body._id);
      console.log('  Name:', createRes.body.name);
      console.log('  Address:', createRes.body.address);
      console.log('  Tenant:', createRes.body.tenantId);
      console.log('  Total Acreage:', createRes.body.totalAcreage);
      console.log('\n========================================');
      console.log('✓ SUCCESS! Farm creation is working!');
      console.log('========================================');
    } else {
      console.error('❌ Farm creation failed:');
      console.error('  Status:', createRes.status);
      console.error('  Error:', createRes.body?.message || createRes.body);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFarmCreation();
