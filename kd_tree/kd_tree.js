


class KdTree {
    constructor(coord) {
        this.root = new KdNode(coord);
    }
}

class KdNode {
    construct(coord) {
        this.coord = coord;
        this.left = null;
        this.right = null;
    }
    compareTo(coord, index) {
        return this.coord[index] > coord[index];
    }
    insert(coord, index) {
        if (this.compareTo(coord, index)) {
            if (this.left == null) {
                this.left = new KdNode(coord);
            } else {
                this.left.insert(coord, (index + 1) % coord.length);
            }
        } else {
            if (this.right == null) {
                this.right = new KdNode(coord);
            } else {
                this.right.insert(coord, (index + 1) % coord.length);
            }
        }
    }
}
