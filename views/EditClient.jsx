
'use babel';

import React from 'react';


export class Week extends React.Component {

  constructor(props) {
    super();
    this.state = {
      weekNumber: props.weekNumber
    }
  }

  render() {
    return <div>
      Week {this.state.weekNumber}:
      <button>M</button>
      <button>T</button>
      <button>W</button>
      <button>T</button>
      <button>F</button>
      <button>S</button>
      <button>S</button>
    </div>;
  }

}

export default class EditClient extends React.Component {

  constructor(props) {
    super();
    this.state = {
      database: props.state.database
    }
    const clientId = props.state.clientId;
    console.log("clientId"+clientId);
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
    for (var i = 0; i < numWeeks; i++) {
      weeks.push(<li key={i}><Week weekNumber={i}/></li>);
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