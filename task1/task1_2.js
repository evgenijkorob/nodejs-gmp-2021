import { join } from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { createInterface } from 'readline';
import csvtojson from 'csvtojson';

const csvFolderName = 'csv';
const csvFolderPath = join(__dirname, csvFolderName);
const csvFileName = 'books.csv';
const csvFilePath = join(csvFolderPath, csvFileName);
const nowDate = new Date();
const dateStr = nowDate.toISOString().replace(/:/g, '.');
const txtFileName = `books_${dateStr}.txt`;
const txtFilePath = join(csvFolderPath, txtFileName);

const csvFile = createReadStream(csvFilePath, { encoding: 'utf-8' });
const readlineInterface = createInterface({ input: csvFile });
const converter = csvtojson(
  {
    delimiter: ';',
    checkType: true,
    ignoreColumns: /(amount)/
  },
  { encoding: 'utf-8' }
);
const writeToTxt = createWriteStream(txtFilePath);
let isHeaderRow = true;

readlineInterface.on('line', (line) => {
  let resultLine = line;

  if (isHeaderRow) {
    resultLine = resultLine.toLowerCase();
    isHeaderRow = false;
  }

  return converter.write(resultLine + '\n')
});

csvFile.on('error', (err) => console.error('read error\n', err.message));
converter.on('error', (err) => console.error('cvstojson error\n', err.message));
writeToTxt.on('error', (err) => console.error('write error\n', err.message));

converter.pipe(writeToTxt);
