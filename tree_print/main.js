import Tree from "./tree";

window.onload = function() {

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext("2d");
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    var t = new Tree();
    var threshold = 6;
    var counter = 0;
    var nodes = 1;
    var animationId;

    function draw() {
        animationId = window.requestAnimationFrame(draw);
        counter++;
        if (counter > threshold) {
            t.insert(parseInt((Math.random() - 0.5) * 10000));
            ctx.clearRect(0, 0, w, 1000);
            t.print(w, ctx);
            counter = 0;
            nodes ++;
        }
        if (nodes > 2000) {
            window.cancelRequestAnimationFrame(animationId);
            return;
        }
    }
    draw();
};