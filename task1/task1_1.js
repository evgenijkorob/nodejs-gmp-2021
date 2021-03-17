import { Transform } from 'stream';

class ReverseTransform extends Transform {
  _transform(buf, encoding, callback) {
    try {
      const inputStr = buf.toString('utf-8');
      const reversedStr = inputStr.trim().split('').reverse().join('');

      callback(null, reversedStr + '\n');
    } catch (err) {
      callback(err);
    }
  }
}

const inputReverser = new ReverseTransform();

process.stdin.pipe(inputReverser).pipe(process.stdout);
