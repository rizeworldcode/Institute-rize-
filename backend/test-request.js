
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch'); // We'll use node-fetch to simulate the browser's fetch

console.log("=== Testing POST to /updateStudentdetails/RW-6390 ===");
console.log("Creating FormData...");

const formData = new FormData();
formData.append('student_name', 'test name');
formData.append('phone', '1234567890');
formData.append('email', 'test@test.com');
formData.append('address', 'test address');

// Let's add a dummy file for testing
const dummyFile = Buffer.from('this is a test pdf file');
formData.append('certificate_photo', dummyFile, {
  filename: 'test.pdf',
  contentType: 'application/pdf'
});
formData.append('certificate_course', 'Test Course');
formData.append('certificate_admission_id', 'ADM-123456789');

console.log("FormData created! Now making POST request to http://localhost:3001/updateStudentdetails/RW-6390...");
console.log("Timestamp (start):", new Date().toISOString());

fetch('http://localhost:3001/updateStudentdetails/RW-6390', {
  method: 'POST',
  body: formData
})
.then(async (res) => {
  console.log("Timestamp (response received):", new Date().toISOString());
  console.log("Response status:", res.status);
  console.log("Response status text:", res.statusText);
  const text = await res.text();
  console.log("Response text:", text);
  try {
    const json = JSON.parse(text);
    console.log("Response JSON:", json);
  } catch (e) {
    console.log("Not valid JSON");
  }
})
.catch((err) => {
  console.error("=== ERROR ===");
  console.error(err);
  console.error(err.stack);
});
