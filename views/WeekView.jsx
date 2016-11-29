
'use babel';

import React from 'react';
const fs = require('fs');

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
      {this.state.food.map((food) => {
        const foodDescription = database.getCollection('foodBank').get(food.foodId);
        return <div key={food.$loki}>
          {food.quantity} {foodDescription.name}
        </div>
      })}
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
      <b>{this.state.meal.name}</b> - <i>{this.state.meal.dishName}</i>
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
      <h3><u>{this.state.dayName}</u></h3>
      {this.state.thisDaysMeals.map((meal) => {
        return <MealView mealId={meal.$loki} key={meal.$loki}/>
      })}
    </div>
  }

}



export default class WeekView extends React.Component {

  constructor(props) {
    super();
    this.state = {
      startDay: props.state.startDay,
      date: "",
      intro: ""
    }
    database = props.state.database;
    clientId = props.state.clientId;
    console.log("Week starting with dayID: " + this.state.startDay);
    const day = database.getCollection('clientsDays').get(this.state.startDay);
    if (day.date) {
      this.state.date = day.date;
    }
    if (day.intro) {
      this.state.intro = day.intro;
    }
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
    const client = database.getCollection('clients').get(clientId);
      return <div>
        <div style={style.title}><u>Meal Plan for {client.name}</u> {this.state.date}</div>
        <br/>
        <img src="./INlogo.jpg" style={style.logo}/>
        <div style={style.intro}>
        {this.state.intro}
        </div>
        <br/>
        <br/>
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

const style = {};
style.title = {
  color: 'grey',
  fontSize: 30
}
style.logo = {
  width: 250,
  height: 250,
  align: 'right'
}
style.intro = {
  fontSize: 20
}