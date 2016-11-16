
'use babel';

import React from 'react';

let mealId;
let mealNumber;
let database;


export default class SelectDish extends React.Component {

  constructor(props) {
    super();
    this.state = {
      setParentState: props.state.setParentState,
      dishList: [{name:"loading"}]
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
    mealId = props.state.mealId;
    mealNumber = props.state.mealNumber;
    database = props.state.database;
    this.state.foodList = database.getCollection('dishBank').where((obj) => { return true; });
  }

  // Add Dish
  handleClick(id) {
    // Get all the food from dish
    // save to database

    // save food to meal
    // database.getCollection('mealsFood').insert({
    //   mealId: mealId,
    //   foodId: id,
    //   quantity: this.state.quantity
    // });
    // database.saveDatabase();
    // this.state.setParentState({currentView: 'EditDay'});
  }

  handleSearchChange() {
    //this.setState(this.state)
  }

  render() {
    const list = this.state.dishList;
    return <div>
      <input type="text" placeholder="Search" onChange={this.handleSearchChange}/>
      <ul>
          {list.map((dish) => {
            const id = dish.$loki;
            return <li key={id}>
              {dish.name}
              <button onClick={this.handleClick.bind(this, id)}>+</button>
            </li>;
          })}
      </ul>
    </div>;
  }
}