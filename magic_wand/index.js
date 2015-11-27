import {DiGraph} from "../ADT/graph.js";
import React from "react";
import $ from 'jquery';

var Store = {
    toolBarView: null,
    screenView: null,
    toolBarState: {
        imageUrl: "../../../img/miku.jpg",
        threshold: 10
    },
    update: function() {
        this.toolBarView.setState(Store.toolBarState);
        this.screenView.setState(Store.toolBarState);
    }
};


var App = React.createClass({
    render: function() {
        return <div className="panel">
            <div className="heading">
                <span className="title">Magic Wand v0.01</span>
            </div>
            <div className="content">
                <div style={{fontSize: '14px', textAlign: 'center', margin: '10px auto'}}>
                    Defect: I have yet to figure out a way to reduce and smooth the edges of selection. (this is also highly UNoptimized)
                </div>
                {this.props.children}
            </div>
        </div>
    }
});


var ToolBar = React.createClass({
    getInitialState: function() {
        return Store.toolBarState;
    },
    componentDidMount: function() {
        Store.toolBarView = this;
    },
    thresholdChange: function(e) {
        Store.toolBarState.threshold = e.target.value;
        Store.update();
    },
    setImageUrl: function() {
        Store.toolBarState.imageUrl = this.refs.imageUrl.getDOMNode().value;
        Store.update();
    },

    render: function() {
        return <div className="toolbar">
            <div className="threshold">
                <span>Threshold: </span>
                <div className="input-control range">
                      <input type="range" onInput={this.thresholdChange} defaultValue={this.state.threshold} min={1} max={16} step={0.1}/>
                </div>
                <span>
                    {this.state.threshold}
                </span>
            </div>

        </div>
        //<div className="input-control text" dataRole="input">
        //    <input type="text" ref="imageUrl" />
        //        <button className="button" onClick={this.setImageUrl}><span className="mif-search">Load</span></button>
        //</div>
    }
});

var Screen = React.createClass({
    getInitialState: function() {
        return {imageUrl: Store.toolBarState.imageUrl};
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        return this.state.imageUrl != nextState.imageUrl;
    },
    componentDidMount: function() {
        Store.screenView = this;
        this.wand = new MagicWand(this.state.imageUrl, this.refs.image.getDOMNode(), this.refs.overlay.getDOMNode(),  this.refs.screen.getDOMNode());
    },
    componentDidUpdate: function() {
        this.wand.destroy();
        this.wand = null;
        this.wand = new MagicWand(this.state.imageUrl, this.refs.image.getDOMNode(), this.refs.overlay.getDOMNode(),  this.refs.screen.getDOMNode());
    },
    render: function() {
        return <div className="screen" ref="screen">
            <canvas ref="image" style={{zIndex: 10}} width={800} height={600}></canvas>
            <canvas ref="overlay" style={{zIndex: 100, backgroundColor: "rgba(0,0,0,0)"}}  width={800} height={600}></canvas>
            <div className="hud"> </div>
        </div>
    }
});


class MagicWand {
    constructor(imageUrl, image, overlay, screen) {
        this.image = image;
        this.overlay = overlay;
        this.screen = screen;
        this.imgCtx = image.getContext('2d');
        this.overlayCtx = overlay.getContext('2d');
        this.load(imageUrl);
        this.bindEvents();
        this.hud = screen.getElementsByClassName('hud')[0];
    }
    destroy() {
        $(this.overlay).off('click');
        $(this.overlay).off('mousemove');
        this.image = null;
        this.overlay = null;
        this.screen = null;
        this.imgCtx = null;
        this.overlayCtx = null;
        this.graph = null;
    }
    bindEvents() {
        $(this.overlay).on('click', function(e) {
            var rect = this.overlay.getBoundingClientRect();
            this.drawOverLay(this.dfs(parseInt(e.clientX - rect.left)  + parseInt(e.clientY - rect.top) * this.w));
        }.bind(this));

        $(this.overlay).on('mousemove', function(e) {
            var rect = this.overlay.getBoundingClientRect();
            var x = parseInt(e.clientX - rect.left);
            var y = parseInt(e.clientY - rect.top);
            var basePos = (x + y * this.w) * 4;
            this.hud.textContent = '(' +  x  + "," + y + ') rgb(' + [this.pixels[basePos], this.pixels[basePos+1],this.pixels[basePos + 2]].join(',') + ')';
        }.bind(this))
    }
    load(url) {
        var imageObj = new Image();
        imageObj.onload = function() {
            this.drawImage(imageObj);
            this.buildGraph();
        }.bind(this);
        imageObj.src = url;
    }
    drawImage(img) {
        this.resize(img.width, img.height);
        this.imgCtx.drawImage(img, 0, 0);
        this.pixels =this.imgCtx.getImageData(0, 0, this.image.width, this.image.height).data;
    }
    drawOverLay(input) {  // 0 : border, 1: interior
        this.overlayCtx.clearRect(0, 0, this.w, this.h);
        this.overlayCtx.fillStyle = 'red';
        var border = Object.keys(input.border);
        for(var i = 0; i < border.length; i++) {
            this.overlayCtx.fillRect(border[i] % this.w + 0.5, border[i] /this.w + 0.5, 2, 2);
        }
    }
    _overlayAnimateLoop() {

    }
    resize(w, h) {
        this.overlay.width = w;
        this.image.width = w;
        this.screen.style['width'] = w + 'px';
        this.overlay.height = h;
        this.image.height = h;
        this.screen.style['height'] = h + 'px';
        this.w = w;
        this.h = h;
    }
    buildGraph() {
        this.graph = new DiGraph(this.w * this.h);
        var node;
        for(var y = 1; y < this.h - 1; y++) {
            for(var x = 1; x < this.w - 1; x++) {
                node = x + y * this.w;
                this.graph.addEdge(node, node + 1);
                this.graph.addEdge(node, node - 1);
                //this.graph.addEdge(node, node - this.w + 1);
               // this.graph.addEdge(node, node - this.w - 1);
                this.graph.addEdge(node, node - this.w);
               // this.graph.addEdge(node, node + this.w + 1);
               // this.graph.addEdge(node, node + this.w - 1);
                this.graph.addEdge(node, node + this.w);
            }
        }
    }
    dist(px1, px2) {
        var p1 = [this.pixels[px1], this.pixels[px1 + 1], this.pixels[px1 + 2]];
        var p2 = [this.pixels[px2], this.pixels[px2 + 1], this.pixels[px2 + 2]];

        //return  (2+ (p1[0] + p2[0]) / 512) * Math.pow(p1[0] - p2[0], 2) + 4 * Math.pow(p1[1] - p2[1], 2) + (2 + 1 -  (p1[0] + p2[0]) / 512) * Math.pow(p1[2] - p2[2], 2);
        return  Math.pow(p1[0] - p2[0], 2) +  Math.pow(p1[1] - p2[1], 2) +  Math.pow(p1[2] - p2[2], 2);
    }
    dfs(startPos) {
        var stack = [startPos];
        var visited = {};
        var border = {};
        var interior = {};
        var epsilon = Store.toolBarState.threshold;
        var current;
        var adj;
        while (stack.length > 0) {
            current = stack.pop();
            visited[current] = true;
            adj = this.graph.adj(current);
            for(var i = 0; i < adj.length; i++) {
                if (this.dist(current * 4, adj[i] * 4) < epsilon * epsilon) {
                    if (!visited[adj[i]]) stack.push(adj[i]);
                    interior[adj[i]] = true;
                } else {
                    border[adj[i]] = true;
                }
            }
        }
        return {border: border, interior: interior};
    }
}

window.onload = function() {
    React.render(
        <App>
          <ToolBar />
          <Screen />
        </App>,
        document.body);
}


