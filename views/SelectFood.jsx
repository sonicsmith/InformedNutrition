
'use babel';

import React from 'react';

let dayId;
let mealNumber;
let database;


export default class SelectFood extends React.Component {

  constructor(props) {
    super();
    this.state = {
      setParentState: props.state.setParentState,
      foodList: [{name:"loading"}],
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
    dayId = props.state.dayId;
    mealNumber = props.state.mealNumber;
    database = props.state.database;
    const foodCollection = database.getCollection('food');
    this.state.foodList = foodCollection.where((obj) => {return true;});
  }

  // Add food
  handleClick(id) {
    // save food to meal
    const mealsCollection = database.getCollection('meals');
    mealsCollection.insert({
      dayId: dayId,
      mealNumber: mealNumber,
      food: id,
      quantity: 1 // TODO
    });
    database.saveDatabase();
    this.state.setParentState({currentView: 'EditDay'});
  }

  handleSearchChange() {
    //this.setState(this.state)
  }

  render() {
    const list = this.state.foodList;
    return <div>
      <input type="text" placeholder="Search" onChange={this.handleSearchChange}/>
      <ul>
          {list.map((food) => {
            const id = food.$loki;
            return <li key={id}>
              {food.name}<button onClick={this.handleClick.bind(this, id)}>+</button>
            </li>;
          })}
      </ul>
    </div>;
  }
}