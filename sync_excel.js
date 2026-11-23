/**
 * Digital Weekly Planner — Excel Sync Utility (sync_excel.js)
 * Command-line script to inspect or sync Data.xlsx with Money Flow transactions.
 * Usage: node sync_excel.js [view|clear]
 */
const fs = require('fs');
const path = require('path');
const XLSX = require('./assets/xlsx.full.min.js');

const EXCEL_FILE = path.join(__dirname, 'Data.xlsx');

function syncExcel(action = 'view') {
  if (!fs.existsSync(EXCEL_FILE)) {
    console.error(`File not found: ${EXCEL_FILE}`);
    return;
  }

  const buffer = fs.readFileSync(EXCEL_FILE);
  const wb = XLSX.read(buffer, { type: 'buffer' });

  console.log(`\nWorkbook: Data.xlsx`);
  console.log(`Sheets found:`, wb.SheetNames);

  const moneySheet = wb.Sheets['Money Flow'];
  if (!moneySheet) {
    console.log(`Sheet 'Money Flow' not found in workbook.`);
    return;
  }

  const rows = XLSX.utils.sheet_to_json(moneySheet, { header: 1 });
  console.log(`\n=== Money Flow Sheet (${rows.length > 1 ? rows.length - 1 : 0} entries) ===`);
  rows.forEach((row, i) => {
    console.log(`Row ${i + 1}: ${row.join(' | ')}`);
  });

  if (action === 'clear') {
    const headers = ['Sr. No', 'Dates', 'Description', 'Types', 'Amount'];
    wb.Sheets['Money Flow'] = XLSX.utils.aoa_to_sheet([headers]);
    const outBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    fs.writeFileSync(EXCEL_FILE, outBuffer);
    console.log('\n✓ Money Flow sheet cleared to header row.');
  }
}

const arg = process.argv[2] || 'view';
syncExcel(arg);
