'use babel';

import React from 'react';
import AddClient from './AddClient';
import EditClient from './EditClient';
import SelectClient from './SelectClient';
import ClientView from './ClientView';
import DayView from './DayView';
import AddFood from './AddFood';
import EditFood from './EditFood';
import AddDish from './AddDish';
import EditDish from './EditDish';
import AddBaking from './AddBaking';
import EditBaking from './EditBaking';
import SelectFood from './SelectFood';
import SelectDish from './SelectDish';
import SelectBaking from './SelectBaking';
import WeekView from './WeekView';
import NavigationButton from './NavigationButton';
import Loki from 'lokijs';
import {ipcRenderer} from 'electron';


const debugMode = true;
const demoData = require('../scripts/demoData');

let database = new Loki('app.db');

database.loadDatabase({}, () => {
  onDatabaseLoad();
});

const onDatabaseLoad = () => {
  console.log('database loaded');
  if (database.getCollection('clients') == null) {
    console.log("No collections found. Creating database collections");
    var clients = database.addCollection('clients', {indices: ['name']});
    var days = database.addCollection('clientsDays', {indices: ['clientId']});
    var meals = database.addCollection('daysMeals', {indices: ['clientId']});
    var meals = database.addCollection('mealsFood', {indices: ['mealsId']});
    var meals = database.addCollection('foodBank', {indices: ['name']});
    var meals = database.addCollection('dishBank', {indices: ['name']});
    var meals = database.addCollection('dishesFoods', {indices: ['dishId']});
    var meals = database.addCollection('bakingBank', {indices: ['name']});
    var meals = database.addCollection('mealsBaking', {indices: ['mealsId']});
  }
}

const addDemoData = () => {
  // Now add demoData
  if (debugMode) {
    demoData.setDemoData(database);
  }
}


class View extends React.Component {

  constructor(props) {
    super();
    this.state = props.state;
    this.state.setParentState = props.setParentState;
    this.state.database = database;

    // Menu Selection
    ipcRenderer.on('menuSelection', (event, data) => {
      ipcRenderer.removeAllListeners('publish');
      ipcRenderer.on('publish', (event, data) => {
        alert('No PDF to publish. Please navigate to food plan view.');
      });
      this.menuSelectionChangeView(data);
    });
  }

  componentWillReceiveProps(props) {
    this.setState(props.state);
  }

  menuSelectionChangeView(selection) {
    console.log('Menu Change: ' + selection.currentView);
    if (selection.currentView == 'Back') {
      selection.currentView = this.state.previousView;
    }
    this.state.previousView = this.state.currentView;
    if (selection.currentView) {
      this.setState({currentView: selection.currentView, nextAction: selection.nextAction, dishId: selection.dishId});
    }
  }

  render() {
    if (this.state.currentView == 'SelectClient') {
      return <div><SelectClient state={this.state} /></div>;
    }
    if (this.state.currentView == 'ClientView') {
      return <div><ClientView state={this.state} /></div>;
    }
    if (this.state.currentView == 'AddClient') {
      return <div><AddClient state={this.state} /></div>;
    }
    if (this.state.currentView == 'DayView') {
      return <div><DayView state={this.state} /></div>;
    }
    if (this.state.currentView == 'AddFood') {
      return <div><AddFood state={this.state} /></div>;
    }
    if (this.state.currentView == 'AddDish') {
      return <div><AddDish state={this.state} /></div>;
    }
    if (this.state.currentView == 'AddBaking') {
      return <div><AddBaking state={this.state} /></div>;
    }
    if (this.state.currentView == 'SelectFood') {
      return <div><SelectFood state={this.state} /></div>;
    }
    if (this.state.currentView == 'SelectDish') {
      return <div><SelectDish state={this.state} /></div>;
    }
    if (this.state.currentView == 'SelectBaking') {
      return <div><SelectBaking state={this.state} /></div>;
    }
    if (this.state.currentView == 'WeekView') {
      return <div><WeekView state={this.state} /></div>;
    }
    if (this.state.currentView == 'EditClient') {
      return <div><EditClient state={this.state} /></div>;
    }
    if (this.state.currentView == 'EditFood') {
      return <div><EditFood state={this.state} /></div>;
    }
    // if (this.state.currentView == 'EditDish') { // WE USE ADD DISH INSTEAD
    //   return <div><EditDish state={this.state} /></div>;
    // }
    if (this.state.currentView == 'EditBaking') {
      return <div><EditBaking state={this.state} /></div>;
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

  // // Actions

  // clientView() {
  //   this.setState({currentView: 'SelectClient', nextAction: 'ClientView'});
  // }

  // editClient() {
  //   this.setState({currentView: 'SelectClient', nextAction: 'EditClient'});
  // }

  // editFood() {
  //   this.setState({currentView: 'SelectFood', nextAction: 'EditFood'});
  // }

  // editDish() {
  //   this.setState({currentView: 'SelectDish', nextAction: 'AddDish'});
  // }

  // editBaking() {
  //   this.setState({currentView: 'SelectBaking', nextAction: 'EditBaking'});
  // }


  render() {
    return <div>
      {(this.state.currentView === 'WeekView' ? <div></div> : <div></div>)}
      <div>
        <View state={this.state} setParentState={this.setParentState.bind(this)}/>
      </div>
    </div>;
  }
}