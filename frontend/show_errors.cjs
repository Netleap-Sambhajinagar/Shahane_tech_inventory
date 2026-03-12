const fs = require('fs');
const content = fs.readFileSync('eslint_report.json', 'utf16le');
try {
  const jsonString = content.substring(content.indexOf('['));
  const data = JSON.parse(jsonString);
  data.forEach(file => {
    if (file.errorCount > 0) {
      console.log(file.filePath);
      file.messages.forEach(m => console.log(`  Line ${m.line}: ${m.message}`));
    }
  });
} catch (e) {
  console.error(e);
}
