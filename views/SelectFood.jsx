
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
      quantity: 1
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
      quantity: this.state.quantity
    });
    database.saveDatabase();
    this.state.setParentState({currentView: 'EditDay'});
  }

  handleSearchChange() {
    //this.setState(this.state)
  }


  handleQuantityChange(event) {
    const editType = event.target.name;
    this.setState({quantity: event.target.value});
  }


  render() {
    const list = this.state.foodList;
    return <div>
      <input type="text" placeholder="Search" onChange={this.handleSearchChange}/>
      <ul>
          {list.map((food) => {
            const id = food.$loki;
            return <li key={id}>      
              <input type="text" name="name" placeholder="Quantity" onChange={this.handleQuantityChange.bind(this)}/>
              {food.name}
              <button onClick={this.handleClick.bind(this, id)}>+</button>
            </li>;
          })}
      </ul>
    </div>;
  }
}