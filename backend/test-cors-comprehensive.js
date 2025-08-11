// Comprehensive CORS test script
// Run this to test if CORS headers are working on all endpoints

import http from 'http';

const BASE_URL = 'http://localhost:4003';
const TEST_ORIGIN = 'https://www.the-eagle.fikra.solutions';

const testEndpoints = [
    '/api/test',
    '/api/cors-test',
    '/api/v1/subjects/featured',
    '/api/v1/courses/featured',
    '/api/v1/instructors/featured?limit=6',
    '/api/v1/blogs?page=1&limit=3'
];

async function testEndpoint(endpoint) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 4003,
            path: endpoint,
            method: 'GET',
            headers: {
                'Origin': TEST_ORIGIN,
                'User-Agent': 'CORS-Test-Script',
                'Accept': 'application/json'
            }
        };

        console.log(`\n🔍 Testing: ${endpoint}`);
        console.log(`📍 Origin: ${TEST_ORIGIN}`);

        const req = http.request(options, (res) => {
            console.log(`📊 Status: ${res.statusCode}`);
            
            // Check CORS headers
            const corsHeaders = {
                'Access-Control-Allow-Origin': res.headers['access-control-allow-origin'],
                'Access-Control-Allow-Methods': res.headers['access-control-allow-methods'],
                'Access-Control-Allow-Headers': res.headers['access-control-allow-headers'],
                'Access-Control-Allow-Credentials': res.headers['access-control-allow-credentials'],
                'Access-Control-Expose-Headers': res.headers['access-control-expose-headers'],
                'Access-Control-Max-Age': res.headers['access-control-max-age']
            };

            console.log('🔒 CORS Headers:');
            Object.entries(corsHeaders).forEach(([key, value]) => {
                const status = value ? '✅' : '❌';
                console.log(`   ${status} ${key}: ${value || 'MISSING'}`);
            });

            // Check if CORS is working
            const hasOrigin = corsHeaders['Access-Control-Allow-Origin'] === TEST_ORIGIN;
            const hasMethods = !!corsHeaders['Access-Control-Allow-Methods'];
            const hasCredentials = corsHeaders['Access-Control-Allow-Credentials'] === 'true';

            if (hasOrigin && hasMethods && hasCredentials) {
                console.log('🎉 CORS is properly configured for this endpoint!');
            } else {
                console.log('⚠️  CORS is NOT properly configured for this endpoint!');
            }

            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    console.log(`📄 Response: ${jsonData.message || 'Success'}`);
                } catch (e) {
                    console.log(`📄 Response: ${data.substring(0, 100)}...`);
                }
                resolve({ endpoint, status: res.statusCode, corsHeaders, success: hasOrigin && hasMethods && hasCredentials });
            });
        });

        req.on('error', (e) => {
            console.error(`❌ Request error for ${endpoint}:`, e.message);
            reject({ endpoint, error: e.message });
        });

        req.end();
    });
}

async function testOptionsRequest(endpoint) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 4003,
            path: endpoint,
            method: 'OPTIONS',
            headers: {
                'Origin': TEST_ORIGIN,
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Request-Headers': 'Content-Type, Authorization'
            }
        };

        console.log(`\n🔍 Testing OPTIONS (preflight) for: ${endpoint}`);

        const req = http.request(options, (res) => {
            console.log(`📊 OPTIONS Status: ${res.statusCode}`);
            
            const corsHeaders = {
                'Access-Control-Allow-Origin': res.headers['access-control-allow-origin'],
                'Access-Control-Allow-Methods': res.headers['access-control-allow-methods'],
                'Access-Control-Allow-Headers': res.headers['access-control-allow-headers'],
                'Access-Control-Allow-Credentials': res.headers['access-control-allow-credentials'],
                'Access-Control-Max-Age': res.headers['access-control-max-age']
            };

            console.log('🔒 OPTIONS CORS Headers:');
            Object.entries(corsHeaders).forEach(([key, value]) => {
                const status = value ? '✅' : '❌';
                console.log(`   ${status} ${key}: ${value || 'MISSING'}`);
            });

            resolve({ endpoint, status: res.statusCode, corsHeaders });
        });

        req.on('error', (e) => {
            console.error(`❌ OPTIONS request error for ${endpoint}:`, e.message);
            reject({ endpoint, error: e.message });
        });

        req.end();
    });
}

async function runAllTests() {
    console.log('🚀 Starting Comprehensive CORS Test');
    console.log('=====================================');
    console.log(`🎯 Testing origin: ${TEST_ORIGIN}`);
    console.log(`🌐 Base URL: ${BASE_URL}`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);

    const results = [];
    
    // Test regular endpoints
    for (const endpoint of testEndpoints) {
        try {
            const result = await testEndpoint(endpoint);
            results.push(result);
        } catch (error) {
            results.push(error);
        }
    }

    // Test OPTIONS requests for key endpoints
    const keyEndpoints = ['/api/v1/subjects/featured', '/api/v1/courses/featured'];
    for (const endpoint of keyEndpoints) {
        try {
            await testOptionsRequest(endpoint);
        } catch (error) {
            console.error(`❌ OPTIONS test failed for ${endpoint}:`, error);
        }
    }

    // Summary
    console.log('\n📋 TEST SUMMARY');
    console.log('================');
    const successful = results.filter(r => r.success).length;
    const total = results.length;
    console.log(`✅ Successful: ${successful}/${total}`);
    console.log(`❌ Failed: ${total - successful}/${total}`);

    if (successful === total) {
        console.log('🎉 All endpoints have proper CORS configuration!');
    } else {
        console.log('⚠️  Some endpoints are missing CORS headers.');
        console.log('💡 Check your server configuration and ensure CORS middleware is running.');
    }
}

// Run the tests
runAllTests().catch(console.error);
