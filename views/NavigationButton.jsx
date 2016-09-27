'use babel';

import React from 'react';

export default class NavigationButton extends React.Component {

 constructor() {
    super();
    this.state = {
      text: "default"
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({text: "clicked"});
  }


  render() {
    return <button onClick={this.handleClick}>{this.state.text}</button>;
  }
}