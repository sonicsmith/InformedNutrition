
'use babel';

import React from 'react';


export class Week extends React.Component {

  constructor(props) {
    super();
    this.state = {
      weekNumber: props.weekNumber,
      setParentState: props.setParentState
    }
  }

  handleClick(weekDay) {
    console.log("Weekday:"+weekDay);
    console.log("WeekNumber:"+this.state.weekNumber);
    this.state.setParentState({currentView: 'EditDay', dayNumber: weekDay, weekNumber: this.state.weekNumber});
  }  

  render() {
    return <div>
      Week {this.state.weekNumber}:
      <button onClick={this.handleClick.bind(this, 1)}>M</button>
      <button onClick={this.handleClick.bind(this, 2)}>T</button>
      <button onClick={this.handleClick.bind(this, 3)}>W</button>
      <button onClick={this.handleClick.bind(this, 4)}>T</button>
      <button onClick={this.handleClick.bind(this, 5)}>F</button>
      <button onClick={this.handleClick.bind(this, 6)}>S</button>
      <button onClick={this.handleClick.bind(this, 7)}>S</button>
    </div>;
  }

}

export default class EditClient extends React.Component {

  constructor(props) {
    super();
    this.state = {
      database: props.state.database,
      setParentState: props.state.setParentState
    }
    const clientId = props.state.clientId;
    console.log("EditClient with clientId"+clientId);
    const client = this.state.database.getCollection('clients').where((obj) => {
      return obj.$loki == clientId;
    });
    let days = this.state.database.getCollection('days').where((obj) => {
      return obj.clientId == clientId;
    });
    this.state.client = client[0];
    this.state.days = days;
  }

  handleClick() {
    const daysCollection = this.state.database.getCollection('days');
    const weekNumber = (Object.keys(this.state.days).length)/7 + 1;
    for (var index = 1; index < 8; index++) {
      daysCollection.insert({ clientId: this.state.client.$loki, week: weekNumber, dayOfWeek: index});
    }
    this.state.database.saveDatabase();
    let days = daysCollection.where((obj) => {
      return obj.clientId == this.state.client.$loki;
    });
    this.setState({days: days});
  }

  render() {
    var numWeeks = (Object.keys(this.state.days).length)/7;
    var weeks = [];
    for (var i = 1; i < numWeeks + 1; i++) {
      weeks.push(<li key={i}><Week weekNumber={i} setParentState={this.state.setParentState}/></li>);
    }
    return <div>
      <h1>{this.state.client.name}</h1>
      <hr/>
      <ul>
        {weeks}
      </ul>
      <button onClick={this.handleClick.bind(this)}>Add Week</button>
    </div>;
  }
}