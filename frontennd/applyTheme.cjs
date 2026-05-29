const fs = require('fs');

function applyTheme(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replaceAll('text-rize-orange', 'text-rize-blue');
  content = content.replaceAll('text-rize-green', 'text-rize-purple');
  content = content.replaceAll('bg-rize-orange', 'bg-rize-blue');
  content = content.replaceAll('bg-rize-green', 'bg-rize-purple');
  content = content.replaceAll('border-rize-orange', 'border-rize-blue');
  content = content.replaceAll('border-rize-green', 'border-rize-purple');
  content = content.replaceAll('glass-orange', 'glass-blue');
  content = content.replaceAll('glass-green', 'glass-purple');
  content = content.replaceAll('gradient-orange', 'gradient-blue-purple');
  content = content.replaceAll('gradient-green', 'gradient-blue-purple');
  content = content.replaceAll('shadow-orange', 'shadow-blue');
  content = content.replaceAll('shadow-green', 'shadow-purple');
  content = content.replaceAll('fill="#ff6b1a"', 'fill="#3b82f6"');
  
  content = content.replaceAll('className="gradient-text"', 'className="gradient-text-blue"');
  content = content.replaceAll('className="gradient-text ', 'className="gradient-text-blue ');
  content = content.replaceAll(' gradient-text"', ' gradient-text-blue"');
  content = content.replaceAll(' gradient-text ', ' gradient-text-blue ');

  fs.writeFileSync(filePath, content);
  console.log('Updated ' + filePath);
}

applyTheme('src/components/Navbar.tsx');
applyTheme('src/pages/Courses.tsx');
applyTheme('src/pages/Home.tsx');
