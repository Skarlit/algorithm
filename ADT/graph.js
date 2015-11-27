class DiGraph {
    constructor(v) {
        this.adjList =new Array(v);
        for(var i = 0; i < v; i++) this.adjList[i] = [];
        this.vertices = v;
        this.edge = 0;
    }
    v() {
        return this.vertices;
    }
    e() {
        return this.edge;
    }
    addEdge(v1, v2) {
        this.adjList[v1].push(v2);
        this.edge ++;
    }
    adj(v) {
        return this.adjList[v];
    }
}

export {DiGraph}