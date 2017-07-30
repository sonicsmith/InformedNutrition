
'use babel';

import React from 'react';

export default class SelectClient extends React.Component {

  constructor(props) {
    super();
    this.state = {
      setParentState: props.state.setParentState,
      clientList: [{name:"loading"}],
      database: props.state.database,
      nextAction: props.state.nextAction
    };
    this.state.clientList = this.state.database.getCollection('clients').where((obj) => {return true;});
  }

  handleClick(id) {
    // Open edit client view
    this.state.setParentState({currentView: this.state.nextAction, clientId: id, nextAction: ''});
  }

  handleSearchChange(event) {
    const filter = event.target.value;
    if (filter == "") {
      const allClients = this.state.database.getCollection('clients').where((obj) => {return true;});
      this.setState({clientList: allClients});
    } else {
      const filteredClients = this.state.database.getCollection('clients').where((obj) => {
        return obj.name.toLowerCase().includes(filter.toLowerCase());
      });
      this.setState({clientList: filteredClients});
    }
  }

  render() {
    const list = this.state.clientList;
    const heading = this.state.nextAction == 'EditClient' ? 'Select a client to edit:' : 'Select a client for food plan:';
    return <div>
      <h1>{heading}</h1>
      <input type="text" placeholder="Search" onChange={this.handleSearchChange.bind(this)}/>
      <ul>
          {list.map((client) => {
            const id = client.$loki;
            return <li key={id}>
              {client.name} <button onClick={this.handleClick.bind(this, id)}>Edit</button>
            </li>;
          })}
      </ul>
    </div>;
  }
}