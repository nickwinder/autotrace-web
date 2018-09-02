import React, {Component} from 'react';
import 'babel-polyfill';
import 'rc-slider/assets/index.css';
import './App.css';
import {SliderInternal} from './Slider.js';
import {ASwitch} from "./Switch.js";
import {ImageUpload} from './ImageFile.js';
import WasmLoader from './WasmLoader.js'

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
        try {
            let imageInputPromise = fetch("public/test.png").then(d =>
                d.arrayBuffer(),
            );

            let wasmLoader = new WasmLoader();
            wasmLoader.loadNativeModule()
                .then(async ({nativeModule}) => {
                    const byteArray = new Uint8Array(await imageInputPromise);

                    // Allocate on Emscripten heap
                    const dataPtr = nativeModule._malloc(byteArray.byteLength);

                    // Copy data to Emscripten heap (directly accessed from Module.HEAPU8)
                    const dataHeap = new Uint8Array(nativeModule.HEAPU8.buffer, dataPtr, byteArray.byteLength);
                    dataHeap.set(byteArray);

                    try {
                        let result = nativeModule.autotraceRun(
                            dataHeap.byteOffset,
                            dataHeap.byteLength,
                            JSON.stringify({}),
                            JSON.stringify({}),
                            JSON.stringify({})
                        );
                        if (result.success === true) {
                            console.log("File Converted");

                            let fileSizeOutput = nativeModule.outputFileSize();
                            if (fileSizeOutput.success) {
                                console.log("File Size : " + fileSizeOutput.value);

                                // Now I can make a new buffer!
                                const byteArrayOutput = new Uint8Array(fileSizeOutput.value);

                                // Allocate on Emscripten heap
                                const dataPtrOutput = nativeModule._malloc(byteArrayOutput.byteLength);

                                // Copy data to Emscripten heap (directly accessed from Module.HEAPU8)
                                const outputFileHeap = new Uint8Array(nativeModule.HEAPU8.buffer, dataPtrOutput, byteArrayOutput.byteLength);
                                outputFileHeap.set(byteArrayOutput);

                                try {
                                    let outputFileResult = nativeModule.getOutputFile(outputFileHeap.byteOffset, outputFileHeap.byteOffset);
                                    if (outputFileResult.success) {
                                        const enc = new TextDecoder("utf-8");
                                        let stringOutput = enc.decode(outputFileHeap);

                                        // Add a view box in there
                                        const widthRegex = 'width=\"([0-9]*)\"';
                                        const widthFound = stringOutput.match(widthRegex);

                                        const heightRegex = 'height=\"([0-9]*)\"';
                                        const heightFound = stringOutput.match(heightRegex);

                                        if (widthFound.length > 0 && heightFound.length > 0) {
                                            stringOutput = stringOutput.replace(new RegExp("<svg"), "<svg viewBox=\"0 0 " + widthFound[1] + " " + heightFound[1] + "\"");
                                        }

                                        this.setState({outputFile: stringOutput});

                                    } else {
                                        console.log("output file get error = " + outputFileResult.error);
                                    }
                                } finally {
                                    nativeModule._free(outputFileHeap.byteOffset)
                                }

                            } else {
                                console.log("file Size error = " + fileSizeOutput.error);
                            }
                        } else {
                            console.log("Run Error = " + result.error);
                        }
                    } finally {
                        nativeModule._free(dataHeap.byteOffset)
                    }
                });
        }
        catch (e) {
            console.error(e.message);
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
