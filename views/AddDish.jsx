
'use babel';

import React from 'react';
import Loki from 'lokijs';

let database;


export default class AddDish extends React.Component {

  constructor(props) {
    super();
    this.state = {
      setParentState: props.state.setParentState,
      dishId: props.state.dishId,
      dishName: "",
      thisDishesFood: [],
      recipe: "",
      saved: false
    };
    database = props.state.database;
    if (this.state.dishId >= 0) { // DANGEROUS?
      // Reload last dish
      console.log("Reloading last dish.")
      const currentDish = database.getCollection('dishBank').get(this.state.dishId);
      this.state.dishName = currentDish.dishName;
      this.state.recipe = currentDish.recipe;
      this.state.thisDishesFood = database.getCollection('dishesFoods').where(
        (obj) => {return obj.dishId == this.state.dishId} 
      );
      this.state.saved = true;
    }
    this.countNutrients(true);
  }

  handleEditChange(event) {
    const editType = event.target.name;
    this.setState({[editType]: event.target.value});
  }


  addFood() {
    this.state.setParentState({currentView: 'SelectFood', mealId: null, dishId: this.state.dishId});
  }

  createDish() {
    // Create an entry
    const lastEntry = database.getCollection('dishBank').insert({
      dishName: this.state.dishName,
      recipe: ""
    });
    database.saveDatabase();
    this.state.dishId = lastEntry.$loki;
    // Unlock the input boxes
    this.setState({ saved: true });
    console.log("Saved dish: " + this.state.dishName + ", with Id: " + lastEntry.$loki);
  }

  // Does same as in constructor, but triggers react
  countNutrients(forConstructor) {
    console.log("Count");
    let totalNutrients = {calorie: 0, carb: 0, protein: 0, fat: 0};
    database.getCollection('dishesFoods').where((food) => {
      if (food.dishId == this.state.dishId) {
        let nutrients = database.getCollection('foodBank').get(food.foodId);
        totalNutrients.calorie += nutrients.calorie * food.quantity;
        totalNutrients.carb += nutrients.carb * food.quantity;
        totalNutrients.protein += nutrients.protein * food.quantity;
        totalNutrients.fat += nutrients.fat * food.quantity;
      }
      return true;
    });
    if (forConstructor) {
      this.state.totalNutrients = totalNutrients;
    } else {
      this.setState({totalNutrients: totalNutrients});
    }
  }

  updateReactMeals() {
    // Update React
    this.setState({thisDishesFood: database.getCollection('dishesFoods').where(
      (obj) => {return obj.dishId == this.state.dishId}
    )});
    this.state.countNutrients(false);
  }

  removeFood(id) {
    console.log("Remove food: "+id)
    const food = database.getCollection('dishesFoods').get(id);
    database.getCollection('mealsFood').remove(food);
    database.saveDatabase();
    this.updateReactMeals();
  }

  handleQuantityChange(id, event) {
    const food = database.getCollection('dishesFoods').get(id);
    food.quantity = event.target.value;
    database.getCollection('dishesFoods').update(food);
    database.saveDatabase();
    this.updateReactMeals();
  }

  saveRecipe() {
    const dish = database.getCollection('dishBank').get(this.state.dishId);
    dish.recipe = this.state.recipe;
    database.getCollection('dishBank').update(dish);
    database.saveDatabase();
    alert("Recipe Saved.");
  }

  render() {
    let thisDishesFood = this.state.thisDishesFood;
    return <div>

      <div>
        {(!this.state.saved ? <div>
            <input type="text" name="dishName" placeholder="Dish Name" onChange={this.handleEditChange.bind(this)}/>
            <br/>
            <button onClick={this.createDish.bind(this)}>Create Dish</button>
          </div> 
            :  
          <div>
            <input type="text" name="dishName" placeholder="Dish Name" onChange={this.handleEditChange.bind(this)} value={this.state.dishName} />
            <br/>
            <b>Nutrition Totals: </b>
            <br/>
            Calorie: {this.state.totalNutrients.calorie}, Carb: {this.state.totalNutrients.carb}, 
            Protein: {this.state.totalNutrients.protein}, Fat: {this.state.totalNutrients.fat}<br/>
            <ul>
              {thisDishesFood.map((food) => {
                const id = food.$loki;
                const foodName = database.getCollection('foodBank').get(food.foodId).name;
                return <li key={id}>
                  <input type="number" value={food.quantity} onChange={this.handleQuantityChange.bind(this, id)}/>
                  x {foodName} <button onClick={this.removeFood.bind(this, id)}>-</button>
                </li>;
              })}
            </ul>
            <br/>
            <button onClick={this.addFood.bind(this)}>Add Food</button>
            <br/>
            <br/>
            <textarea rows="5" type="text" name="recipe" placeholder="Recipe" onChange={this.handleEditChange.bind(this)} value={this.state.recipe} />
            <br/>
            <button onClick={this.saveRecipe.bind(this)}>Save Recipe</button>
          </div> )}

        <br/>
      </div>

    </div>;
  }
}