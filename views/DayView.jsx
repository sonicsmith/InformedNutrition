
'use babel';

import React from 'react';

let clientId;
let database;
let dayId;
let weekNumber;
let dayNumber;


const getTotalMeals = () => {
    let totalMeals = 0;
    const meals = database.getCollection('daysMeals').where((obj) => {
      totalMeals++;
      return obj.dayId == dayId;
    });
    return totalMeals;
}


// TODO: Mechanism for blocking foods and dishes

export class Meal extends React.Component {

  constructor(props) {
    super();
    this.state = {
      mealId: props.mealId,
      mealName: props.mealName,
      setParentState: props.setParentState,
      countNutrients: props.countNutrients,
      swapMeals: props.swapMeals,
      dishName: "",
      recipe: "",
      order: 0
    }
    // Get all food for this meal
    this.state.thisMealsFood = database.getCollection('mealsFood').where(
      (obj) => {return obj.mealId == this.state.mealId} 
    );
    // Get all baking for this meal
    this.state.thisMealsBaking = database.getCollection('mealsBaking').where(
      (obj) => {return obj.mealId == this.state.mealId} 
    );
    const meal = database.getCollection('daysMeals').get(this.state.mealId);
    if (meal.dishName != undefined) {
      this.state.dishName = meal.dishName;
    }
    if (meal.recipe != undefined) {
      this.state.recipe = meal.recipe;
    }
    this.state.order = meal.order;
  }

  addFood() {
    this.state.setParentState({currentView: 'SelectFood', mealId: this.state.mealId, dishId: null}); // SelectFood needs 2 values
  }

  addDish() {
    this.state.setParentState({currentView: 'SelectDish', mealId: this.state.mealId});
  }

  addBaking() {
    this.state.setParentState({currentView: 'SelectBaking', mealId: this.state.mealId});
  }

  updateReactMeals() {
    // // Update React
    this.setState({thisMealsFood: database.getCollection('mealsFood').where(
      (obj) => {return obj.mealId == this.state.mealId}
    )});
    this.setState({thisMealsBaking: database.getCollection('mealsBaking').where(
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

  removeBaking(id) {
    console.log("Remove baking: " + id)
    const baking = database.getCollection('mealsBaking').get(id);
    database.getCollection('mealsBaking').remove(baking);
    database.saveDatabase();
    this.updateReactMeals();
  }

  handleQuantityBakingChange(id, event) {
    const baking = database.getCollection('mealsBaking').get(id);
    baking.quantity = event.target.value;
    database.getCollection('mealsBaking').update(baking);
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

  changeOrder(direction) {
    const newOrder = this.state.order + direction;
    const oldOrder = this.state.order;
    const totalMeals = getTotalMeals();
    if (newOrder >= 0 && newOrder < totalMeals) {
      const oldPlaceMeal = database.getCollection('daysMeals').where((obj) => {
        return obj.order == newOrder;
      });
      const meal1 = database.getCollection('daysMeals').get(this.state.mealId);
      const meal2 = database.getCollection('daysMeals').get(oldPlaceMeal[0].$loki);
      this.state.swapMeals(meal1, meal2)
    }
  }


  render() {
    const thisMealsFood = this.state.thisMealsFood;
    const thisMealsBaking = this.state.thisMealsBaking;
    return <div>
      <button onClick={this.changeOrder.bind(this, -1)}>↑</button><button onClick={this.changeOrder.bind(this, 1)}>↓</button>
      <b>{this.state.mealName}</b><button onClick={this.removeMeal.bind(this)}>-</button><br/>
      <input type="text" name="dishName" value={this.state.dishName} onChange={this.handleEditChange.bind(this)} onBlur={this.saveMealInfo.bind(this)}/>
      <ul>
        {thisMealsFood.map((food) => {
          const id = food.$loki;
          const foodItem = database.getCollection('foodBank').get(food.foodId);
          const foodName = foodItem.name;
          const cal = foodItem.calorie * food.quantity;
          const carb = foodItem.carb * food.quantity;
          const fat = foodItem.fat * food.quantity;
          const protein = foodItem.protein * food.quantity;
          const foodNutrientValues = " → Cal: " + cal + ", Carb: " + carb + ", Fat: " + fat + ", Pro: " + protein;
          return <li key={id}>
            <input type="number" value={food.quantity} onChange={this.handleQuantityChange.bind(this, id)}/>
             x {foodName} <button onClick={this.removeFood.bind(this, id)}>-</button>{foodNutrientValues}
          </li>;
        })}
      </ul>
      <ul>
        {thisMealsBaking.map((baking) => {
          const id = baking.$loki;
          const bakingName = database.getCollection('bakingBank').get(baking.bakingId).name;
          return <li key={id}>
            <input type="number" value={baking.quantity} onChange={this.handleQuantityBakingChange.bind(this, id)}/>
             x <b>{bakingName}</b> <button onClick={this.removeBaking.bind(this, id)}>-</button>
          </li>;
        })}
      </ul>
      <button onClick={this.addFood.bind(this)}>Add Food</button>
      <button onClick={this.addDish.bind(this)}>Add Dish</button>
      <button onClick={this.addBaking.bind(this)}>Add Baking</button>
      <br/>
      <br/>
      <textarea rows="5" type="text" name="recipe" value={this.state.recipe} onChange={this.handleEditChange.bind(this)}/>
      <br/>
    </div>;
  }

}

export default class DayView extends React.Component {

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
        });
        // Get baking for this meal
        database.getCollection('mealsBaking').where((baking) => {
          if (baking.mealId == meal.$loki) {
            let nutrients = database.getCollection('bakingBank').get(baking.bakingId);
            totalNutrients.calorie += nutrients.calorie * baking.quantity;
            totalNutrients.carb += nutrients.carb * baking.quantity;
            totalNutrients.protein += nutrients.protein * baking.quantity;
            totalNutrients.fat += nutrients.fat * baking.quantity;
          }
          return true;
        });
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
    console.log("Add new meal: " + this.state.newMealName);
    const totalMeals = getTotalMeals();
    database.getCollection('daysMeals').insert({
      dayId: dayId, 
      name: this.state.newMealName,
      order: totalMeals
    });
    database.saveDatabase();
    this.setState({thisDaysMeals: database.getCollection('daysMeals').where((obj) => { 
      return obj.dayId == dayId;
    })});
  }

  handleMealNameChange(event) {
    this.setState({newMealName: event.target.value});
  }

  refreshDay() {
    this.state.setParentState({currentView: 'refresh'});
    setTimeout(()=> {
      this.state.setParentState({currentView: 'DayView', dayId: dayId});
    }, 1);
  }

  changeDay(weekDay) {
    const dayDifference = weekDay - dayNumber;
    dayId = dayId + dayDifference;
    this.refreshDay();
  }

  swapMeals(meal1, meal2) {
      const meal1Order = meal1.order;
      const meal2Order = meal2.order;
      meal1.order = meal2Order;
      meal2.order = meal1Order;
      database.getCollection('daysMeals').update(meal1);
      database.saveDatabase();
      database.getCollection('daysMeals').update(meal2);
      database.saveDatabase();
      const meals = database.getCollection('daysMeals').where((obj) => { 
        return obj.dayId == dayId;
      });
      this.refreshDay();
  }

  render() {
    // this.state.thisDaysMeals not in use since we do this below
    const meals = database.getCollection('daysMeals').where((obj) => { 
      return obj.dayId == dayId;
    });
    meals.sort((a, b) => {
      return a.order - b.order;
    });
    return <div>
      {this.state.bullshit}
      <h1>{this.state.client.name}</h1>
      <b>Intolerances:</b> {this.state.client.intolerances}<br/>
      <b>Likes:</b> {this.state.client.likes}<br/>
      <b>Dislikes:</b> {this.state.client.dislikes}<br/>
      <b>Medications and Supplements:</b> {this.state.client.medications}<br/>
      <button onClick={this.changeDay.bind(this, 1)}>M</button>
      <button onClick={this.changeDay.bind(this, 2)}>T</button>
      <button onClick={this.changeDay.bind(this, 3)}>W</button>
      <button onClick={this.changeDay.bind(this, 4)}>T</button>
      <button onClick={this.changeDay.bind(this, 5)}>F</button>
      <button onClick={this.changeDay.bind(this, 6)}>S</button>
      <button onClick={this.changeDay.bind(this, 7)}>S</button>
      <h1>Week:{weekNumber}, Day:{dayNumber}</h1>
      <b>Nutrition Totals: </b>
      Calorie: {this.state.totalNutrients.calorie}, Carb: {this.state.totalNutrients.carb}, 
      Protein: {this.state.totalNutrients.protein}, Fat: {this.state.totalNutrients.fat}<br/>
      <br/>
      <hr/>
      <ul>
        {meals.map((meal) => {
          const id = meal.$loki;
          return <li key={id}>
            <Meal mealId={id} mealName={meal.name} setParentState={this.state.setParentState} countNutrients={this.countNutrients.bind(this)} swapMeals={this.swapMeals.bind(this)} />
          </li>;
        })}
      </ul>
      <input type="text" placeholder="Meal Name" onChange={this.handleMealNameChange.bind(this)}/>
      <button onClick={this.newDaysMeal.bind(this)}>New Meal</button>
    </div>;
  }
}

