const bundle = require('bundle-js');

let output = bundle({
    entry : './src/index.js',
    dest: './out/hawk.js',
    print: false
});

let anotherOutput = bundle({
    entry : './src/index.js',
    dest: 'E:/john-weston/herocms/herocms/www/herocms4/public/js/hawk.js',
    print: false
});

console.log("Compilation successful!");