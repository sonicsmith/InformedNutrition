
'use babel';

import React from 'react';
import Loki from 'lokijs';


export default class SelectClient extends React.Component {

  constructor(props) {
    super();
    this.state = {
      clientList: [],
      switchView: props.switchView
    };

    let self = this;

    let database = new Loki('app.db', {
      autoload: true,
      autoloadCallback : onDatabaseLoad
    });

    database.loadDatabase({}, function() {
      let clientList = database.getCollection('clients').where(function(obj) {return true;});
      self.setState({clientList: clientList});
    });
    
    const onDatabaseLoad = () => {
      console.log("onDatabaseLoad");
    }

  }

  handleClick(clientId) {
    // Open edit client view
    console.log(clientId)
    this.state.switchView('EditClient', {clientId});
  }

  render() {
    const list = this.state.clientList;
    return <div>
      <input type="text" placeholder="Search"/>
      <ul>
          {list.map((client) => {
            let id = client.$loki;
            return <li key={id}>
              {client.name}<button onClick={this.handleClick.bind(this, id)}>Edit</button>
            </li>;
          })}
      </ul>
    </div>;
  }
}