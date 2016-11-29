
'use babel';

import React from 'react';

export default class SelectClient extends React.Component {

  constructor(props) {
    super();
    this.state = {
      setParentState: props.state.setParentState,
      clientList: [{name:"loading"}],
      database: props.state.database,
      searchFilter: ""
    };
    this.state.clientList = this.state.database.getCollection('clients').where((obj) => {return true;});
  }

  handleClick(id) {
    // Open edit client view
    this.state.setParentState({currentView: 'EditClient', clientId: id});
  }

  handleSearchChange(event) {
    const filter = event.target.value;
    this.setState({searchFilter: filter});
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
    return <div>
      <input type="text" placeholder="Search" value={this.state.searchFilter} onChange={this.handleSearchChange.bind(this)}/>
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