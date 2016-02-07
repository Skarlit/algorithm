var Tokenizer = require('./tokenizer');
var fs = require('fs');

var sampleText = 'iamyourtaylorswift';

fs.readFile('./words', 'utf8', function(err, data) {
    var wordArray = data.split(/\r?\n/);
    var t = new Tokenizer();
    t.train(wordArray);
    var result = t.tokenize(sampleText);
});

