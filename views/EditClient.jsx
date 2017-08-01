
'use babel';

import React from 'react';
import Loki from 'lokijs';

let database;

export default class EditClient extends React.Component {

  constructor(props) {
    super();
    this.state = {
      setParentState: props.state.setParentState,
      clientId: props.state.clientId
    };
    database = props.state.database;
    const client = database.getCollection('clients').get(this.state.clientId);
    this.state.name = client.name;
    this.state.cell = client.cell;
    this.state.email = client.email;
    this.state.intolerances = client.intolerances;
    this.state.likes = client.likes;
    this.state.dislikes = client.dislikes;
    this.state.medications = client.medications;
  }

  handleEditChange(event) {
    const editType = event.target.name;
    this.setState({[editType]: event.target.value});
  }

  saveClient() {
    const client = database.getCollection('clients').get(this.state.clientId);
    client.name = this.state.name;
    client.cell = this.state.cell;
    client.email = this.state.email;
    client.intolerances = this.state.intolerances;
    client.likes = this.state.likes;
    client.dislikes = this.state.dislikes;
    client.medications = this.state.medications;
    database.getCollection('clients').update(client);
    database.saveDatabase();
    console.log("Old Client Updated", this.state.name);
    this.state.setParentState({currentView: '', nextView: ''});
    alert("Client Updated.");
  }

  render() {
    return <div>
      <h1>Update Client Data:</h1>
      <br/>
      Name:<br/>
      <input type="text" name="name" placeholder="Name" onChange={this.handleEditChange.bind(this)} value={this.state.name} />
      <br/>
      Cell:<br/>
      <input type="text" name="cell" placeholder="Cell" onChange={this.handleEditChange.bind(this)} value={this.state.cell} />
      <br/>
      Email:<br/>
      <input type="text" name="email" placeholder="Email" onChange={this.handleEditChange.bind(this)} value={this.state.email} />
      <br/>
      Intolerances:<br/>
      <input type="text" name="intolerances" placeholder="Intolerances" onChange={this.handleEditChange.bind(this)} value={this.state.intolerances} />
      <br/>
      Likes:<br/>
      <input type="text" name="likes" placeholder="Likes" onChange={this.handleEditChange.bind(this)} value={this.state.likes} />
      <br/>
      Dislikes:<br/>
      <input type="text" name="dislikes" placeholder="Dislikes" onChange={this.handleEditChange.bind(this)} value={this.state.dislikes} />
      <br/>
      Medications and Supplements:<br/>
      <input type="text" name="medications" placeholder="Medications and Supplements" onChange={this.handleEditChange.bind(this)} value={this.state.medications} />
      <br/>
      <button onClick={this.saveClient.bind(this)}>Save</button>
    </div>;
  }
}