

class Node {
    constructor(string) {
        this.val = string;
        this.children = [];
    }
    insert(string) {
        if (Math.random() > 0.5 || this.children.length == 0) {
            this.children.push(new Node(string));
        } else {
            this.children[parseInt(Math.random() *  this.children.length)].insert(string);
        }
    }
}

export default Node;