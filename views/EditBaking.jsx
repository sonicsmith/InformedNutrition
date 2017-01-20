
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
      fat: 0,
      bakingId: props.state.bakingId
    };
    database = props.state.database;
    const baking = database.getCollection('bakingBank').get(this.state.bakingId);
    this.state.name = baking.name;
    this.state.unitName = baking.unitName;
    this.state.recipe = baking.recipe;
    this.state.calorie = baking.calorie;
    this.state.carb = baking.carb;
    this.state.protein = baking.protein;
    this.state.fat = baking.fat;
  }

  handleEditChange(event) {
    const editType = event.target.name;
    this.setState({[editType]: event.target.value});
  }


  saveBaking() {
    const bakingBank = database.getCollection('bakingBank');
    const baking = bakingBank.get(this.state.bakingId);
    baking.name = this.state.name,
    baking.unitName = this.state.unitName,
    baking.recipe = this.state.recipe,
    baking.calorie = this.state.calorie,
    baking.carb = this.state.carb,
    baking.protein = this.state.protein,
    baking.fat = this.state.fat
    bakingBank.update(baking); 
    database.saveDatabase();
    console.log('Baking Updated', this.state.name);
    this.state.setParentState({currentView: '', nextAction: ''});
    alert("Baking Saved.");
  }

  render() {
    return <div>
      Name:
      <br/>
      <input type="text" name="name" placeholder="Name" onChange={this.handleEditChange.bind(this)} value={this.state.name}/>
      <br/>
      <br/>
      Unit Name phrase:
      <br/>
      <input type="text" name="unitName" placeholder="piece{s} of cake" onChange={this.handleEditChange.bind(this)} value={this.state.unitName}/>
      <br/>
      <br/>
      Recipe:
      <br/>
      <textarea rows="5" type="text" name="recipe" placeholder="Recipe" onChange={this.handleEditChange.bind(this)} value={this.state.recipe}/>
      <br/>
      <br/>
      Calorie:
      <br/>
      <input type="number" name="calorie" placeholder="Calorie content (g)" onChange={this.handleEditChange.bind(this)} value={this.state.calorie}/>
      <br/>
      <br/>
      Carb:
      <br/>
      <input type="number" name="carb" placeholder="Carb content (g)" onChange={this.handleEditChange.bind(this)} value={this.state.carb}/>
      <br/>
      <br/>
      Protein:
      <br/>
      <input type="number" name="protein" placeholder="Protein content (g)" onChange={this.handleEditChange.bind(this)} value={this.state.protein}/>
      <br/>
      <br/>
      Fat:
      <br/>
      <input type="number" name="fat" placeholder="Fat content (g)" onChange={this.handleEditChange.bind(this)} value={this.state.fat}/>
      <br/>
      <br/>
      <button onClick={this.saveBaking.bind(this)}>Save</button>
    </div>;
  }
}