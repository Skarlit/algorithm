import TreeNode from "./node";

class Tree {
    constructor() {
        this.root = new TreeNode({
            pos: 0,
            key: 0,
            depth: 1
        })
    }
    insert(treeNode) {
        this.root.insert(treeNode);
    }
    print(width, ctx) {
        this.root.printRecurse(0, width, width / 2, 10, ctx)
    }
}

export default Tree;