const { Transform } = require('stream');

class ReverseTransform extends Transform {
  _transform(buf, encoding, callback) {
    const inputStr = buf.toString('utf-8');
    const reversedStr = inputStr.trim().split('').reverse().join('');

    callback(null, reversedStr + '\n');
  }
}

const inputReverser = new ReverseTransform();

process.stdin.pipe(inputReverser).pipe(process.stdout);
