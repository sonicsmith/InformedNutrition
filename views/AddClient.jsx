
'use babel';

import React from 'react';
import Loki from 'lokijs';


export default class AddClient extends React.Component {

  constructor(props) {
    super();
    this.state = {
      name: "",
      email: ""
    };

    let self = this;

    let database = new Loki('app.db', {
      autoload: true,
      autoloadCallback : onDatabaseLoad
    });

    const onDatabaseLoad = () => {}
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
    const clients = database.getCollection('clients');
    clients.insert({ name: this.state.name, email: this.state.email});
    database.saveDatabase();
    console.log("New Client Saved");
  }

  render() {
    return <div>
      <input key="name" type="text" name="name" placeholder="Name" onChange={this.handleNameChange}/>
      <br/>
      <input key="email" type="text" name="email" placeholder="Email" onChange={this.handleEmailChange}/>
      <br/>
      <button onClick={this.saveCient}>Save</button>
    </div>;
  }
}