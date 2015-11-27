import React from "react";
import THREE from "three";
import brace  from 'brace';
import AceEditor from 'react-ace';

import c  from 'brace/mode/c_cpp.js';
import theme from 'brace/theme/monokai.js';

var vsTemplate =`
varying vec2 vpos;
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    vpos = vec2(gl_Position);
}
`;

var fsTemplate =`
varying vec2 vpos;

vec2 offset = vec2(1.0, 1.0);
vec2 scale = vec2(0.5, 0.5);
float d = 0.001;
uniform sampler2D frameTexture;

void main() {
    vec2 texPos = scale*(vpos + offset);
    gl_FragColor = (texture2D(frameTexture, texPos) +
          texture2D(frameTexture, texPos + vec2(d, 0)) +
          texture2D(frameTexture, texPos + vec2(0, d)) +
          texture2D(frameTexture, texPos + vec2(-d, 0)) +
          texture2D(frameTexture, texPos + vec2(0, -d))) / 5.0;
}
`;

class Video extends React.Component {
    constructor(props) {
        super(props);
        this.state  = {vs: vsTemplate, fs: fsTemplate};
    }
    componentDidMount() {

    }
    componentWillUnmount() {

    }

    render() {
        return <div className="video-edit">
            <div id="vs-edit">
                <AceEditor
                    mode="c_cpp"
                    theme="monokai"
                    onChange={function() {}}
                    name="VS_SHADER"
                    value={this.state.vs}
                    showPrintMargin = {false}
                    highlightActiveLine={true}
                    showGutter={false}
                    editorProps={{$blockScrolling: true}}
                    />
            </div>
            <div id="fs-edit">
                <AceEditor
                    mode="c_cpp"
                    theme="monokai"
                    onChange={function() {}}
                    name="FS_SHADER"
                    value={this.state.fs}
                    showPrintMargin = {false}
                    showGutter={false}
                    highlightActiveLine={true}
                    editorProps={{$blockScrolling: true}}
                    />
            </div>
        </div>
    }
}

export default Video;