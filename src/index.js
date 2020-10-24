import React, {Component} from 'react';
import io from 'socket.io-client';
import ReactDOM from 'react-dom';
import {hot} from 'react-hot-loader/root';
import {get} from 'lodash';

const socket = io('https://localhost:3000', {forceNew: true});

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        socket.on('emote', feeling => {
            console.log(feeling);
        });
    }

    render() {
        return <div>DER GOOGLE</div>;
    }
}

ReactDOM.render(<App />, document.getElementById('app'));

export default hot(App);