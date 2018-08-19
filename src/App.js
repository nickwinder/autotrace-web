import React, {Component} from 'react';
import 'rc-slider/assets/index.css';
import './App.css';
import {SliderInternal} from './Slider.js';
import {ASwitch} from "./Switch.js";
import {ImageUpload} from './ImageFile.js';

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
                        <ImageUpload/>
                    </div>

                </div>
            </div>
        );
    }
}

export default App;
