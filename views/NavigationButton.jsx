'use babel';

import React from 'react';


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


  render() {
    return <button onClick={this.handleClick}>{this.state.text}</button>;
  }
}