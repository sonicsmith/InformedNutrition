
'use babel';

import React from 'react';

let clientId;
let database;




export class FoodView extends React.Component {

  constructor(props) {
    super();
    this.state = {}
    this.state.food = database.getCollection('mealsFood').where((obj) => {
      return obj.mealId == props.mealId;
    });
  }

  render() {
    return <div>
      <ul>
        {this.state.food.map((food) => {
          const foodDescription = database.getCollection('foodBank').get(food.foodId);
          return <li key={food.$loki}>
            {food.quantity}
            {foodDescription.name}
          </li>
        })}
      </ul>
    </div>
  }

}


export class MealView extends React.Component {

  constructor(props) {
    super();
    this.state = {
      meal: database.getCollection('daysMeals').get(props.mealId)
    }
  }

  render() {
    return <div>
      {this.state.meal.name}
      <br/>
      {this.state.meal.dishName}
      <br/>
      <FoodView mealId={this.state.meal.$loki}/>
      <br/>
      {this.state.meal.recipe}
      <br/>
    </div>
  }

}


export class DayView extends React.Component {

  constructor(props) {
    super();
    this.state = {
      dayId: props.dayId,
      dayName: props.dayName
    }
    this.state.thisDaysMeals = database.getCollection('daysMeals').where((obj) => {
      return obj.dayId == this.state.dayId;
    });
  }

  render() {
    return <div>
      {this.state.dayName}
      <ul>
        {this.state.thisDaysMeals.map((meal) => {
          return <li key={meal.$loki}><MealView mealId={meal.$loki}/></li>
        })}
      </ul>
    </div>
  }

}



export default class WeekView extends React.Component {

  constructor(props) {
    super();
    this.state = {
      startDay: props.state.startDay
    }
    database = props.state.database;
    clientId = props.state.clientId;
    console.log("Week starting with dayID: " + this.state.startDay);
  }

  createPDF() {
    // const client = database.getCollection('clientsDays').get(clientId);
    // console.log("createPDF clicked for: " + client.name);
    // const remote = window.require('remote');
    // const currentWindow = remote.getCurrentWindow();
    // const contents = currentWindow.webContents;
    // contents.printToPDF({pageSize: 'A4', landscape: false}, (error, data) => {
    //   if (error) throw error
    //   const fileName = client.name + '-' + weekNumber + '.pdf';
    //   fs.writeFile(__dirname + '/' + fileName, data, (error) => {
    //     if (error) throw error
    //     console.log('Write PDF successfully.')
    //     alert("File Saved: " + fileName);
    //   })
    // });
  }

  render() {
      return <div>
        <DayView dayId={this.state.startDay + 0} dayName="Monday"/>
        <DayView dayId={this.state.startDay + 1} dayName="Tuesday"/>
        <DayView dayId={this.state.startDay + 2} dayName="Wednesday"/>
        <DayView dayId={this.state.startDay + 3} dayName="Thursday"/>
        <DayView dayId={this.state.startDay + 4} dayName="Friday"/>
        <DayView dayId={this.state.startDay + 5} dayName="Saturday"/>
        <DayView dayId={this.state.startDay + 6} dayName="Sunday"/>
      </div>
  }

}