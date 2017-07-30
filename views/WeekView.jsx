
'use babel';

import React from 'react';
import {ipcRenderer} from 'electron';
const fs = require('fs');

let clientId;
let database;
let bakingList = [];



const pluralise = (amount, string) => {
  if (string.toLowerCase().includes('{s}')) {
    if (amount > 1) {
      string = string.replace('{s}', 's');
      string = string.replace('{S}', 'S');
    } else {
      string = string.replace('{s}', '');
      string = string.replace('{S}', '');
    }
  }
  return string;
}

const addToBaking = (newBaking) => {
  let existsAlready = false;
  for (let i = 0; i < bakingList.length; i++) {
    if (bakingList[i] == newBaking) {
      existsAlready = true;
    }
  }
  if (!existsAlready) {
    const length = bakingList.length; 
    bakingList[length] = newBaking;
  }
}

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
        const foodName = pluralise(food.quantity, foodDescription.name);
        return <div key={food.$loki}>
          {food.quantity} {foodName}
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
    // If baking exists, we'll bypass the dishName name and put the baking in
    let baking = database.getCollection('mealsBaking').where((obj) => {
      return obj.mealId == props.mealId;
    });
    if (baking[0] != undefined) {
      addToBaking(baking[0].bakingId)
      const bakingName = database.getCollection('bakingBank').get(baking[0].bakingId).unitName; // Note: UnitName, eg "pieces of cake"
      const quantity = baking[0].quantity;
      this.state.meal.dishName = quantity + ' ' + pluralise(quantity, bakingName);
    } 
  }

  render() {
    return <div>
      <b>{this.state.meal.name}</b> - <i>{this.state.meal.dishName}</i>
      <br/>
      <FoodView mealId={this.state.meal.$loki}/>
      <br/>
      {(this.state.meal.recipe == '' ? <div></div> : <div>{this.state.meal.recipe}<br/><br/><br/></div>)}
    </div>
  }

}


export class DayView extends React.Component {

  constructor(props) {
    super();
    this.state = {
      dayId: props.dayId,
      dayName: props.dayName,
      thisDaysMeals: []
    }
    let numMeals = 0;
    const mealsBackwards = database.getCollection('daysMeals').where((obj) => {
      const match = obj.dayId == this.state.dayId;
      if (match) {
        numMeals++;
      }
      return match;
    });
    for (let i = 0; i < numMeals; i++) {
      this.state.thisDaysMeals[i] = mealsBackwards[numMeals - i - 1];
    }
  }

  render() {
    return <div style={style.main}>
      <h1><u>{this.state.dayName}</u></h1>
      {this.state.thisDaysMeals.map((meal) => {
        return <MealView mealId={meal.$loki} key={meal.$loki}/>
      })}
    </div>
  }

}

export class Recipes extends React.Component {

  constructor(props) {
    super();
  }

  render() {
    return <div style={style.recipes}>
      {(bakingList.length == 0 ? <br/> : <b><u>Recipes:</u></b>)}
      <br/>
      <br/>
      {bakingList.map((bakingId) => {
        const baking = database.getCollection('bakingBank').get(bakingId);
        const singularName = pluralise(2, baking.name);
        return <div key={baking.$loki}>
          <b>{singularName}</b>
          <br/>
          {baking.recipe}
          <br/>
          <br/>
        </div>
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
    ipcRenderer.on('publish', (event, data) => {
        this.savePDF();
    });
  }

  savePDF() {
    const client = database.getCollection('clientsDays').get(clientId);
    console.log(client);
    console.log("createPDF clicked for: " + client.name);
    const remote = window.require('remote');
    const currentWindow = remote.getCurrentWindow();
    const contents = currentWindow.webContents;

    const pdfDir = __dirname + '/../PDFs/';

    if (!fs.existsSync(pdfDir)){
        fs.mkdirSync(pdfDir);
    }

    contents.printToPDF({pageSize: 'A4', landscape: false}, (error, data) => {
      if (error) {
        alert('Tell Nic:' + error);
      }
      const weekNumber = this.state.startDay;
      const fileName = client.name + '-' + weekNumber + '.pdf';
      fs.writeFile(pdfDir + fileName, data, (error) => {
        if (error) {
          alert('Tell Nic:' + error);
        }
        console.log('Write PDF successfully.')
        alert("File Saved: " + fileName);
      })
    });
  }

  render() {
    const client = database.getCollection('clients').get(clientId);
      return <div>
        <img src="./INlogo.jpg" style={style.logo}/>
        <div style={style.title}><u>Meal Plan for {client.name}</u> {this.state.date}</div>
        <br/>
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
        <br/>
        <br/>
        <Recipes/>
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
  position: 'absolute', 
  right: 0
}
style.intro = {
  fontSize: 20
}
style.main = {
  fontSize: 20
}
style.recipes = {
  fontSize: 20
}