import {Component} from "react";
import React from "react";
import Tooltip from "rc-tooltip";
import Slider from "rc-slider";

const Handle = Slider.Handle;

const handle = (props) => {
    const {value, dragging, index, ...restProps} = props;
    return (
        <Tooltip
            prefixCls="rc-slider-tooltip"
            overlay={value}
            visible={dragging}
            placement="top"
            key={index}
        >
            <Handle value={value} {...restProps} />
        </Tooltip>
    );
};


export class SliderInternal extends Component {
    render() {
        return (
            <label htmlFor="normal-switch">
                <Slider min={0} max={20} defaultValue={3} handle={handle}/>
            </label>
        );
    }
}
