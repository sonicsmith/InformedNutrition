'use babel';

import React from 'react';
import AddClient from './AddClient';
import SelectClient from './SelectClient';
import EditClient from './EditClient';
// import CreateMeal from './CreateMeal';
import NavigationButton from './NavigationButton';
import Loki from 'lokijs';


let database = new Loki('app.db');

database.loadDatabase({}, () => {
  onDatabaseLoad();
});

const onDatabaseLoad = () => {
  console.log('database loaded');
  if (database.getCollection('clients') == null) {
    console.log("Creating clients collection");
    var clients = database.addCollection('clients', {
      indices: ['name']
    });
    database.saveDatabase();
  }
  if (database.getCollection('days') == null) {
    console.log("Creating days collection");
    var days = database.addCollection('days', {
      indices: ['week']
    });
    database.saveDatabase();
  }
}

class View extends React.Component {

  constructor(props) {
    super();
    this.state = props.state;
    this.state.setParentState = props.setParentState;
    this.state.database = database;
  }

  componentWillReceiveProps(props) {
    console.log("View.componentWillReceiveProps");
    this.setState(props.state);
  }

  render() {
    if (this.state.currentView == 'SelectClient') {
      return <div><SelectClient state={this.state} /></div>;
    }
    if (this.state.currentView == 'EditClient') {
      return <div><EditClient state={this.state} /></div>;
    }
    if (this.state.currentView == 'AddClient') {
      return <div><AddClient state={this.state} /></div>;
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
      <h1>InFormed Nutrition</h1>
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
