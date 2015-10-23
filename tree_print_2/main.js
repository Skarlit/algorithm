import Tree from "./tree";


//65-90, 97~122, 32  -> [0-25]U[26-51]U[52]
function _charGen() {
    var rand = parseInt(53*Math.random());
    if (rand <= 25) {
        rand += 65;
    } else if (rand <= 51) {
        rand += 71;
    } else {
        rand  = 32;
    }
    return String.fromCharCode(rand)
}

function stringGen(len) {
    if (len < 1) return _charGen();
    return _charGen() + stringGen(len - 1);
}


window.onload = function() {
    var tree = new Tree('ROOT');
    for(var i = 0; i < 40; i++) {
        tree.insert(stringGen(parseInt((10 + 10 * Math.random()) / 2)))
    }
    tree.printDepth();
}



