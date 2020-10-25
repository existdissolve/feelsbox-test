import React, {Component} from 'react';
import io from 'socket.io-client';
import ReactDOM from 'react-dom';
import {hot} from 'react-hot-loader/root';
import {get} from 'lodash';
import Color from 'color';

import config from './../config';

const env = process.env.NODE_ENV;
const apiHost = get(config, `${env}.apiHost`);
const socket = io(apiHost, {forceNew: true});
const mockFeel = {
    duration: 500,
    reverse: true,
    repeat: true,
    frames: [{
        brightness: 1,
        pixels: [{
            color: '999999',
            position: 0
        }, {
            color: '999999',
            position: 9
        }, {
            color: '999999',
            position: 10
        }, {
            color: '999999',
            position: 11
        }, {
            color: '999999',
            position: 17
        }, {
            color: '999999',
            position: 18
        }, {
            color: '999999',
            position: 25
        }, {
            color: '000f59',
            position: 20
        }, {
            color: '000fff',
            position: 29
        }, {
            color: '000f59',
            position: 38
        }, {
            color: '000fff',
            position: 47
        }, {
            color: '000fff',
            position: 27
        }, {
            color: '000f59',
            position: 36
        }, {
            color: '000fff',
            position: 45
        }, {
            color: '000f59',
            position: 54
        }, {
            color: '000fff',
            position: 63
        }, {
            color: '000f59',
            position: 34
        }, {
            color: '000fff',
            position: 43
        }, {
            color: '000f59',
            position: 52
        }, {
            color: '000fff',
            position: 61
        }]
    }, {
        brightness: .5,
        pixels: [{
            color: '999999',
            position: 0
        }, {
            color: '999999',
            position: 9
        }, {
            color: '999999',
            position: 10
        }, {
            color: '999999',
            position: 11
        }, {
            color: '999999',
            position: 17
        }, {
            color: '999999',
            position: 18
        }, {
            color: '999999',
            position: 25
        }, {
            color: '000fff',
            position: 20
        }, {
            color: '000f59',
            position: 29
        }, {
            color: '000fff',
            position: 38
        }, {
            color: '000f59',
            position: 47
        }, {
            color: '000f59',
            position: 27
        }, {
            color: '000fff',
            position: 36
        }, {
            color: '000f59',
            position: 45
        }, {
            color: '000fff',
            position: 54
        }, {
            color: '000f59',
            position: 63
        }, {
            color: '000fff',
            position: 34
        }, {
            color: '000f59',
            position: 43
        }, {
            color: '000fff',
            position: 52
        }, {
            color: '000f59',
            position: 61
        }]
    }]
};

const sleep = duration => {
    return new Promise(resolve => {
        setTimeout(resolve, duration);
    });
};

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        /*
        setTimeout(() => {
            this.onFeel({feel: mockFeel});
        }, 100);
        */
        socket.on('emote', this.onFeel);
    }

    onFeel = async data => {
        const {feel} = data;
        const {duration: defaultDuration = 1000, frames = [], repeat = false, reverse = false} = feel;

        if (frames.length === 1) {
            const [frame] = frames;

            this.setState({frame});
        } else {
            const loop = async(curFrames, skip) => {
                let idx = -1;

                for (const frame of curFrames) {
                    idx++;

                    if (idx === 0 && skip) {
                        continue;
                    }

                    const {duration: frameDuration} = frame;
                    const duration = frameDuration || defaultDuration;
                    this.setState({frame});

                    await sleep(duration);
                }

                if (repeat) {
                    const frames = reverse ? curFrames.reverse() : curFrames;

                    await loop(frames, reverse);
                }
            };

            await loop(frames);
        }
    };

    render() {
        const {frame} = this.state;

        if (frame) {
            const {brightness = 100, pixels = []} = frame;
            let position = -1;

            return (
                <div className="canvas">
                    {Array.from(Array(8).keys()).map((row, rowIdx) => {
                        return (
                            <div className="row" key={rowIdx}>
                                {Array.from(Array(8).keys()).map((col, colIdx) => {
                                    position++;

                                    const pixel = pixels.find(pix => pix.position === position);
                                    const rawHex = get(pixel, 'color');

                                    let color;

                                    if (rawHex) {
                                        const rawColor = Color(`#${rawHex}`);
                                        const [r, g, b] = rawColor.rgb().array();
                                        const alpha = brightness / 100;

                                        color = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                                    } else {
                                        color = 'rgb(0, 0, 0)';
                                    }

                                    return (
                                        <div className="cell" key={colIdx} style={{background: color}}> </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            );
        } else {
            return <div>Feelbox Sandbox</div>;
        }
    }
}

ReactDOM.render(<App />, document.getElementById('app'));

export default hot(App);