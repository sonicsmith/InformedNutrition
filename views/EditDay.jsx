
'use babel';

import React from 'react';

let clientId;
let database;
let dayId;
let weekNumber;
let dayNumber;

// TODO: Mechanism for blocking foods and dishes

export class Meal extends React.Component {

  constructor(props) {
    super();
    this.state = {
      mealId: props.mealId,
      mealName: props.mealName,
      setParentState: props.setParentState,
      countNutrients: props.countNutrients,
      dishName: "",
      recipe: ""
    }
    // Get all meals from this day for this mealType
    this.state.thisMealsFood = database.getCollection('mealsFood').where(
      (obj) => {return obj.mealId == this.state.mealId} 
    );
    const meal = database.getCollection('daysMeals').get(this.state.mealId);
    if (meal.dishName != undefined) {
      this.state.dishName = meal.dishName;
    }
    if (meal.recipe != undefined) {
      this.state.recipe = meal.recipe;
    }
  }

  addFood() {
    this.state.setParentState({currentView: 'SelectFood', mealId: this.state.mealId, dishId: null});
  }

  addDish() {
    this.state.setParentState({currentView: 'SelectDish', mealId: this.state.mealId});
  }

  updateReactMeals() {
    // // Update React
    this.setState({thisMealsFood: database.getCollection('mealsFood').where(
      (obj) => {return obj.mealId == this.state.mealId}
    )});
    this.state.countNutrients(false);
  }

  removeFood(id) {
    console.log("Remove food: " + id)
    const food = database.getCollection('mealsFood').get(id);
    database.getCollection('mealsFood').remove(food);
    database.saveDatabase();
    this.updateReactMeals();
  }

  handleQuantityChange(id, event) {
    const food = database.getCollection('mealsFood').get(id);
    food.quantity = event.target.value;
    database.getCollection('mealsFood').update(food);
    database.saveDatabase();
    this.updateReactMeals();
  }

  handleEditChange(event) {
    const editType = event.target.name;
    this.setState({[editType]: event.target.value});
  }

  saveMealInfo() {
    console.log("Saving changes to meal")
    const meal = database.getCollection('daysMeals').get(this.state.mealId);
    meal.dishName = this.state.dishName;
    meal.recipe = this.state.recipe;
    database.getCollection('daysMeals').update(meal);
    database.saveDatabase();
  }

  removeMeal() {
    // Remove all food for meal first
    console.log("Removing meal")
    const foodToRemove = database.getCollection('mealsFood').where((obj) => {
      return obj.mealId == this.state.mealId;
    });
    foodToRemove.map((food) => {
      database.getCollection('mealsFood').remove(food);
    });
    // Remove meal
    let mealToRemove = database.getCollection('daysMeals').get(this.state.mealId);
    database.getCollection('daysMeals').remove(mealToRemove);
    database.saveDatabase();
    console.log("Meal removed");
    this.updateReactMeals();
  }

  render() {
    const thisMealsFood = this.state.thisMealsFood;
    return <div>
      <b>{this.state.mealName}</b><button onClick={this.removeMeal.bind(this)}>-</button><br/>
      <input type="text" name="dishName" value={this.state.dishName} onChange={this.handleEditChange.bind(this)} onBlur={this.saveMealInfo.bind(this)}/>
      <ul>
        {thisMealsFood.map((food) => {
          const id = food.$loki;
          const foodName = database.getCollection('foodBank').get(food.foodId).name;
          return <li key={id}>
            <input type="number" value={food.quantity} onChange={this.handleQuantityChange.bind(this, id)}/>
             x {foodName} <button onClick={this.removeFood.bind(this, id)}>-</button>
          </li>;
        })}
      </ul>
      <button onClick={this.addFood.bind(this)}>Add Food</button>
      <button onClick={this.addDish.bind(this)}>Add Dish</button>
      <br/>
      <br/>
      <textarea rows="5" type="text" name="recipe" value={this.state.recipe} onChange={this.handleEditChange.bind(this)}/>
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
    this.state.client = database.getCollection('clients').get(clientId);
    const day = database.getCollection('clientsDays').get(dayId);
    dayNumber = day.dayOfWeek;
    weekNumber = day.week;
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
            let nutrients = database.getCollection('foodBank').get(food.foodId);
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
    // this.state.thisDaysMeals not in use since we do this below
    const meals = database.getCollection('daysMeals').where((obj) => { 
      return obj.dayId == dayId;
    });
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

