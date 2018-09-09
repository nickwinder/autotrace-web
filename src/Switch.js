import React, {Component} from "react";
import Switch from "react-switch";

export class SwitchInternal extends Component {
    constructor() {
        super();
        this.state = {checked: false};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(checked) {
        this.setState({checked});
        this.props.onChange()
    }

    render() {
        return (
            <label htmlFor="normal-switch">
                <Switch
                    checked={this.state.checked}
                    onChange={this.handleChange}
                    onColor="#86d3ff"
                    onHandleColor="#2693e6"
                    handleDiameter={14}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    height={6}
                    width={24}
                    className="react-switch"
                    id="material-switch"
                />
            </label>
        );
    }
}
