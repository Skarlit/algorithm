import React from "react";
import THREE from "three";

class Player {
    constructor() {
        this.videoSource = document.createElement('video');
        this.videoSource.src ="./test/test.mp4";
        this.videoSource.autoplay = false;
        this.texture = new THREE.Texture(this.videoSource);
        this.texture.minFilter = THREE.NearestFilter;
        this.texture.magFilter = THREE.NearestFilter;
        this.scene = new THREE.Scene();
    }
    initScreen(canvas, width, height) {
        this.width = width;
        this.height = height;
        var left = width / -2,
            right = width / 2,
            top = height / 2,
            bottom = height / -2,
            near = 1,
            far = 1000;
        var topRightX = (right - left) / 2,
            topRightY = (top - bottom) / 2;
        this.videoSource.width = width;
        this.videoSource.height = height;
        document.body.appendChild(this.videoSource);
        this.videoSource.controls = true;
        this._initScreenMesh(topRightX, topRightY);
        this._initLighting();
        this.camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
        this.camera.position.z = 1000;

        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas
        });
    }
    play() {
        this.videoSource.play();
        this._render();
    }
    pause() {
        window.cancelRequestAnimationFrame(this.loopId);
    }
    _initLighting() {
        var light = new THREE.AmbientLight( 0xffffff );
        this.scene.add( light );
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
                frameTexture: {type: "t", value: this.texture}
            },
            attributes: {

            },
            vertexShader: document.getElementById( 'vs' ).textContent,
            fragmentShader: document.getElementById( 'fs' ).textContent
        } );
        this.screenMesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.screenMesh);
    }
    _update() {
        this.texture.needsUpdate = true;
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
        this.player = new Player();
    }
    componentDidMount() {
        this.player.initScreen(React.findDOMNode(this.refs.screen), this.props.width, this.props.height);
        //this.player.play();
    }
    render() {
        return <div ref="wrapper" width={this.props.width} height={this.props.height}>
            <canvas ref="screen" width={this.props.width} height={this.props.height} style={{backgroundColor: "black"}}></canvas>
        </div>
    }
}

export default PlayerView;