const fs = require('fs');
const content = fs.readFileSync('eslint_report.json', 'utf8');
// remove anything that's not part of the json array if there's powershell garbage
try {
  const jsonString = content.substring(content.indexOf('['));
  const data = JSON.parse(jsonString);
  let count = 0;
  data.forEach(file => {
    if (file.errorCount > 0) {
      console.log(`\nFile: ${file.filePath}`);
      file.messages.forEach(m => {
        console.log(`  Line ${m.line}: ${m.message}`);
        count++;
      });
    }
  });
  console.log(`\nTotal errors: ${count}`);
} catch (e) {
  console.error(e);
}
