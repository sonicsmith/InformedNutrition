
'use babel';

import React from 'react';


export default class EditClient extends React.Component {

  constructor(props) {
    super();
    this.state = props.state;
    this.client = {name: 'loading..'};

    let clients = database.getCollection('clients').where(function(obj) {
      return obj.$loki == self.state.clientId;
    });
    // let days = database.getCollection('days').where(function(obj) {
    //   return obj.clientId == self.state.clientId;
    // });
    //self.setState({client: clients[0]});
    console.log("Got client:"+clients[0].name)
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