
'use babel';

import React from 'react';

let mealId;
// let mealNumber;
let database;


export default class SelectDish extends React.Component {

  constructor(props) {
    super();
    this.state = {
      setParentState: props.state.setParentState,
      nextAction: props.state.nextAction
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
    mealId = props.state.mealId;
    // mealNumber = props.state.mealNumber;
    database = props.state.database;
    this.state.dishList = database.getCollection('dishBank').where((obj) => { return true; });
  }

  // Add Dish
  addDish(id) {
    if (this.state.nextAction == 'AddDish') {
      this.state.setParentState({currentView: 'AddDish', dishId: id, nextAction: ''});
      return;
    }
    // Get all the food from dish
    let numFood = 0;
    const dishesFoods = database.getCollection('dishesFoods').where((obj) => {
      const dishMatch = obj.dishId == id;
      if (dishMatch) {
        numFood++;
      }
      return dishMatch;
    });
    // save to the meal
    for (let index = numFood - 1; index >= 0; index--) {
      const food = dishesFoods[index];
      database.getCollection('mealsFood').insert({
        mealId: mealId,
        foodId: food.foodId,
        quantity: food.quantity
      });
    }
    // name and recipe
    const dish = database.getCollection('dishBank').get(id);
    const meal = database.getCollection('daysMeals').get(mealId);
    meal.dishName = dish.dishName;
    meal.recipe = dish.recipe;
    database.getCollection('daysMeals').update(meal);
    database.saveDatabase();
    this.state.setParentState({currentView: 'DayView'});
  }

  handleSearchChange(event) {
    const filter = event.target.value;
    if (filter == "") {
      const allDishes = database.getCollection('dishBank').where((obj) => {return true;});
      this.setState({dishList: allDishes});
    } else {
      const filteredDishes = database.getCollection('dishBank').where((obj) => {
        return obj.dishName.toLowerCase().includes(filter.toLowerCase());
      });
      this.setState({dishList: filteredDishes});
    }
  }

  render() {
    const list = this.state.dishList;
    return <div>
      <h1>Select Dish:</h1>
      <input type="text" placeholder="Search" onChange={this.handleSearchChange.bind(this)}/>
      <ul>
          {list.map((dish) => {
            const id = dish.$loki;
            return <li key={id}>
              {dish.dishName}
              <button onClick={this.addDish.bind(this, id)}>+</button>
            </li>;
          })}
      </ul>
    </div>;
  }
}