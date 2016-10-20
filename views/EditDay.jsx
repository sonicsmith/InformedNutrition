
'use babel';

import React from 'react';


export class Meal extends React.Component {

  constructor(props) {
    super();
    this.state = {
      mealNumber: props.mealNumber,
      setParentState: props.setParentState
    }
    switch(this.state.mealNumber) {
      case 0:
        this.state.mealName = "Breakfast:";
        break;
      case 1:
        this.state.mealName = "Brunch:";
        break;
      case 2:
        this.state.mealName = "Lunch:";
        break;
      case 3:
        this.state.mealName = "Afternoon tea:";
        break;
      case 4:
        this.state.mealName = "Dinner:";
        break;
    }

  }

  handleClick(mealType) {
    // console.log("Weekday:"+weekDay);
    // console.log("WeekNumber:"+this.state.weekNumber);
    // const dayId = 0;
    // this.state.setParentState({currentView: 'EditDay', dayId: dayId});
  }  

  render() {
    return <div>
      <b>{this.state.mealName}</b>
      <button onClick={this.handleClick.bind(this, 0)}>Add Food</button>
    </div>;
  }

}

export default class EditDay extends React.Component {

  constructor(props) {
    super();
    this.state = {
      database: props.state.database,
      weekNumber: props.state.weekNumber,
      dayNumber: props.state.dayNumber,
      setParentState: props.state.setParentState
    }
    const clientId = props.state.clientId;
    console.log("Edit day with clientId"+clientId);
    const client = this.state.database.getCollection('clients').where((obj) => {
      return obj.$loki == clientId;
    });
    const meals = this.state.database.getCollection('meals').where((obj) => {
      const clientMatch = obj.clientId == clientId;
      const dayMatch = obj.dayNumber == dayNumber;
      const weekMatch = obj.weekNumber == weekNumber;
      return clientMatch && dayMatch && weekMatch;
    });
    this.state.clientId = clientId
    this.state.clientName = client[0].name;
  }

  handleClick(mealType) {
    // const daysCollection = this.state.database.getCollection('days');
    // const weekNumber = (Object.keys(this.state.days).length)/7 + 1;
    // for (var index = 1; index < 8; index++) {
    //   daysCollection.insert({ clientId: this.state.client.$loki, week: weekNumber, dayOfWeek: index});
    // }
    // this.state.database.saveDatabase();
    // let days = daysCollection.where((obj) => {
    //   return obj.clientId == this.state.client.$loki;
    // });
    // this.setState({days: days});
  }

  render() {
    var meals = [];
    for (var i = 0; i < 5; i++) {
      meals.push(<li key={i}><Meal mealNumber={i} setParentState={this.state.setParentState}/></li>);
    }
    return <div>
      <h1>{this.state.clientName}</h1>
      <h3>Week:{this.state.weekNumber}, Day:{this.state.dayNumber}</h3>
      <hr/>
      <ul>
        {meals}
      </ul>
    </div>;
  }
}