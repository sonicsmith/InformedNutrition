
'use babel';

import React from 'react';

let mealId;
// let mealNumber;
let database;


export default class SelectDish extends React.Component {

  constructor(props) {
    super();
    this.state = {
      setParentState: props.state.setParentState
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
    mealId = props.state.mealId;
    // mealNumber = props.state.mealNumber;
    database = props.state.database;
    this.state.dishList = database.getCollection('dishBank').where((obj) => { return true; });
  }

  // Add Dish
  handleClick(id) {
    // Get all the food from dish
    const dishesFoods = database.getCollection('dishesFoods').where((obj) => { return obj.dishId == id; });
    // save to the meal
    console.log(dishesFoods);
    let index = 0;
    while (dishesFoods[index] != undefined) {
      const food = dishesFoods[index];
      database.getCollection('mealsFood').insert({
        mealId: mealId,
        foodId: food.foodId,
        quantity: food.quantity
      });
      index++; 
    }
    // recipe
    const dish = database.getCollection('dishBank').get(id);
    const meal = database.getCollection('daysMeals').get(mealId);
    meal.recipe = dish.recipe;
    database.getCollection('daysMeals').update(meal);
    database.saveDatabase();
    this.state.setParentState({currentView: 'EditDay'});
  }

  handleSearchChange() {
    //this.setState(this.state)
  }

  render() {
    const list = this.state.dishList;
    return <div>
      <input type="text" placeholder="Search" onChange={this.handleSearchChange}/>
      <ul>
          {list.map((dish) => {
            const id = dish.$loki;
            return <li key={id}>
              {dish.name}
              <button onClick={this.handleClick.bind(this, id)}>+</button>
            </li>;
          })}
      </ul>
    </div>;
  }
}