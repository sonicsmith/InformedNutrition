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
      link: props.link
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log("Click: "+this.state.link);
    // Change Global view
    //this.state.currentView = this.state.link;
  }

  render() {
    return <button onClick={this.handleClick}>{this.state.text}</button>;
  }
}