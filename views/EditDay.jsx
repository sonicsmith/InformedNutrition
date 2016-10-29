
'use babel';

import React from 'react';
const fs = require('fs');



let clientId;
let database;
let dayId;
let weekNumber;
let dayNumber;


const getFoodFromId = (id) => {
  const foods = database.getCollection('food');
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
      mealNumber: props.mealNumber,
      setParentState: props.setParentState,
      countNutrients: props.countNutrients
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
    this.state.thisMealsFood = database.getCollection('meals').where(
      (obj) => foodForMeal(obj, this.state.mealNumber)
    );
  }

  addFood() {
    this.state.setParentState({currentView: 'SelectFood', mealNumber: this.state.mealNumber});
  }  

  removeFood(id) {
    const mealsCollection = database.getCollection('meals');
    const food = mealsCollection.find({'$loki': id } );
    mealsCollection.remove(food[0]);
    database.saveDatabase();
    // Update React
    this.setState({thisMealsFood: database.getCollection('meals').where(
      (obj) => foodForMeal(obj, this.state.mealNumber)
    )});
    this.state.countNutrients(false);
  }

  render() {
    const thisMealsFood = this.state.thisMealsFood;
    return <div>
      <b>{this.state.mealName}</b><br/>
      <ul>
        {thisMealsFood.map((food) => {
          const id = food.$loki;
          const foodName = getFoodFromId(food.food).name;
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
      setParentState: props.state.setParentState,
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
    const day = database.getCollection('days').where((obj) => {
      return obj.$loki == dayId;
    });
    dayNumber = day[0].dayOfWeek;
    weekNumber = day[0].week;
    // Total up nutrients for day
    this.countNutrients(true);
  }

  // Does same as in constructor, but triggers react
  countNutrients(forConstructor) {
    const totalFood = database.getCollection('meals').where((obj) => {
      return obj.dayId == dayId;
    });
    let totalNutrients = {calorie: 0, carb: 0, protein: 0, fat: 0};
    for (let i = 0; i < totalFood.length; i++) {
      const food = getFoodFromId(totalFood[i].food);
      totalNutrients.calorie += food.calorie;
      totalNutrients.carb += food.carb;
      totalNutrients.protein += food.protein;
      totalNutrients.fat += food.fat;
    }
    if (forConstructor) {
      this.state.totalNutrients = totalNutrients;
    } else {
      this.setState({totalNutrients: totalNutrients});
    }
  }

  createPDF() {
    console.log("createPDF clicked")
    const remote = window.require('remote');
    const currentWindow = remote.getCurrentWindow();
    const contents = currentWindow.webContents;
    contents.printToPDF({pageSize: 'A4', landscape: false}, (error, data) => {
      if (error) throw error
      const fileName = this.state.client + '-' + dayNumber + '-' + weekNumber + '.pdf';
      fs.writeFile(__dirname + '/' + fileName, data, (error) => {
        if (error) throw error
        console.log('Write PDF successfully.')
        alert("File Saved: " + fileName);
      })
    });
  }

  render() {
    let meals = []; // Not to be confused with the database 'meals''
    for (let i = 0; i < 5; i++) {
      meals.push(<li key={i}><Meal mealNumber={i} setParentState={this.state.setParentState} countNutrients={this.countNutrients.bind(this)}/></li>);
    }
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
      <button onClick={this.createPDF}>CREATE PDF</button>
      <hr/>
      <ul>
        {meals}
      </ul>
    </div>;
  }
}

