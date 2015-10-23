import React from "react";
import Player from "./player.js"

class App extends React.Component {
    constructor(props) {
        super(props);

    }
    render() {
        return <div>
            <Player width="800" height="600"/>
        </div>
    }
}


window.onload = function() {
    React.render(<App />, document.body);
};