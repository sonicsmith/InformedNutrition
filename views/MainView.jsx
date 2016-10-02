'use babel';

import React from 'react';
import AddClient from './AddClient';
import SelectClient from './SelectClient';
import EditClient from './EditClient';
// import CreateMeal from './CreateMeal';
import NavigationButton from './NavigationButton';


class View extends React.Component {

  constructor(props) {
    super();
    this.state = props.state;
  }

  componentWillReceiveProps(props) {
    console.log("View.componentWillReceiveProps");
    console.log(props);
    this.setState(props.state);
  }

  render() {
    if (this.state.currentView == 'SelectClient') {
      return <div><SelectClient setParentState={this.state.setParentState} /></div>;
    }
    if (this.state.currentView == 'EditClient') {
      return <div><EditClient setParentState={this.state.setParentState} /></div>;
    }
    if (this.state.currentView == 'AddClient') {
      return <div><AddClient setParentState={this.state.setParentState} /></div>;
    }
    return <div></div>;
  }

}


export default class MainView extends React.Component {

  constructor() {
    super();
    this.state = {
      currentView: ""
    };
    this.setParentState = this.setParentState.bind(this);
  }

  setParentState(changes) {
    console.log("setParentState");
    this.setState(changes);
  }

  componentWillReceiveProps(props) {
    console.log("MainView.componentWillReceiveProps");
    this.setState(props);
  }

  render() {
    return <div>
      <h1>Informed Nutrition</h1>
      <div className="nav-buttons">
        <NavigationButton text="Select Client" link="SelectClient" setParentState={this.setParentState}/>
        <NavigationButton text="Add Client" link="AddClient" setParentState={this.setParentState}/>
        <NavigationButton text="Add Meal" link="AddMeal" setParentState={this.setParentState}/>
        <hr/>
      </div>
      <div>
        <View state={this.state} setParentState={this.setParentState}/>
      </div>
    </div>;
  }
}
