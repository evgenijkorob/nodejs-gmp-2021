const { createReadStream, createWriteStream } = require('fs');
const { Transform } = require('stream');
const { createInterface } = require('readline');
const csvtojson = require('csvtojson');

const csvFolderPath = './task1/csv';
const csvFileName = 'books.csv';
const csvFilePath = `${csvFolderPath}/${csvFileName}`;
const nowDate = new Date();
const dateStr = nowDate.toISOString().replace(/:/g, '.');
const txtFileName = `books_${dateStr}.txt`;
const txtFilePath = `${csvFolderPath}/${txtFileName}`;

const csvFile = createReadStream(csvFilePath, { encoding: 'utf-8' });
const readlineInterface = createInterface({ input: csvFile });
const csvByLine = new Transform({
  transform: (buf, encoding, callback) => {
    callback(null, buf);
  }
});
const converter = csvtojson({ delimiter: ';' }, { encoding: 'utf-8' });
const writeToTxt = createWriteStream(txtFilePath, { encoding: 'utf-8' });

csvFile.on('error', (err) => console.error('read error\n', err.message));
converter.on('error', (err) => console.error('cvstojson error\n', err.message));
writeToTxt.on('error', (err) => console.error('write error\n', err.message));

readlineInterface.on('line', (line) => csvByLine.write(line + '\n'));
csvByLine.pipe(converter).pipe(writeToTxt);
