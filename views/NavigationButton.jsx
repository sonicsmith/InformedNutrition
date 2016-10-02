'use babel';

import React from 'react';
var remote = window.require('remote');
const currentWindow = remote.getCurrentWindow();

import MainView from './MainView';

export default class NavigationButton extends React.Component {

 constructor(props) {
    super();
    this.state = {
      text: props.text,
      link: props.link,
      setParentState: props.setParentState
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log("NavigationButton - Click: "+this.state.link);
    this.state.setParentState({currentView: this.state.link});
  }

  // componentWillReceiveProps(props) {
  //   console.log("NavigationButton.componentWillReceiveProps");
  //   this.setState({currentView: props.currentView});
  // }

  render() {
    return <button onClick={this.handleClick}>{this.state.text}</button>;
  }
}