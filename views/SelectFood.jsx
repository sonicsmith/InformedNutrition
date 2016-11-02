
'use babel';

import React from 'react';

let mealId;
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
    mealId = props.state.mealId;
    mealNumber = props.state.mealNumber;
    database = props.state.database;
    this.state.foodList = database.getCollection('foodBank').where((obj) => { return true; });
  }

  // Add food
  handleClick(id) {
    // save food to meal
    database.getCollection('mealsFood').insert({
      mealId: mealId,
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
            const quantityFoodName = food.name + 'quantity';
            return <li key={id}>      
              <input type="number" name={quantityFoodName} onChange={this.handleQuantityChange.bind(this)}/>
              {food.name}
              <button onClick={this.handleClick.bind(this, id)}>+</button>
            </li>;
          })}
      </ul>
    </div>;
  }
}