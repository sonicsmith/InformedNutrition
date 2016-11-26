
'use babel';

import React from 'react';

let database;
let clientId;

const getDayId = (weekDay, weekNumber) => {
  const day = database.getCollection('clientsDays').where((obj) => {
    const weekDayMatch = obj.dayOfWeek == weekDay;
    const weekMatch = obj.week == weekNumber;
    const clientMatch = obj.clientId == clientId
    return weekDayMatch && weekMatch && clientMatch;
  });
  return day[0].$loki;
}

export class Week extends React.Component {

  constructor(props) {
    super();
    this.state = {
      weekNumber: props.weekNumber,
      setParentState: props.setParentState,
      date: "",
      intro: ""
    }
    const dayId = getDayId(1, this.state.weekNumber);
    const day = database.getCollection('clientsDays').get(dayId);
    if (day.date) {
      this.state.date = day.date;
    }
    if (day.intro) {
      this.state.intro = day.intro;
    }
  }

  handleClick(weekDay) {
    const dayId = getDayId(weekDay, this.state.weekNumber);
    console.log("EditDay called with dayId: " + dayId)
    this.state.setParentState({currentView: 'EditDay', dayId: dayId});
  }  

  createPDF() {
    const dayId = getDayId(1, this.state.weekNumber);
    this.state.setParentState({currentView: 'WeekView', clientId: clientId, startDay: dayId});
  }

  handleEditChange(event) {
    const editType = event.target.name;
    this.setState({[editType]: event.target.value});
  }

  saveWeekDetails() {
    // Save week Details to first day of week
    const dayId = getDayId(1, this.state.weekNumber);
    const day = database.getCollection('clientsDays').get(dayId);
    day.date = this.state.date;
    day.intro = this.state.intro;
    alert('Details Saved');
  }

  render() {
    return <div>
      Week {this.state.weekNumber}:
      <br/>
      <input type="text" name="date" placeholder="Date" value={this.state.date} onChange={this.handleEditChange.bind(this)}/>
      <br/>
      <button onClick={this.handleClick.bind(this, 1)}>M</button>
      <button onClick={this.handleClick.bind(this, 2)}>T</button>
      <button onClick={this.handleClick.bind(this, 3)}>W</button>
      <button onClick={this.handleClick.bind(this, 4)}>T</button>
      <button onClick={this.handleClick.bind(this, 5)}>F</button>
      <button onClick={this.handleClick.bind(this, 6)}>S</button>
      <button onClick={this.handleClick.bind(this, 7)}>S</button>
      <button onClick={this.createPDF.bind(this)}><b>Create PDF</b></button>
      <br/>
      <textarea rows="5" type="text" name="intro" placeholder="Intro" value={this.state.intro} onChange={this.handleEditChange.bind(this)}/>
      <br/>
      <button onClick={this.saveWeekDetails.bind(this)}>Save Week Details</button>
    </div>;
  }

}



const getDaysForWeek = (weekNumber) => {
  return database.getCollection('clientsDays').where((obj) => {
    const thisClient = obj.clientId == clientId;
    const rightWeek = obj.week == weekNumber;
    return thisClient && rightWeek;
  });
}

export default class EditClient extends React.Component {

  constructor(props) {
    super();
    this.state = {
      setParentState: props.state.setParentState
    }
    database = props.state.database;
    clientId = props.state.clientId;
    console.log("EditClient with clientId: "+clientId);
    this.state.client = database.getCollection('clients').get(clientId);
    const days = database.getCollection('clientsDays').where((obj) => {
      return obj.clientId == clientId;
    });
    this.state.days = days;
  }

  // Create a week
  createWeek() {
    const weekNumber = (Object.keys(this.state.days).length)/7 + 1;
    for (var index = 1; index < 8; index++) {
      database.getCollection('clientsDays').insert({ 
        clientId: this.state.client.$loki,
        week: weekNumber,
        dayOfWeek: index
      });
    }
    database.saveDatabase();
    // If there's a previous week for us to replicate'
    if (weekNumber > 1) {
      const thisWeeksDays = getDaysForWeek(weekNumber);
      const lastWeeksDays = getDaysForWeek(weekNumber - 1);

      // Go through the days of the last week
      for (let dayNumber = 0; dayNumber < 7; dayNumber++) {

        // Get previous days Meals
        const previousDaysMeals = database.getCollection('daysMeals').where((obj) => {
          return obj.dayId == lastWeeksDays[dayNumber].$loki;
        });

        // Add meals to this new day
        let mealNumber = 0;
        while (previousDaysMeals[mealNumber] != undefined) {
          const meal = previousDaysMeals[mealNumber]
          const newMeal = database.getCollection('daysMeals').insert({
            dayId: thisWeeksDays[dayNumber].$loki, 
            name: meal.name,
            dishName: meal.dishName,
            recipe: meal.recipe
          });

          // Find each food from Meal, add to meal
          const mealsFood = database.getCollection('mealsFood').where((obj) => {
            return obj.mealId == meal.$loki;
          });
          let foodNumber = 0;
          while (mealsFood[foodNumber] != undefined) {
            const food = mealsFood[foodNumber];
            database.getCollection('mealsFood').insert({
              mealId: newMeal.$loki,
              foodId: food.foodId,
              quantity: food.quantity
            });
            foodNumber++;
          }

          mealNumber++;
        }

      }

    }

    const days = database.getCollection('clientsDays').where((obj) => {
      return obj.clientId == this.state.client.$loki;
    });
    this.setState({days: days});
  }

  render() {
    var numWeeks = (Object.keys(this.state.days).length)/7;
    var weeks = [];
    for (var i = 1; i < numWeeks + 1; i++) {
      weeks.push(<li key={i}><Week weekNumber={i} setParentState={this.state.setParentState}/></li>);
    }
    return <div>
      <h1>{this.state.client.name}</h1>
      <b>Intolerances:</b> {this.state.client.intolerances}<br/>
      <b>Likes and Dislikes:</b> {this.state.client.likesDislikes}<br/>
      <b>Medications and Supplements:</b> {this.state.client.medications}<br/>
      <hr/>
      <ul>
        {weeks}
      </ul>
      <button onClick={this.createWeek.bind(this)}>Add Week</button>
    </div>;
  }
}