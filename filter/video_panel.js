import React from "react";
import THREE from "three";
import Video  from './video.js';

class VideoPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {mode: "custom"}
    }
    componentDidMount() {

    }
    componentWillUnmount() {

    }
    setMode(mode) {
        this.setState({mode: mode});
    }
    render() {
        var content = this.state.mode == "custom" ? <Video /> : <h1> Not there yet </h1>;
        return <div className="video-panel">
            <nav>
                <div className="nav-wrapper">
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li><a href="javascript://" className="azure" onClick={this.setMode.bind(this, 'custom')}>Custom Shader</a></li>
                        <li><a href="javascript://"  className="azure" onClick={this.setMode.bind(this, 'buildin')}>Build In</a></li>
                    </ul>
                </div>
            </nav>
            <div>
                {content}
            </div>
        </div>
    }
}

export default VideoPanel;