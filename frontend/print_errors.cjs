const fs = require('fs');
const content = fs.readFileSync('eslint_report.json', 'utf16le');
if (content.includes('[')) {
  const jsonString = content.substring(content.indexOf('['));
  const data = JSON.parse(jsonString);
  for (const file of data) {
    if (file.errorCount > 0) {
      console.log('FILE: ' + file.filePath);
      for (const m of file.messages) {
        if (m.severity > 1) { // Error only
           console.log('  LINE ' + m.line + ': ' + m.message);
        }
      }
    }
  }
}
