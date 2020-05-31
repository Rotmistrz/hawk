const bundle = require('bundle-js');

let output = bundle({
    entry : './src/index.js',
    dest: './out/hawk.js',
    print: false
});

let anotherOutput = bundle({
    entry : './src/index.js',
    dest: '../../__projects/symfony/volleyscout/public/js/app.js',
    print: false
});

console.log("Compilation successful!");