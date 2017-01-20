
'use babel';

import React from 'react';

let mealId;
let database;



export default class SelectBaking extends React.Component {

  constructor(props) {
    super();
    this.state = {
      setParentState: props.state.setParentState,
      nextAction: props.state.nextAction,
      quantity: 1
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
    mealId = props.state.mealId;
    database = props.state.database;
    // Get all baking
    this.state.bakingList = database.getCollection('bakingBank').where((obj) => {
      return true;
    });
  }

  // Add Baking
  addBaking(id) {
    console.log("Click Baking, ID: " + id);
    if (this.state.nextAction == 'EditBaking') {
      this.state.setParentState({currentView: 'EditBaking', bakingId: id, nextAction: ''});
      return;
    }
    // Check for duplicate
    const mealsBaking = database.getCollection('mealsBaking').where((obj) => {
      const mealMatch = obj.mealId == mealId;
      const bakingMatch = obj.bakingId == id;
      return mealMatch && bakingMatch;
    });
    if (mealsBaking[0] != undefined) {
      alert('This baking already exists in the meal.')
    } else {
      // save Baking to meal
      database.getCollection('mealsBaking').insert({
        mealId: mealId,
        bakingId: id,
        quantity: this.state.quantity
      });
    }
    database.saveDatabase();
    this.state.setParentState({currentView: 'DayView'});
  }

  handleQuantityChange(event) {
    const editType = event.target.name;
    this.setState({quantity: event.target.value});
  }

  handleSearchChange(event) {
    const filter = event.target.value;
    if (filter == "") {
      const allBaking = database.getCollection('bakingBank').where((obj) => {return true;});
      this.setState({bakingList: allBaking});
    } else {
      const filteredBaking = database.getCollection('bakingBank').where((obj) => {
        return obj.name.toLowerCase().includes(filter.toLowerCase());
      });
      this.setState({bakingList: filteredBaking});
    }
  }

  render() {
    const list = this.state.bakingList;
    return <div>
      <input type="text" placeholder="Search" onChange={this.handleSearchChange.bind(this)}/>
      <ul>
        {list.map((baking) => {
          const id = baking.$loki;
          const quantityFoodName = baking.name + 'quantity';
          return <li key={id}>

            {this.state.nextAction == '' ? <input type="number" name={quantityFoodName} onChange={this.handleQuantityChange.bind(this)}/>
            : <div></div>}
            
            {baking.unitName} <button onClick={this.addBaking.bind(this, id)}>+</button>
          </li>;
        })}
      </ul>
    </div>;
  }
}


// const id = food.$loki;
//             const quantityFoodName = food.name + 'quantity';
//             return <li key={id}>      
//               <input type="number" name={quantityFoodName} onChange={this.handleQuantityChange.bind(this)}/>
//               {food.name}
//               <button onClick={this.addFood.bind(this, id)}>+</button>
//             </li>;