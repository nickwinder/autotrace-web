import React, {Component} from "react";
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
                <Slider
                    min={this.props.min}
                    max={this.props.max}
                    defaultValue={this.props.defaultValue}
                    step={this.props.step}
                    handle={handle}
                    onAfterChange={this.props.onAfterChange}/>
            </label>
        );
    }
}
