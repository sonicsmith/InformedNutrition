
'use babel';

import React from 'react';

let clientId;
let clientName;
let database;
let dayId;
let weekNumber;
let dayNumber;


const getFoodNameFromId = (id) => {
  console.log("Food:"+id);
  const foods = database.getCollection('food');
  const food = foods.where((obj) => {return obj.$loki == id});
  return food[0].name;
}


export class Meal extends React.Component {

  constructor(props) {
    super();
    this.state = {
      mealNumber: props.mealNumber,
      setParentState: props.setParentState
    }
    switch(this.state.mealNumber) {
      case 0:
        this.state.mealName = "Breakfast:";
        break;
      case 1:
        this.state.mealName = "Brunch:";
        break;
      case 2:
        this.state.mealName = "Lunch:";
        break;
      case 3:
        this.state.mealName = "Afternoon tea:";
        break;
      case 4:
        this.state.mealName = "Dinner:";
        break;
    }
    // Get all meals from this day for this mealType
    const mealsFoodCollection = database.getCollection('meals');
    this.state.thisMealsFood = mealsFoodCollection.where((obj) => {
      const dayMatch = obj.dayId == dayId;
      const mealMatch = obj.mealNumber == this.state.mealNumber;
      return dayMatch && mealMatch;
    });

  }

  addFood() {
    this.state.setParentState({currentView: 'SelectFood', mealNumber: this.state.mealNumber});
  }  

  removeFood(id) {
    //
  }

  render() {
    let thisMealsFood = this.state.thisMealsFood;
    return <div>
      <b>{this.state.mealName}</b><br/>
      <ul>
        {thisMealsFood.map((food) => {
          const id = food.$loki;
          const foodName = getFoodNameFromId(food.food);
          return <li key={id}>
            {food.quantity} x {foodName} <button onClick={this.removeFood.bind(this, id)}>-</button>
          </li>;
        })}
      </ul>
      <button onClick={this.addFood.bind(this)}>Add Food</button>
      <br/>
    </div>;
  }

}

export default class EditDay extends React.Component {

  constructor(props) {
    super();
    this.state = {
      setParentState: props.state.setParentState
    }
    dayId = props.state.dayId;
    database = props.state.database;
    clientId = props.state.clientId;
    console.log("Edit dayId: " + dayId + " with clientId: " + clientId);
    // Get Client Name
    const client = database.getCollection('clients').where((obj) => {
      return obj.$loki == clientId;
    });
    clientName = client[0].name;
    const day = database.getCollection('days').where((obj) => {
      return obj.$loki == dayId;
    });
    dayNumber = day[0].dayOfWeek;
    weekNumber = day[0].week;
  }

  handleClick(mealType) {
    // const daysCollection = this.state.database.getCollection('days');
    // const weekNumber = (Object.keys(this.state.days).length)/7 + 1;
    // for (var index = 1; index < 8; index++) {
    //   daysCollection.insert({ clientId: this.state.client.$loki, week: weekNumber, dayOfWeek: index});
    // }
    // this.state.database.saveDatabase();
    // let days = daysCollection.where((obj) => {
    //   return obj.clientId == this.state.client.$loki;
    // });
    // this.setState({days: days});
  }

  render() {
    let meals = []; // Not to be confused with the database meals
    for (var i = 0; i < 5; i++) {
      meals.push(<li key={i}><Meal mealNumber={i} setParentState={this.state.setParentState}/></li>);
    }
    return <div>
      <h1>{clientName}</h1>
      <h3>Week:{weekNumber}, Day:{dayNumber}</h3>
      <hr/>
      <ul>
        {meals}
      </ul>
    </div>;
  }
}