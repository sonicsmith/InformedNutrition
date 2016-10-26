
'use babel';

import React from 'react';
import Loki from 'lokijs';


export default class AddClient extends React.Component {

  constructor(props) {
    super();
    this.state = {
      setParentState: props.state.setParentState,
      name: "",
      email: "",
      database: props.state.database
    };

    this.handleEditChange = this.handleEditChange.bind(this);
    this.saveClient = this.saveClient.bind(this);
  }

  handleEditChange(event) {
    const editType = event.target.name;
    this.setState({[editType]: event.target.value});
  }

  saveClient() {
    const clientCollection = this.state.database.getCollection('clients');
    clientCollection.insert({ name: this.state.name, email: this.state.email});
    this.state.database.saveDatabase();
    console.log("New Client Saved", this.state.name);
    this.state.setParentState({currentView: 'SelectClient'});
    alert("Client Saved.");
  }

  render() {
    return <div>
      <input type="text" name="name" placeholder="Name" onChange={this.handleEditChange}/>
      <br/>
      <input type="text" name="email" placeholder="Email" onChange={this.handleEditChange}/>
      <br/>
      <button onClick={this.saveClient}>Save</button>
    </div>;
  }
}