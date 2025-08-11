// Simple CORS test script
// Run this to test if CORS headers are working

import http from 'http';

const options = {
    hostname: 'localhost',
    port: 4003,
    path: '/api/test',
    method: 'GET',
    headers: {
        'Origin': 'https://www.the-eagle.fikra.solutions',
        'User-Agent': 'CORS-Test-Script'
    }
};

const req = http.request(options, (res) => {
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('Response Body:', data);
        console.log('\nCORS Headers Check:');
        console.log('Access-Control-Allow-Origin:', res.headers['access-control-allow-origin']);
        console.log('Access-Control-Allow-Methods:', res.headers['access-control-allow-methods']);
        console.log('Access-Control-Allow-Headers:', res.headers['access-control-allow-headers']);
        console.log('Access-Control-Allow-Credentials:', res.headers['access-control-allow-credentials']);
    });
});

req.on('error', (e) => {
    console.error('Request error:', e);
});

req.end();
