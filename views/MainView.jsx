'use babel';

import React from 'react';
// import CreateClient from './CreateClient';
import SelectClient from './SelectClient';
// import CreateMeal from './CreateMeal';
import NavigationButton from './NavigationButton';


class View extends React.Component {

  constructor(props) {
    super();
    this.state = {
      currentView: props.currentView
    };
  }

  componentWillReceiveProps(props) {
    console.log("View.componentWillReceiveProps");
    this.setState({currentView: props.currentView});
  }

  render() {
    if (this.state.currentView == 'SelectClient') return <div><SelectClient/></div>;
    return <div></div>;
  }

}


export default class MainView extends React.Component {

  constructor() {
    super();
    this.state = {
      currentView: ""
    };
    this.switchView = this.switchView.bind(this);
  }

  switchView(view) {
    console.log("MainView - switchView: "+view);
    this.setState({currentView: view});
  }

  componentWillReceiveProps(props) {
    console.log("MainView.componentWillReceiveProps");
    this.setState({currentView: props.currentView});
  }

  render() {
    return <div>
      <h1>Informed Nutrition</h1>
      <div className="nav-buttons">
        <NavigationButton text="Select Client" link="SelectClient" switchView={this.switchView}/>
        <NavigationButton text="Add Client" link="AddClient" switchView={this.switchView}/>
        <NavigationButton text="Add Meal" link="AddMeal" switchView={this.switchView}/>
      </div>
      <div>
        <View currentView={this.state.currentView}/>
      </div>
    </div>;
  }
}