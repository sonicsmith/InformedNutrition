
'use babel';

import React from 'react';

let mealId;
let dishId;
// let mealNumber;
let database;



const duplicateExists = (id, collection) => {

  return
}


export default class SelectFood extends React.Component {

  constructor(props) {
    super();
    this.state = {
      setParentState: props.state.setParentState,
      foodList: [{name:"loading"}],
      quantity: 1,
      searchFilter: ""
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
    mealId = props.state.mealId;
    dishId = props.state.dishId;
    // mealNumber = props.state.mealNumber;
    database = props.state.database;
    this.state.foodList = database.getCollection('foodBank').where((obj) => { return true; });
  }

  // Add food
  addFood(id) {
    // TODO: If duplicate then return and alert user
    const previousScreen = (dishId == null ? 'EditDay' : 'AddDish');
    console.log("Adding food, ID: " + id);
    if (dishId == null) {
      const mealsFood = database.getCollection('mealsFood').where((obj) => {
        const mealMatch = obj.mealId == mealId;
        const foodMatch = obj.foodId == id;
        return mealMatch && foodMatch;
      });
      if (mealsFood[0] != undefined) {
        alert('This food already exists in the meal.')
      } else {
        // save food to meal
        database.getCollection('mealsFood').insert({
          mealId: mealId,
          foodId: id,
          quantity: this.state.quantity
        });
      }
    } else {
      const dishesFood = database.getCollection('dishesFoods').where((obj) => {
        const dishMatch = obj.dishId == dishId;
        const foodMatch = obj.foodId == id;
        return dishMatch && foodMatch;
      });
      if (dishesFood[0] != undefined) {
        alert('This food already exists in the dish.')
      } else {
        // save food to dish
        database.getCollection('dishesFoods').insert({
          dishId: dishId,
          foodId: id,
          quantity: this.state.quantity
        });
      }
    }
    database.saveDatabase();
    this.state.setParentState({currentView: previousScreen});
  }

  handleSearchChange(event) {
    const filter = event.target.value;
    this.setState({searchFilter: filter});
    if (filter == "") {
      const allFoods = database.getCollection('foodBank').where((obj) => {return true;});
      this.setState({foodList: allFoods});
    } else {
      const filteredFoods = database.getCollection('foodBank').where((obj) => {
        return obj.name.toLowerCase().includes(filter.toLowerCase());
      });
      this.setState({foodList: filteredFoods});
    }
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
              <button onClick={this.addFood.bind(this, id)}>+</button>
            </li>;
          })}
      </ul>
    </div>;
  }
}