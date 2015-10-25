import React from "react";
import THREE from "three";

class Player {
    constructor(inputSrceen, outputScreen) {
        this.inputSrceen = inputSrceen;
        this.inputSrceen.autoplay = false;
        this.inputSrceen.controls = true;
        this.outputScreen = outputScreen;
        this.frameTexture = new THREE.Texture(this.inputSrceen);
        this.frameTexture.minFilter = THREE.NearestFilter;
        this.frameTexture.magFilter = THREE.NearestFilter;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({canvas: this.outputScreen, antialias: true});
    }
    play(url) {
        this.inputSrceen.src = url;
        this.inputSrceen.addEventListener('canplay', function(e) {
            this._initScreen(e.target.videoWidth, e.target.videoHeight);
            this._render();
        }.bind(this));
    }
    pause() {
        window.cancelRequestAnimationFrame(this.loopId);
    }
    _initScreen(width, height) {
        var left = width / -2,
            right = width / 2,
            top = height / 2,
            bottom = height / -2,
            near = 1,
            far = 1000;
        var topRightX = (right - left) / 2,
            topRightY = (top - bottom) / 2;
        this._initScreenMesh(topRightX, topRightY);
        this.camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
        this.camera.position.z = 1000;
    }
    _initScreenMesh(x, y) {
        var geometry = new THREE.BufferGeometry();
        var vertexPositions = [
            [-x, -y,  0],
            [ x, -y,  0],
            [ x,  y,  0],
            [ x,  y,  0],
            [-x,  y,  0],
            [-x, -y,  0]
        ];
        var vertices = new Float32Array( vertexPositions.length * 3 ); // three components per vertex
        for ( var i = 0; i < vertexPositions.length; i++ )
        {
            vertices[ i*3 + 0 ] = vertexPositions[i][0];
            vertices[ i*3 + 1 ] = vertexPositions[i][1];
            vertices[ i*3 + 2 ] = vertexPositions[i][2];
        }
        geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        var material = new THREE.ShaderMaterial( {
            uniforms: {
                frameTexture: {type: "t", value: this.frameTexture}
            },
            attributes: {},
            vertexShader: document.getElementById( 'vs' ).textContent,
            fragmentShader: document.getElementById( 'fs' ).textContent
        } );
        this.screenMesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.screenMesh);
    }
    _update() {
        this.frameTexture.needsUpdate = true;
    }
    _render() {
        this.loopId = requestAnimationFrame(this._render.bind(this));
        this._update();
        this.renderer.render(this.scene, this.camera);
    }
}

class PlayerView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {width: 480, height: 320}
    }
    componentDidMount() {
        this.player = new Player(React.findDOMNode(this.refs.input), React.findDOMNode(this.refs.output));
        this.player.play('./test/test.mp4');
    }
    render() {
        return <div id="player-wrapper" ref="wrapper" >
            <div className="relative screen-wrapper">
                <span className="screenLabel">Input</span>
                <video id="input" className="screen z-depth-3" ref="input"
                       width={this.state.width} height={this.state.height} style={{backgroundColor: "black"}}></video>
            </div>
            <div className="relative screen-wrapper">
                <span className="screenLabel">Output</span>
                <canvas id="output" className="screen z-depth-3" ref="output"
                        width={this.state.width} height={this.state.height} style={{backgroundColor: "black"}}></canvas>
            </div>
        </div>
    }
}

export default PlayerView;