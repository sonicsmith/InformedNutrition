
'use babel';

import React from 'react';
import Loki from 'lokijs';

let database;

export default class AddFood extends React.Component {

  constructor(props) {
    super();
    this.state = {
      setParentState: props.state.setParentState,
      foodId: props.state.foodId,
      name: "",
      calorie: 0,
      carb: 0,
      protein: 0,
      fat: 0
    };
    database = props.state.database;
    const foodCollection = database.getCollection('foodBank');
    const food = foodCollection.get(this.state.foodId);
    this.state.name = food.name;
    this.state.calorie = food.calorie;
    this.state.carb = food.carb;
    this.state.protein = food.protein;
    this.state.fat = food.fat;
  }

  handleEditChange(event) {
    const editType = event.target.name;
    this.setState({[editType]: event.target.value});
  }


  saveFood() {
    const foodCollection = database.getCollection('foodBank');
    const food = foodCollection.get(this.state.foodId);
    food.name = this.state.name;
    food.calorie = this.state.calorie;
    food.carb = this.state.carb;
    food.protein = this.state.protein;
    food.fat = this.state.fat;
    foodCollection.update(food);
    database.saveDatabase();
    console.log("Old Food Updated", this.state.name);
    this.state.setParentState({currentView: 'SelectClient'});
    alert("Food Updated.");
  }

  render() {
    return <div>
      <h1>Edit Food:</h1>
      <br/>
      Name:
      <br/>
      <input type="text" name="name" placeholder="Name and units" onChange={this.handleEditChange.bind(this)} value={this.state.name} />
      <br/><br/>
      Calorie:
      <br/>
      <input type="number" name="calorie" placeholder="Calorie content (g)" onChange={this.handleEditChange.bind(this)} value={this.state.calorie} />
      <br/><br/>
      Carb:
      <br/>
      <input type="number" name="carb" placeholder="Carb content (g)" onChange={this.handleEditChange.bind(this)} value={this.state.carb} />
      <br/><br/>
      Protein:
      <br/>
      <input type="number" name="protein" placeholder="Protein content (g)" onChange={this.handleEditChange.bind(this)} value={this.state.protein} />
      <br/><br/>
      Fat:
      <br/>
      <input type="number" name="fat" placeholder="Fat content (g)" onChange={this.handleEditChange.bind(this)} value={this.state.fat} />
      <br/><br/>
      <button onClick={this.saveFood.bind(this)}>Save</button>
      <br/>
    </div>;
  }
}