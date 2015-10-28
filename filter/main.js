import React from "react";
import $ from "jquery";
import Player from "./player.js";
import Video from "./video.js";
import VideoPanel from "./video_panel.js";

window.$ = $;
window.jQuery = $;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {videoMode: true};
    }
    componentDidMount() {
        $('ul.tabs').tabs();
    }
    videoMode() {this.setState({videoMode: true})}
    audioMode() {this.setState({videoMode: false})}
    render() {
        var tabContent = this.state.videoMode ? <VideoPanel /> : <div>Audio</div>;
        return <div  className="row">
            <nav>
                <div className="nav-wrapper">
                    <a href="#" className="brand-logo azure">Video Filter</a>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li><a href="javascript://" className="azure">Open</a></li>
                        <li><a href="javascript://"  className="azure">Export</a></li>
                    </ul>
                </div>
            </nav>
            <div className="col s10 offset-s1" style={{"margin-top": "20px"}}>
              <Player />
            </div>
            <div className="col s10 offset-s1" style={{"margin-top": "30px"}}>
                <div className="row">
                    <div className="col s12">
                        <ul className="tabs">
                            <li className="tab col s3"><a href="#test1"  className="azure" onClick={this.audioMode.bind(this)}>Audio</a></li>
                            <li className="tab col s3"><a className="active azure" href="#test2" onClick={this.videoMode.bind(this)}>Video</a></li>
                        </ul>
                    </div>
                    <div  className="col s12">
                        {tabContent}
                    </div>
                </div>
            </div>
        </div>
    }
}


window.onload = function() {
    React.render(<App />, document.body);
};