class TreeNode {
    radius= 2;
    depthScale= 30;
    constructor(arg) {
        this.left = null;
        this.right = null;
        this.key = arg.key;
        this.parent = null;
        this.depth = arg.depth;
        this.width = 1;
    }
    insert = function (treeNode) {
        if (treeNode.key < this.key) {
            if (this.left) {
                this.left.insert(treeNode);
                this.width ++;
            } else {
                this.left = treeNode;
                this.left.parent = this;
                this.left.depth = this.depth + 1;
                return 1;
                //this.left._updateWidth();
            }
        } else {
            if (this.right) {
                this.right.insert(treeNode);
                this.width ++;
            } else {
                this.right = treeNode;
                this.right.parent = this;
                this.right.depth = this.depth + 1;
                return 1;
                //this.right._updateWidth();
            }
        }
    }
    printRecurse = function(start, end,  parentX, parentY, ctx) {
        var mid = (end + start) / 2;
        //console.log(start);
        //console.log(end);
        this._drawCircle(mid, this.depthScale * this.depth, this.radius, ctx);
        this._drawLine(mid, this.depthScale * this.depth - this.radius, parentX, parentY + this.radius, ctx);
        //this._drawBound(start, end, ctx);
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
            this.left.printRecurse(start, start + leftMaxWidth, mid,  this.depthScale * this.depth, ctx)
        }
        if (this.right) {
            this.right.printRecurse(start + leftMaxWidth, end,  mid,  this.depthScale * this.depth, ctx)
        }
    }
    _drawBound = function(start, end, ctx) {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.moveTo(start, this.depth * this.depthScale - 10);
        ctx.lineTo(start, this.depth * this.depthScale + 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.moveTo(end, this.depth * this.depthScale - 10);
        ctx.lineTo(end, this.depth * this.depthScale + 10);
        ctx.stroke();
        ctx.lineWidth = 1;
    }
    _isLeftChild = function () {
        if (!this.parent) return true;  // root
        return this == this.parent.left;
    },
    _drawCircle = function (x, y, r, ctx) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        // ctx.fillText(this.width, x, y);
    },
    _drawLine = function (x1, y1, x2, y2, ctx) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeWidth = 1;
        ctx.stroke();
    },
    _updateWidth = function() {
        if (!this.parent) return;
        if (this._isLeftChild() && this.parent._isLeftChild()) {
            this.parent.width += 1;
        } else if (!this._isLeftChild() && !this.parent._isLeftChild()) {
            this.parent.width += 1;
        }
        if (this.parent)  this.parent._updateWidth();
    }
    _addWidth = function(unit) {
        this.width += unit;
        if (this.parent) this.parent._addWidth(unit);
    }
}

export TreeNode;
