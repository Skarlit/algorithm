class Tokenizer {
    constructor() {
        this.wordFreq = {};
    }
    train(arrayOfWords) {
        var n = this.n = arrayOfWords.length;
        for(var i = 0; i < n; i++) {
            this.wordFreq[arrayOfWords[i]] = {
                p: (this.wordFreq[arrayOfWords[i]] || 0) + 1/n,
                s: [arrayOfWords[i]]
            };
        }
    }
    tokenize(string) {
        var r = this._solver(string);
        console.log(r);
        return r;
    }
    _solver(string) {
        if (this.wordFreq[string]) {
            return this.wordFreq[string];
        } else if (string.length < 2) {
            return {p: 1/ (1000*this.n), s: [string]};
        } else {
            var maxProb = -Infinity;
            var maxr1 = null;
            var maxr2 = null;
            for(var i = 0; i < string.length - 1; i++) {
                var s1 = string.substring(0, i + 1);
                var s2 = string.substring(i + 1, string.length);
                var result1 = this._solver(s1);
                var result2 = this._solver(s2);
                if (maxProb < result1.p * result2.p) {
                    maxProb = result1.p * result2.p;
                    maxr1 = result1;
                    maxr2 = result2;
                }
            }
            var result = {p: maxProb, s: maxr1.s.concat(maxr2.s)};
            this.wordFreq[string] = result;
            return result;
        }
    }
}

module.exports = Tokenizer;
