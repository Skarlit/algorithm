class Tree {
    constructor() {
        this.root = new TreeNode({
            pos: 0,
            key: 0,
            depth: 1
        })
    }
    inser(treeNode) {
        this.root.insert(treeNode);
    }
    print(width, ctx) {
        this.root.printRecurse(0, width, 500, 10, ctx)
    }
}

function Tree() {

}

