
'use babel';

import React from 'react';


// export class Week extends React.Component {

//   constructor(props) {
//     super();
//     this.state = {
//       weekNumber: props.weekNumber,
//       setParentState: props.state.setParentState
//     }
//   }

//   handleClick(weekDay) {
//     console.log("Weekday:"+weekDay);
//     console.log("WeekNumber:"+this.state.weekNumber);
//     const dayId = 0;
//     this.state.setParentState({currentView: 'EditDay', dayId: dayId});
//   }  

//   render() {
//     return <div>
//       Week {this.state.weekNumber}:
//       <button onClick={this.handleClick.bind(this, 1)}>M</button>
//       <button onClick={this.handleClick.bind(this, 2)}>T</button>
//       <button onClick={this.handleClick.bind(this, 3)}>W</button>
//       <button onClick={this.handleClick.bind(this, 4)}>T</button>
//       <button onClick={this.handleClick.bind(this, 5)}>F</button>
//       <button onClick={this.handleClick.bind(this, 6)}>S</button>
//       <button onClick={this.handleClick.bind(this, 7)}>S</button>
//     </div>;
//   }

// }

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
    this.state.client = client[0];
  }

  handleClick() {
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
    return <div>
      <h1>{this.state.client.name}</h1>
      <h3>Week:{this.state.weekNumber},Day:{this.state.dayNumber}</h3>
      <hr/>
      <button onClick={this.handleClick.bind(this)}>Add Meal</button>
    </div>;
  }
}