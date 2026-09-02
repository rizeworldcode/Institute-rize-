const fs = require('fs');
const https = require('https');

const file = fs.createWriteStream('public/images/highlighter.webp');
https.get('https://nians.com/wp-content/uploads/2025/11/highlighter.webp', function(response) {
  response.pipe(file);
  file.on('finish', function() {
    file.close(() => console.log('Download complete'));
  });
}).on('error', function(err) {
  fs.unlink('public/images/highlighter.webp');
  console.error(err);
});
