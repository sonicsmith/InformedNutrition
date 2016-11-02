
'use babel';

import React from 'react';

let database;
let clientId;

const getDayId = (weekDay, weekNumber) => {
  const day = database.getCollection('clientsDays').where((obj) => {
    const weekDayMatch = obj.dayOfWeek == weekDay;
    const weekMatch = obj.week == weekNumber;
    const clientMatch = obj.clientId == clientId
    return weekDayMatch && weekMatch && clientMatch;
  });
  return day[0].$loki;
}

export class Week extends React.Component {

  constructor(props) {
    super();
    this.state = {
      weekNumber: props.weekNumber,
      setParentState: props.setParentState
    }
  }

  handleClick(weekDay) {
    const dayId = getDayId(weekDay, this.state.weekNumber);
    console.log("EditDay called with dayId: "+dayId)
    this.state.setParentState({currentView: 'EditDay', dayId: dayId});
  }  

  createPDF() {
    console.log("createPDF clicked")
    const remote = window.require('remote');
    const currentWindow = remote.getCurrentWindow();
    const contents = currentWindow.webContents;
    contents.printToPDF({pageSize: 'A4', landscape: false}, (error, data) => {
      if (error) throw error
      const fileName = this.state.client + '-' + dayNumber + '-' + weekNumber + '.pdf';
      fs.writeFile(__dirname + '/' + fileName, data, (error) => {
        if (error) throw error
        console.log('Write PDF successfully.')
        alert("File Saved: " + fileName);
      })
    });
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
      <button onClick={this.createPDF}>Create PDF</button>
      <br/>
      <br/>
    </div>;
  }

}


export default class EditClient extends React.Component {

  constructor(props) {
    super();
    this.state = {
      setParentState: props.state.setParentState
    }
    database = props.state.database;
    clientId = props.state.clientId;
    console.log("EditClient with clientId: "+clientId);
    const client = database.getCollection('clients').where((obj) => {
      return obj.$loki == clientId;
    });
    this.state.client = client[0];
    let days = database.getCollection('clientsDays').where((obj) => {
      return obj.clientId == clientId;
    });
    this.state.days = days;
  }

  // Create a week
  handleClick() {
    const weekNumber = (Object.keys(this.state.days).length)/7 + 1;
    for (var index = 1; index < 8; index++) {
      database.getCollection('clientsDays').insert({ clientId: this.state.client.$loki, week: weekNumber, dayOfWeek: index});
    }
    database.saveDatabase();
    let days = database.getCollection('clientsDays').where((obj) => {
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
      <b>Intolerances:</b> {this.state.client.intolerances}<br/>
      <b>Likes and Dislikes:</b> {this.state.client.likesDislikes}<br/>
      <b>Medications and Supplements:</b> {this.state.client.medications}<br/>
      <hr/>
      <ul>
        {weeks}
      </ul>
      <button onClick={this.handleClick.bind(this)}>Add Week</button>
    </div>;
  }
}