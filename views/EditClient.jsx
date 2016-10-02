
'use babel';

import React from 'react';
import Loki from 'lokijs';


export default class EditClient extends React.Component {

  constructor(props) {
    super();
    this.state = {
      data: props.data,
      switchView: props.switchView,
      client: {name: 'loading..'}
    };

    let self = this;

    let database = new Loki('app.db', {
      autoload: true,
      autoloadCallback : onDatabaseLoad
    });

    database.loadDatabase({}, function() {
      const id = self.state.data.clientId;
      let clients = database.getCollection('clients').where(function(obj) {return obj.$loki == id;});
      self.setState({client: clients[0]});
      console.log("Got client:"+self.state.client.name)
    });
    
    const onDatabaseLoad = () => {
      console.log("onDatabaseLoad");
    }

  }

  componentWillReceiveProps(props) {
    console.log("EditClient.componentWillReceiveProps");
    this.setState({data: props.data});
  }

  render() {
    // const client = this.state.data;
    const clientName = this.state.client.name;
    return <div>
      <h1>{clientName}</h1>
      <hr/>
      <button>Add Week</button>
    </div>;
  }
}