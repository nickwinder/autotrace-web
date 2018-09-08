import React, {Component} from 'react';
import 'babel-polyfill';
import 'rc-slider/assets/index.css';
import './App.css';
import {SliderInternal} from './Slider.js';
import {ASwitch} from "./Switch.js";
import {ImageUpload} from './ImageFile.js';
import {AutotraceNative} from './AutotraceNative.js'

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="container">

                    <div className="right-div">
                        <div>
                            <p>Charcode</p>
                            <SliderInternal/>
                        </div>
                        <div>
                            <p>Color Count</p>
                            <SliderInternal/>
                        </div>
                        <div>
                            <p>Corner Always Threshold</p>
                            <SliderInternal/>
                        </div>
                        <div>
                            <p>Remove Adjacent Corners</p>
                            <ASwitch/>
                        </div>
                        <div>
                            <p>Corner Surround</p>
                            <SliderInternal/>
                        </div>
                        <div>
                            <p>Corner Threshold</p>
                            <SliderInternal/>
                        </div>
                        <div>
                            <p>Error Threshold</p>
                            <SliderInternal/>
                        </div>
                        <div>
                            <p>Tangent Surround</p>
                            <SliderInternal/>
                        </div>
                        <div>
                            <p>Despeckle Level</p>
                            <SliderInternal/>
                        </div>
                        <div>
                            <p>Despeckle Tightness</p>
                            <SliderInternal/>
                        </div>
                        <div>
                            <p>Noise Removal</p>
                            <SliderInternal/>
                        </div>
                        <div>
                            <p>Centerline</p>
                            <ASwitch/>
                        </div>
                        <div>
                            <p>Preserve Width</p>
                            <ASwitch/>
                        </div>
                        <div>
                            <p>Width Weight Factor</p>
                            <SliderInternal/>
                        </div>

                    </div>

                    <div className="left-div">
                        <WasmButton/>
                        <ImageUpload/>
                    </div>

                </div>
            </div>
        );
    }
}

class WasmButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {outputFile: <div id='hello'/>};
    }

    async handleClick() {
        let imageInputPromise = fetch("public/test.png").then(d =>
            d.arrayBuffer(),
        );

        let autotraceNative = new AutotraceNative();
        await autotraceNative.loadModule();
        if (await autotraceNative.convertImage(imageInputPromise)) {
            autotraceNative.retrieveConversion()
                .then(
                    resolve => this.setState({outputFile: resolve}),
                    reason => console.error(reason)
                );
        } else {
            console.error("Conversion Error!")
        }

    }

    render() {
        return (
            <label htmlFor="wasm-button">
                <button onClick={(e) => this.handleClick(e)}>
                    Click me
                </button>
                <div dangerouslySetInnerHTML={{__html: this.state.outputFile}}/>
            </label>
        );
    }
}

export default App;
