
'use babel';

import React from 'react';
import Loki from 'lokijs';

let database;

export default class AddFood extends React.Component {

  constructor(props) {
    super();
    this.state = {
      setParentState: props.state.setParentState,
      name: "",
      protein: "",
      fat: ""
    };
    database = props.state.database;
    this.handleEditChange = this.handleEditChange.bind(this);
    this.saveFood = this.saveFood.bind(this);
  }

  handleEditChange(event) {
    const editType = event.target.name;
    this.setState({[editType]: event.target.value});
  }


  saveFood() {
    const foodCollection = database.getCollection('food');
    foodCollection.insert({ 
      name: this.state.name, 
      protein: this.state.protein,
      fat: this.state.fat
    });
    database.saveDatabase();
    console.log("New Food Saved", this.state.name);
    this.state.setParentState({currentView: 'SelectClient'});
    alert("Food Saved.");
  }

  render() {
    return <div>
      <input type="text" name="name" placeholder="Name and quantity" onChange={this.handleEditChange}/>
      <br/>
      <input type="text" name="protein" placeholder="Protein content (g)" onChange={this.handleEditChange}/>
      <br/>
      <input type="text" name="fat" placeholder="Fat content (g)" onChange={this.handleEditChange}/>
      <br/>
      <button onClick={this.saveFood}>Save</button>
    </div>;
  }
}