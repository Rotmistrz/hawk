const bundle = require('bundle-js');

let output = bundle({
    entry : './src/index.js',
    dest: './out/hawk.js',
    print: false
});

console.log("Compilation successful!");