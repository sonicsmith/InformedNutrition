
'use babel';

import React from 'react';
import Loki from 'lokijs';

let database;

export default class AddBaking extends React.Component {

  constructor(props) {
    super();
    this.state = {
      setParentState: props.state.setParentState,
      name: "",
      unitName: "",
      recipe: "",
      calorie: 0,
      carb: 0,
      protein: 0,
      fat: 0
    };
    database = props.state.database;
  }

  handleEditChange(event) {
    const editType = event.target.name;
    this.setState({[editType]: event.target.value});
  }


  saveBaking() {
    const foodCollection = database.getCollection('bakingBank');
    foodCollection.insert({ 
      name: this.state.name,
      unitName: this.state.unitName,
      recipe: this.state.recipe,
      calorie: this.state.calorie,
      carb: this.state.carb,
      protein: this.state.protein,
      fat: this.state.fat
    });
    database.saveDatabase();
    console.log("New Food Saved", this.state.name);
    this.state.setParentState({currentView: 'SelectClient'});
    alert("Baking Saved.");
  }

  render() {
    return <div>
      <input type="text" name="name" placeholder="Name" onChange={this.handleEditChange.bind(this)}/>
      <br/>
      <input type="text" name="unitName" placeholder="piece{s} of cake" onChange={this.handleEditChange.bind(this)}/>
      <br/>
      <textarea rows="5" type="text" name="recipe" placeholder="Recipe" onChange={this.handleEditChange.bind(this)}/>
      <br/>
      <input type="number" name="calorie" placeholder="Calorie content (g)" onChange={this.handleEditChange.bind(this)}/>
      <br/>
      <input type="number" name="carb" placeholder="Carb content (g)" onChange={this.handleEditChange.bind(this)}/>
      <br/>
      <input type="number" name="protein" placeholder="Protein content (g)" onChange={this.handleEditChange.bind(this)}/>
      <br/>
      <input type="number" name="fat" placeholder="Fat content (g)" onChange={this.handleEditChange.bind(this)}/>
      <br/>
      <button onClick={this.saveBaking.bind(this)}>Save</button>
    </div>;
  }
}