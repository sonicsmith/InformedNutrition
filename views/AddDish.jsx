
'use babel';

import React from 'react';
import Loki from 'lokijs';

let database;


const getFoodFromId = (id) => {
  return database.getCollection('foodBank').get(id);
}


export default class AddDish extends React.Component {

  constructor(props) {
    super();
    this.state = {
      setParentState: props.state.setParentState,
      dishId: -1,
      dishname: "",
      thisDishesFood: [],
      recipe: "",
      saved: false
    };
    database = props.state.database;
    if (props.state.dishId >= 0) { // DANGEROUS?
      // Reload last dish
      console.log("Reloading last dish.")
      const currentDish = database.getCollection('dishBank').get(props.state.dishId);
      this.state.dishId = currentDish.$loki;
      this.state.dishname = currentDish.name;
      this.state.recipe = currentDish.recipe;
      this.state.thisDishesFood = database.getCollection('dishesFoods').where(
        (obj) => {return obj.dishId == this.state.dishId} 
      );
      this.state.saved = true;
    }
  }

  handleEditChange(event) {
    const editType = event.target.name;
    this.setState({[editType]: event.target.value});
  }


  addFood() {
    this.state.setParentState({currentView: 'SelectFood', mealId: null, dishId: this.state.dishId});
  }

  createDish() {
    // Create an entry
    database.getCollection('dishBank').insert({
      name: this.state.dishname,
      recipe: ""
    });
    database.saveDatabase();
    let lastEntryId = 0;
    database.getCollection('dishBank').where(
      (obj) => {
        if (obj.$loki > lastEntryId) {
          lastEntryId = obj.$loki;
        }
        return true;
      }
    );
    this.state.dishId = lastEntryId;
    // Unlock the input boxes
    this.setState({ saved: true });
    console.log("Saved dish: " + this.state.dishname + ", with Id: " + lastEntryId);
  }

  updateReactMeals() {
    // // // Update React
    // this.setState({thisMealsFood: database.getCollection('mealsFood').where(
    //   (obj) => {return obj.mealId == this.state.mealId}
    // )});
    // this.state.countNutrients(false);
  }

  removeFood(id) {
    // console.log("Remove food: "+id)
    // const food = database.getCollection('mealsFood').find({'$loki': id});
    // database.getCollection('mealsFood').remove(food[0]);
    // database.saveDatabase();
    // this.updateReactMeals();
  }

  handleQuantityChange(id, event) {
    const food = database.getCollection('dishesFoods').get(id);
    food.quantity = event.target.value;
    database.getCollection('dishesFoods').update(food);
    database.saveDatabase();
    // this.updateReactMeals();
  }

  saveRecipe() {

  }

  render() {
    let thisDishesFood = this.state.thisDishesFood;
    return <div>

      <div>
        {(!this.state.saved ? <div>
            <input type="text" name="dishname" placeholder="Dish Name" onChange={this.handleEditChange.bind(this)}/>
            <br/>
            <button onClick={this.createDish.bind(this)}>Create Dish</button>
          </div> 
            :  
          <div>
            <b>{this.state.dishname}:</b>
            <ul>
              {thisDishesFood.map((food) => {
                const id = food.$loki;
                const foodName = getFoodFromId(food.foodId).name;
                return <li key={id}>
                  <input type="number" value={food.quantity} onChange={this.handleQuantityChange.bind(this, id)}/>
                  x {foodName} <button onClick={this.removeFood.bind(this, id)}>-</button>
                </li>;
              })}
            </ul>
            <br/>
            <button onClick={this.addFood.bind(this)}>Add Food</button>
            <br/>
            <br/>
            <textarea rows="5" type="text" name="recipe" placeholder="Recipe" onChange={this.handleEditChange.bind(this)}/>
            <br/>
            <button onClick={this.saveRecipe.bind(this)}>Save Recipe</button>
          </div> )}

        <br/>
      </div>

    </div>;
  }
}