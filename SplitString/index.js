import Tokenizer from "./tokenizer.js";
import $ from "jquery";

var freq;
var tokenizer = new Tokenizer();
var input;
var convert;
var output;
$.get('./freq.json', function(data) {
    freq = data;
    tokenizer.useFreq(freq);
    $('#input')[0].disabled = false;
});

function concat(string) {
    return string.replace(/[^a-zA-Z]/g, '').toLowerCase();
}

$(function() {
    input = $('#input');
    convert = $('#convert');
    output = $('#output');
    var handle;
    input.on('input', function() {
        if (handle) clearTimeout(handle);
        handle = setTimeout(function() {
            input.val(concat(input.val()));
        }, 500);
    });
    convert.on('click', function() {
        var result = tokenizer.tokenize(concat(input.val())).s.join(' ');
        output.text(result);
    })
})