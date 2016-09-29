
'use babel';

import React from 'react';
import Loki from 'lokijs';


export default class SelectClient extends React.Component {

  constructor() {
    super();
    this.state = {
      client: "no one"
    };

    let self = this;

    let database = new Loki('app.db', {
      autoload: true,
      autoloadCallback : onDatabaseLoad
    });

    database.loadDatabase({}, function() {
      let clientList = database.getCollection('clients').where(function(obj) {return true;});
      console.log("databaseLoad1");
      self.setState({client: clientList[0].name});
    });
    
    const onDatabaseLoad = () => {
      console.log("databaseLoad1");
    }

  }

  render() {
    return <div>{this.state.client}</div>;
  }
}