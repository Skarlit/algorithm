var width = 1500;
var t = new Tree();
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
var threshold = 5;
var counter = 0;
function draw() {
    window.requestAnimationFrame(draw);
    counter ++;
    if (counter > threshold) {
        var num = parseInt((Math.random() - 0.5) * 10000);
        //console.log('inserting ' + num);
        t.insert(new TreeNode({key: num}));
        ctx.clearRect(0,0, width,1000);
        t.print(width, ctx);
        counter = 0;
    }
}
draw();/**
 * Created by scarlet on 9/17/2015.
 */
