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
      switchView: props.switchView
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log("NavigationButton - Click: "+this.state.link);
    // Change Global view
    //this.setState({currentView: this.state.link});
    this.state.switchView(this.state.link);
  }

  componentWillReceiveProps(props) {
    console.log("NavigationButton.componentWillReceiveProps");
    this.setState({currentView: props.currentView});
  }

  render() {
    return <button onClick={this.handleClick}>{this.state.text}</button>;
  }
}