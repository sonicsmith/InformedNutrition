
'use babel';

import React from 'react';
import Loki from 'lokijs';


export default class SelectClient extends React.Component {

  constructor() {
    super();
    this.state = {
      clientList: []
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

  handleClick(id) {
    console.log(id)
  }

  render() {
    const list = this.state.clientList;
    return <div>
      <input type="text"/>
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