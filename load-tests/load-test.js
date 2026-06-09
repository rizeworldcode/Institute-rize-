import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 1000 },
    { duration: '2m', target: 3000 },
    { duration: '2m', target: 5000 },
    { duration: '2m', target: 10000 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2000'],
  },
};

export default function () {
  const payload = JSON.stringify({
    email: 'admin@rizeworld.com',
    password: 'Admin@123'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(
    'http://localhost:3001/admin_login',
    payload,
    params
  );

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}