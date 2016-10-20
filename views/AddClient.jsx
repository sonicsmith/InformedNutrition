
'use babel';

import React from 'react';
import Loki from 'lokijs';
var remote = require('remote');


export default class AddClient extends React.Component {

  constructor(props) {
    super();
    this.state = {
      setParentState: props.state.setParentState,
      name: "",
      email: "",
      database: props.state.database
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.saveClient = this.saveClient.bind(this);
  }

  handleNameChange(event) {
    this.setState({name: event.target.value});
  }

  handleEmailChange(event) {
    this.setState({email: event.target.value});
  }

  saveClient() {
    const clientCollection = this.state.database.getCollection('clients');
    clientCollection.insert({ name: this.state.name, email: this.state.email});
    this.state.database.saveDatabase();
    console.log("New Client Saved", this.state.name);
    this.state.setParentState({currentView: 'SelectClient'});
  }

  render() {
    return <div>
      <input key="name" type="text" name="name" placeholder="Name" onChange={this.handleNameChange}/>
      <br/>
      <input key="email" type="text" name="email" placeholder="Email" onChange={this.handleEmailChange}/>
      <br/>
      <button onClick={this.saveClient}>Save</button>
    </div>;
  }
}