
'use babel';

import React from 'react';
const fs = require('fs');



let clientId;
let database;
let dayId;
let weekNumber;
let dayNumber;


const getFoodFromId = (id) => {
  const foods = database.getCollection('foodBank');
  const food = foods.where((obj) => {return obj.$loki == id});
  return food[0];
}

const foodForMeal = (obj, mealNumber) => {
  const dayMatch = obj.dayId == dayId;
  const mealMatch = obj.mealNumber == mealNumber;
  return dayMatch && mealMatch;
}


export class Meal extends React.Component {

  constructor(props) {
    super();
    this.state = {
      mealId: props.mealId,
      mealName: props.mealName,
      setParentState: props.setParentState,
      countNutrients: props.countNutrients
    }
    // Get all meals from this day for this mealType
    this.state.thisMealsFood = database.getCollection('mealsFood').where(
      (obj) => {return obj.mealId == this.state.mealId} 
    );
  }

  addFood() {
    this.state.setParentState({currentView: 'SelectFood', mealId: this.state.mealId});
  }  

  updateReactMeals() {
    // // Update React
    this.setState({thisMealsFood: database.getCollection('mealsFood').where(
      (obj) => {return obj.mealId == this.state.mealId}
    )});
    this.state.countNutrients(false);
  }

  removeFood(id) {
    console.log("Remove food: "+id)
    const food = database.getCollection('mealsFood').find({'$loki': id});
    database.getCollection('mealsFood').remove(food[0]);
    database.saveDatabase();
    this.updateReactMeals();
  }

  handleQuantityChange(id, event) {
    const food = database.getCollection('mealsFood').find({'$loki': id});
    food[0].quantity = event.target.value;
    database.getCollection('mealsFood').update(food[0]);
    database.saveDatabase();
    this.updateReactMeals();
  }

  removeMeal() {
    // Remove all food for meal first
    const foodToRemove = database.getCollection('mealsFood').where(
      (obj) => {return obj.mealId == this.state.mealId;}
    );
    foodToRemove.map((food) => {
      console.log("food"+food);
      database.getCollection('mealsFood').remove(food);
    });
    // Remove meal
    let mealToRemove = database.getCollection('daysMeals').find({'$loki' : this.state.mealId});
    console.log(mealToRemove)
    database.getCollection('daysMeals').remove(mealToRemove[0]);
    database.saveDatabase();
    this.updateReactMeals();
  }

  render() {
    const thisMealsFood = this.state.thisMealsFood;
    return <div>
      <b>{this.state.mealName}</b><button onClick={this.removeMeal.bind(this)}>-</button><br/>
      <ul>
        {thisMealsFood.map((food) => {
          const id = food.$loki;
          const foodName = getFoodFromId(food.food).name;
          return <li key={id}>
            <input type="number" value={food.quantity} onChange={this.handleQuantityChange.bind(this, id)}/>
             x {foodName} <button onClick={this.removeFood.bind(this, id)}>-</button>
          </li>;
        })}
      </ul>
      <button onClick={this.addFood.bind(this)}>Add Food</button>
      <br/>
      <br/>
    </div>;
  }

}

export default class EditDay extends React.Component {

  constructor(props) {
    super();
    this.state = {
      setParentState: props.state.setParentState,
      newMealName: "",
      totalNutrients: {
        calorie: 0,
        carb: 0,
        protein: 0,
        fat: 0
      }
    }
    dayId = props.state.dayId;
    database = props.state.database;
    clientId = props.state.clientId;
    console.log("Edit dayId: " + dayId + " with clientId: " + clientId);
    // Get Client Name
    const client = database.getCollection('clients').where((obj) => {
      return obj.$loki == clientId;
    });
    this.state.client = client[0];
    const day = database.getCollection('clientsDays').where((obj) => {
      return obj.$loki == dayId;
    });
    dayNumber = day[0].dayOfWeek;
    weekNumber = day[0].week;
    // 
    this.state.thisDaysMeals = database.getCollection('daysMeals').where((obj) => {
      return obj.dayId == dayId;
    });
    // Total up nutrients for day
    this.countNutrients(true);
  }

  // Does same as in constructor, but triggers react
  countNutrients(forConstructor) {
    console.log("Count");
    let totalNutrients = {calorie: 0, carb: 0, protein: 0, fat: 0};
    database.getCollection('daysMeals').where((meal) => {
      // If this days meal
      if (meal.dayId == dayId) {
        // Get food for this meal
        database.getCollection('mealsFood').where((food) => {
          if (food.mealId == meal.$loki) {
            let nutrients = getFoodFromId(food.food);
            totalNutrients.calorie += nutrients.calorie * food.quantity;
            totalNutrients.carb += nutrients.carb * food.quantity;
            totalNutrients.protein += nutrients.protein * food.quantity;
            totalNutrients.fat += nutrients.fat * food.quantity;
          }
          return true;
        })
      }
      return true;
    });
    if (forConstructor) {
      this.state.totalNutrients = totalNutrients;
    } else {
      this.setState({totalNutrients: totalNutrients});
    }
  }

  newDaysMeal() {
    console.log("Add new meal: " + this.state.newMealName)
    database.getCollection('daysMeals').insert({
      dayId: dayId, 
      name: this.state.newMealName
    });
    database.saveDatabase();
    this.setState({thisDaysMeals: database.getCollection('daysMeals').where((obj) => { 
      return obj.dayId == dayId;
    })});
  }

  handleMealNameChange(event) {
    this.setState({newMealName: event.target.value});
  }

  render() {
    const meals = this.state.thisDaysMeals;
    meals.sort((a, b) => {
      return a.$loki - b.$loki;
    })
    return <div>
      <h1>{this.state.client.name}</h1>
      <b>Intolerances:</b> {this.state.client.intolerances}<br/>
      <b>Likes and Dislikes:</b> {this.state.client.likesDislikes}<br/>
      <b>Medications and Supplements:</b> {this.state.client.medications}<br/>
      <h3>Week:{weekNumber}, Day:{dayNumber}</h3>
      <b>Nutrition Totals: </b>
      Calorie: {this.state.totalNutrients.calorie}, Carb: {this.state.totalNutrients.carb}, 
      Protein: {this.state.totalNutrients.protein}, Fat: {this.state.totalNutrients.fat}<br/>
      <br/>
      <hr/>
      <ul>
        {meals.map((meal) => {
          const id = meal.$loki;
          return <li key={id}>
            <Meal mealId={id} mealName={meal.name} setParentState={this.state.setParentState} countNutrients={this.countNutrients.bind(this)}/>
          </li>;
        })}
      </ul>
      <input type="text" placeholder="Meal Name" onChange={this.handleMealNameChange.bind(this)}/>
      <button onClick={this.newDaysMeal.bind(this)}>New Meal</button>
    </div>;
  }
}

