const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = '/usr/src/app/libs/proto/auth.proto';
const GRAPHQL_URL = 'http://tickets:8001/graphql';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const authProto = grpc.loadPackageDefinition(packageDefinition).auth;

function main() {
    const authHost = process.env.AUTH_HOST || 'auth:50051';
    const client = new authProto.AuthService(authHost, grpc.credentials.createInsecure());

    const email = `user_${Date.now()}@example.com`;
    const password = 'password123';

    console.log(`1. Register/Login ${email} on ${authHost}...`);
    client.Register({ email, password }, (err, response) => {
        if (err) {
            console.error('Register failed:', err);
            process.exit(1);
        }
        client.Login({ email, password }, (err, loginRes) => {
            if (err) {
                console.error('Login failed:', err);
                process.exit(1);
            }
            const token = loginRes.token;
            console.log('   Got Token');
            reserveTicket(token);
        });
    });
}

async function reserveTicket(token) {
    const seat = "Seat_" + Date.now();
    const query = `
      mutation {
        reserveTicket(eventId: 1, seat: "${seat}") {
          id
          status
          seat
          event {
            title
          }
        }
      }
    `;

    try {
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query })
        });

        const json = await response.json();
        console.log('   Response:', JSON.stringify(json, null, 2));

        if (json.errors) {
            console.error('GraphQL Errors:', json.errors);
            process.exit(1);
        }

        if (json.data && json.data.reserveTicket && json.data.reserveTicket.seat === seat) {
            console.log('TEST PASSED');
        } else {
            console.error('TEST FAILED');
            process.exit(1);
        }

    } catch (e) {
        console.error('Fetch failed:', e);
        process.exit(1);
    }
}

main();
