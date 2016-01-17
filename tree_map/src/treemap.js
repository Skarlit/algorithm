/*
   TreeMap supports interface:

 */

class TreeMap {
   constructor(leafSize, nodeSize) {
      this.leafSize = leafSize;
      this.nodeSize = nodeSize;
      this.root = new Leaf(this.leafSize, null);
   }
   get(idx) {
      return this.root.get(idx);
   }
   set(idx, val)  {
      return this.root.set(idx, val);
   }
   insert(idx, val) {
      this.root.insert(idx, val);
   }
   batchInsert(idx, val) {
      return true;
   }
   push(val) {
      this.root._push(val);
   }
   length() : number {
   }
}

class Node {
   constructor(maxSize, parent) {
      this.maxSize = maxSize;
      this.splitSize = parseInt(maxSize / 2);
      this.parent = parent;
      this.childrenSize = [];
      this.children = [];
   }
   split() {

   }
   shouldSplit() {

   }
}

class InternalNode extends Node {
   get(reduced_idx) {
      for(var i = 0; i < this.childrenSize.length; i++) {
         if (reduced_idx < this.childrenSize[i]) return this.children[i].get(reduced_idx);
         reduced_idx -= this.childrenSize[i];
      }
      return null;
   }
   set(reduced_idx, val)  {
      for(var i = 0; i < this.childrenSize.length; i++) {
         if (reduced_idx < this.childrenSize[i]) return this.children[i].get(reduced_idx, val);
         reduced_idx -= this.childrenSize[i];
      }
      return null;
   }
   _push(val) {
      this.childrenSize[this.childrenSize.length - 1] = this.children._push(val);
      return this.getNodeSize();
   }
   getNodeSize() {
      return this.childrenSize.reduce(function(pv, cv) { return pv + cv; }, 0);
   }
}

class Leaf extends Node {
   get(reduced_idx) {
      return this.children[reduced_idx];
   }
   set(reduced_idx, val) {
      if (reduced_idx >= this.children.length) return false;
      this.children[reduced_idx] = val;
      return true;
   }
   _push(val) {
      this.children.push(val);
      this.shouldSplit();
   }
   getNodeSize() {
      return this.children.length;
   }
}