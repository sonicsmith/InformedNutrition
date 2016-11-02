
'use babel';

import React from 'react';
import Loki from 'lokijs';

let database;

export default class AddClient extends React.Component {

  constructor(props) {
    super();
    this.state = {
      setParentState: props.state.setParentState,
      name: "",
      cell: "",
      email: "",
      intolerances: "",
      likesDislikes: "",
      medications: ""
    };
    database = props.state.database;
  }

  handleEditChange(event) {
    const editType = event.target.name;
    this.setState({[editType]: event.target.value});
  }

  saveClient() {
    database.getCollection('clients').insert({ 
      name: this.state.name,
      cell: this.state.cell,
      email: this.state.email,
      intolerances: this.state.intolerances,
      likesDislikes: this.state.likesDislikes,
      medications: this.state.medications,
    });
    database.saveDatabase();
    console.log("New Client Saved", this.state.name);
    this.state.setParentState({currentView: 'SelectClient'});
    alert("Client Saved.");
  }

  render() {
    return <div>
      <input type="text" name="name" placeholder="Name" onChange={this.handleEditChange.bind(this)}/>
      <br/>
      <input type="text" name="cell" placeholder="Cell" onChange={this.handleEditChange.bind(this)}/>
      <br/>
      <input type="text" name="email" placeholder="Email" onChange={this.handleEditChange.bind(this)}/>
      <br/>
      <input type="text" name="intolerances" placeholder="Intolerances" onChange={this.handleEditChange.bind(this)}/>
      <br/>
      <input type="text" name="likesDislikes" placeholder="Likes and Dislikes" onChange={this.handleEditChange.bind(this)}/>
      <br/>
      <input type="text" name="medications" placeholder="Medications and Supplements" onChange={this.handleEditChange.bind(this)}/>
      <br/>
      <button onClick={this.saveClient.bind(this)}>Save</button>
    </div>;
  }
}