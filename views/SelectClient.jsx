
'use babel';

import React from 'react';

export default class SelectClient extends React.Component {

  constructor(props) {
    super();
    this.state = {
      setParentState: props.state.setParentState,
      clientList: [{name:"loading"}],
      database: props.state.database
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);

    const clientCollection = this.state.database.getCollection('clients');
    this.state.clientList = clientCollection.where(function(obj) {return true;});
    console.log(this.state.clientList);
  }

  handleClick(clientId) {
    // Open edit client view
    this.state.setParentState({currentView: 'EditClient', clientId: clientId});
  }

  handleSearchChange() {
    //this.setState(this.state)
  }

  render() {
    const list = this.state.clientList;
    return <div>
      <input type="text" placeholder="Search" onChange={this.handleSearchChange}/>
      <ul>
          {list.map((client) => {
            let id = client.$loki;
            return <li key={id}>
              {client.name}<button onClick={this.handleClick}>Edit</button>
            </li>;
          })}
      </ul>
    </div>;
  }
}