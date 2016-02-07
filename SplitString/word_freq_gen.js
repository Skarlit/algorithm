var file = require('file');
var fs = require('fs');

var freq = {


};

var num = 0;

function read(files) {
    fs.readFile(files.pop(), 'utf8', function (err, data) {
        var wordArray = data.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
        for (var i = 0; i < wordArray.length; i++) {
            freq[wordArray[i]] = ((freq[wordArray[i]] || 0) * num + 1) / (num + 1);
            num++;
        }
        if (files.length > 0) {
            read(files);
        } else {
            //console.log(freq);
            for(var key in freq) {
                freq[key] = freq[key].toFixed(5);
                if (freq[key] == 0) delete freq[key];
            }
            fs.writeFile('freq.json', JSON.stringify(freq), {encoding: 'utf8'})
        }
    });
}


file.walk('./text', function(e, dirPath, dirs, files) {
    read(files);
});



