import cfg from "./config";

var scale = cfg.depthScale;
var r = cfg.r;
var strokeStyle = cfg.lineStrokeStyle;
var fillStyle = cfg.circleFillStyle;

class TreeNode {
    constructor(arg) {
        this.right = null;
        this.left = null;
        this.key = arg.key;
        this.width = 0;
        this.parent = arg.parent || null;
        this.depth = arg.depth;
    }
    insert(key) {
        if (key < this.key) {
            if (this.left) {
                this.left.insert(key);
                this.width ++;
            } else {
                this.left = new TreeNode({key: key, depth: this.depth + 1, parent: this});
                return 1;
            }
        } else {
            if (this.right) {
                this.right.insert(key);
                this.width ++;
            } else {
                this.right = new TreeNode({key: key, depth: this.depth + 1, parent: this});
                return 1;
            }
        }
    }
    printRecurse(start, end,  parentX, parentY, ctx) {
        var mid = (end + start) / 2;
        var x = this._isLeftChild() ? mid + 2 : mid -2;
        this._drawCircle(x, scale * this.depth, r, ctx);
        this._drawLine(x, scale * this.depth - r, parentX, parentY + r, ctx);
        var leftWidth = 0;
        var rightWidth = 0;
        if (this.left) {
            leftWidth = this.left.width;
        }
        if (this.right) {
            rightWidth = this.right.width;
        }
        var leftMaxWidth = (end - start) * (leftWidth)/ (leftWidth + rightWidth);
        if (this.left) {
            this.left.printRecurse(start, start + leftMaxWidth, mid,  scale * this.depth, ctx)
        }
        if (this.right) {
            this.right.printRecurse(start + leftMaxWidth, end,  mid,  scale * this.depth, ctx)
        }
    }
    _drawBound(start, end, ctx) {
        ctx.strokeStyle = strokeStyle;
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.moveTo(start, this.depth * scale - 10);
        ctx.lineTo(start, this.depth * scale + 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.moveTo(end, this.depth * scale - 10);
        ctx.lineTo(end, this.depth * scale + 10);
        ctx.stroke();
    }
    _isLeftChild() {
        if (!this.parent) return true;  // root
        return this == this.parent.left;
    }
    _drawCircle(x, y, r, ctx) {
        ctx.lineWidth = 1;
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
    }
    _drawLine(x1, y1, x2, y2, ctx) {
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = strokeStyle;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    _updateWidth() {
        if (!this.parent) return;
        if (this._isLeftChild() && this.parent._isLeftChild()) {
            this.parent.width += 1;
        } else if (!this._isLeftChild() && !this.parent._isLeftChild()) {
            this.parent.width += 1;
        }
        if (this.parent)  this.parent._updateWidth();
    }
    _addWidth(unit) {
        this.width += unit;
        if (this.parent) this.parent._addWidth(unit);
    }
}

export default TreeNode;
