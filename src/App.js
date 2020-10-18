import React, {Component} from 'react';
import 'babel-polyfill';
import 'rc-slider/assets/index.css';
import './App.css';
import {SliderInternal} from './Slider.js';
import {SwitchInternal} from "./Switch.js";
import {autotraceNative} from './Autotrace/AutotraceNative.js'
import type {FittingOptions} from "./Autotrace/FittingOptions";

class App extends Component {
    constructor() {
        super();
        this.state = {outputFile: null, isConversionRunning: false, isImageConverted: false ,selectedFile: null};

        this.setFittingProperty = this.setFittingProperty.bind(this);
    }

    async setFittingProperty(property: FittingOptions) {
        autotraceNative.setFittingOptionsProperty({...property});
        await this.convertImage();
    }

    async loadImageFile(file) {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = () => {
                resolve(reader.result);
            }
        });
    }

    async convertImage() {
        this.setState({
            isConversionRunning: true,
            isImageConverted: false
        });

        if (await autotraceNative.convertImage(await this.loadImageFile(this.state.selectedFile))) {
            autotraceNative.retrieveConversion()
                .then(
                    resolve => this.setState({outputFile: resolve}),
                    reason => console.error(reason)
                );
        } else {
            console.error("Conversion Error!");
        }
        this.setState({
            isConversionRunning: false,
            isImageConverted: true
        });
    }

    onChangeHandler(event){
        console.log(event.target.files[0])
        this.setState({
            selectedFile: event.target.files[0]
        });
    }

    renderImageState() {
        if(this.state.selectedFile == null) {
            return <div><p>Select File</p></div>;
        } else if(!this.state.isImageConverted) {
            return <div><p>Ready To Convert</p></div>;
        } else if(this.state.isConversionRunning) {
            return <div><p>Converting</p></div>;
        }
    }

    render() {
        return (
            <div className="App">
                <div className="container">

                    <div className="right-div">
                        <div>
                            <p>Charcode</p>
                            <SliderInternal
                                min={0}
                                max={255}
                                defaultValue={15}
                                onAfterChange={(value) => this.setFittingProperty({charcode: value})}/>
                        </div>
                        <div>
                            <p>Color Count</p>
                            <SliderInternal
                                min={0}
                                max={255}
                                defaultValue={15}
                                onAfterChange={(value) => this.setFittingProperty({color_count: value})}/>
                        </div>
                        <div>
                            <p>Corner Always Threshold</p>
                            <SliderInternal
                                min={0.0}
                                max={360}
                                defaultValue={60}
                                onAfterChange={(value) => this.setFittingProperty({corner_always_threshold: value})}/>
                        </div>
                        <div>
                            <p>Remove Adjacent Corners</p>
                            <SwitchInternal
                                onChange={(value) => this.setFittingProperty({remove_adjacent_corners: value})}/>
                        </div>
                        <div>
                            <p>Corner Surround</p>
                            <SliderInternal
                                min={0.0}
                                max={360}
                                defaultValue={60}
                                onAfterChange={(value) => this.setFittingProperty({corner_surround: value})}/>
                        </div>
                        <div>
                            <p>Corner Threshold</p>
                            <SliderInternal
                                min={0.0}
                                max={360}
                                defaultValue={60}
                                onAfterChange={(value) => this.setFittingProperty({corner_threshold: value})}/>
                        </div>
                        <div>
                            <p>Error Threshold</p>
                            <SliderInternal
                                min={0.0}
                                max={360}
                                defaultValue={60}
                                onAfterChange={(value) => this.setFittingProperty({error_threshold: value})}/>
                        </div>
                        <div>
                            <p>Filter Iterations</p>
                            <SliderInternal
                                min={0}
                                max={20}
                                defaultValue={4}
                                onAfterChange={(value) => this.setFittingProperty({filter_iterations: value})}/>
                        </div>
                        <div>
                            <p>Line Reversion Threshold</p>
                            <SliderInternal
                                min={0}
                                max={20}
                                defaultValue={4}
                                onAfterChange={(value) => this.setFittingProperty({line_reversion_threshold: value})}/>
                        </div>
                        <div>
                            <p>Line Threshold</p>
                            <SliderInternal
                                min={0}
                                max={255}
                                defaultValue={1}
                                onAfterChange={(value) => this.setFittingProperty({line_threshold: value})}/>
                        </div>
                        <div>
                            <p>Tangent Surround</p>
                            <SliderInternal
                                min={0}
                                max={10}
                                defaultValue={3}
                                onAfterChange={(value) => this.setFittingProperty({tangent_surround: value})}/>
                        </div>
                        <div>
                            <p>Despeckle Level</p>
                            <SliderInternal
                                min={0}
                                max={20}
                                defaultValue={0}
                                onAfterChange={(value) => this.setFittingProperty({despeckle_level: value})}/>
                        </div>
                        <div>
                            <p>Despeckle Tightness</p>
                            <SliderInternal
                                min={0.0}
                                max={8.0}
                                defaultValue={2.0} step={0.1}
                                onAfterChange={(value) => this.setFittingProperty({despeckle_tightness: value})}/>
                        </div>
                        <div>
                            <p>Noise Removal</p>
                            <SliderInternal
                                min={0.0}
                                max={1.0}
                                defaultValue={0.99} step={0.01}
                                onAfterChange={(value) => this.setFittingProperty({noise_removal: value})}/>
                        </div>
                        <div>
                            <p>Centerline</p>
                            <SwitchInternal onChange={(value) => this.setFittingProperty({centerline: value})}/>
                        </div>
                        <div>
                            <p>Preserve Width</p>
                            <SwitchInternal onChange={(value) => this.setFittingProperty({preserve_width: value})}/>
                        </div>
                        <div>
                            <p>Width Weight Factor</p>
                            <SliderInternal
                                min={0}
                                max={60}
                                defaultValue={2}
                                onAfterChange={(value) => this.setFittingProperty({width_weight_factor: value})}/>
                        </div>

                    </div>

                    <div className="left-div">
                        {this.renderImageState()}
                        {!this.state.isConversionRunning && (<div dangerouslySetInnerHTML={{__html: this.state.outputFile}}/>)}
                        <input type="file" onChange={(event) => this.onChangeHandler(event)}/>
                    </div>

                </div>
            </div>
        );
    }
}

export default App;
