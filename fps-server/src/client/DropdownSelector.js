import React from "react";

export default class DropdownSelector extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <select id={this.props.id} onChange={this.props.onChange}>
        {this.props.children}
      </select>
    );
  }
}
