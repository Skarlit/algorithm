import Node from "./node";


class Tree {
    constructor(string) {
        this.root = new Node(string);
        this.padding = 15;
        this.maxX = []; // store max x for each level;
    }
    insert(string) {
        this.root.insert(string);
    }
    printLevel() {
        var queue = [this.root];
        var head = 0;
        while(head < queue.length) {
            console.log(queue[head]);
            for(var i = 0; i < queue[head].children.length; i++) {
                queue.push(queue[head].children[i]);
            }
            head++;
        }
    }
    printDepth() {
        this.visit(this.root, 0);
    }
    visit(node, depth) {
        // Handle leaves
        if (!node.children || node.children.length == 0) {
            if (this.maxX[depth]) {
                node.x = this.maxX[depth] + this.padding;
                this.maxX[depth] += node.val.length;
            } else {
                this.maxX[depth] = 0;
                node.x = 0;
            }
            return;
        }
        for(var i = 0; i < node.children.length; i++) {
            this.visit(node.children[i], depth + 1);
        }
        // Handle parent;
        if (this.maxX[depth]) {
            var x = (node.children[0] + node.children[node.children.length - 1]) /  2;
            node.x = x;
            this.maxX[depth] = node.children[node.children.length - 1] + this.padding;
        } else {
            this.maxX[depth] = 0;
            node.x = 0;
        }
    }
}

export default Tree;