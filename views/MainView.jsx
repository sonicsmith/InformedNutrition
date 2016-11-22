'use babel';

import React from 'react';
import AddClient from './AddClient';
import SelectClient from './SelectClient';
import EditClient from './EditClient';
import EditDay from './EditDay';
import AddFood from './AddFood';
import AddDish from './AddDish';
import SelectFood from './SelectFood';
import SelectDish from './SelectDish';
import WeekView from './WeekView';
import NavigationButton from './NavigationButton';
import Loki from 'lokijs';

const demoData = require('../scripts/demoData');

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
  if (database.getCollection('clientsDays') == null) {
    console.log("Creating clientsDays collection");
    var days = database.addCollection('clientsDays', {
      indices: ['clientId']
    });
    database.saveDatabase();
  }
  if (database.getCollection('daysMeals') == null) {
    console.log("Creating daysMeals collection");
    var meals = database.addCollection('daysMeals', {
      indices: ['clientId']
    });
    database.saveDatabase();
  }
  if (database.getCollection('mealsFood') == null) { // Also think: mealsDishes
    console.log("Creating mealsFood collection");
    var meals = database.addCollection('mealsFood', {
      indices: ['mealsId']
    });
    database.saveDatabase();
  }
  if (database.getCollection('foodBank') == null) {
    console.log("Creating foodBank collection");
    var meals = database.addCollection('foodBank', {
      indices: ['name']
    });
    database.saveDatabase();
  }
  if (database.getCollection('dishBank') == null) {
    console.log("Creating dishBank collection");
    var meals = database.addCollection('dishBank', {
      indices: ['name']
    });
    database.saveDatabase();
  }
  if (database.getCollection('dishesFoods') == null) {
    console.log("Creating dish collection");
    var meals = database.addCollection('dishesFoods', {
      indices: ['dishId']
    });
    database.saveDatabase();
    // Now add demoData
    demoData.setDemoData(database);
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
    if (this.state.currentView == 'EditDay') {
      return <div><EditDay state={this.state} /></div>;
    }
    if (this.state.currentView == 'AddFood') {
      return <div><AddFood state={this.state} /></div>;
    }
    if (this.state.currentView == 'AddDish') {
      return <div><AddDish state={this.state} /></div>;
    }
    if (this.state.currentView == 'SelectFood') {
      return <div><SelectFood state={this.state} /></div>;
    }
    if (this.state.currentView == 'SelectDish') {
      return <div><SelectDish state={this.state} /></div>;
    }
    if (this.state.currentView == 'WeekView') {
      return <div><WeekView state={this.state} /></div>;
    }
    return <div><br/><br/>Select an option above</div>;
  }

}


export default class MainView extends React.Component {

  constructor() {
    super();
    this.state = {
      currentView: ""
    };
  }

  setParentState(changes) {
    console.log("setParentState");
    this.setState(changes);
  }

  componentWillReceiveProps(props) {
    this.setState(props);
  }

  render() {
    return <div>
      <h1>InFormed Nutrition</h1>
      <div className="nav-buttons">
        <NavigationButton text="Select Client" link="SelectClient" setParentState={this.setParentState.bind(this)}/>
        <NavigationButton text="Add Client" link="AddClient" setParentState={this.setParentState.bind(this)}/>
        <NavigationButton text="Add Food" link="AddFood" setParentState={this.setParentState.bind(this)}/>
        <NavigationButton text="Add Dish" link="AddDish" setParentState={this.setParentState.bind(this)}/>
        <hr/>
      </div>
      <div>
        <View state={this.state} setParentState={this.setParentState.bind(this)}/>
      </div>
    </div>;
  }
}
