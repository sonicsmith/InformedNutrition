
'use babel';

import React from 'react';


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
  }


  render() {
    return <div>
      <h1>{this.state.client.name}</h1>
      <hr/>
      <button>Add Week</button>
    </div>;
  }
}