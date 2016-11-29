

export function setDemoData(database) {
    console.log("Adding demo data");
    // Add some clients
    const clientCollection = database.getCollection('clients');
    clientCollection.insert({
      name: "Nic Smith",
      cell: "02712355678",
      email: "nicsmith@gmail.com",
      intolerances: "Gluten",
      likesDislikes: "Hates bananas",
      medications: "Iron",
    });
    clientCollection.insert({ 
      name: "Erin Hoskins",
      cell: "0254363645",
      email: "erinhoskins@gmail.com",
      intolerances: "",
      likesDislikes: "Loves steak",
      medications: "Vitamin C",
    });
    clientCollection.insert({ 
      name: "Maria Brett",
      cell: "02112345678",
      email: "nicsmith@gmail.com",
      intolerances: "Diary",
      likesDislikes: "Hates nuts",
      medications: "",
    });
    // Add some foods
    const foodCollection = database.getCollection('foodBank');
    foodCollection.insert({ 
      name: "egg",
      calorie: 70,
      carb: 8,
      protein: 1,
      fat: 0.2
    });
    foodCollection.insert({ 
      name: "rice cake",
      calorie: 20,
      carb: 18,
      protein: 1,
      fat: 1
    });
    foodCollection.insert({ 
      name: "medium banana",
      calorie: 20,
      carb: 18,
      protein: 1,
      fat: 1
    });
    foodCollection.insert({ 
      name: "grams of tofu",
      calorie: 10,
      carb: 5,
      protein: 5,
      fat: 1
    });
    foodCollection.insert({ 
      name: "Tbsp oil",
      calorie: 5,
      carb: 1,
      protein: 1,
      fat: 10
    });
    foodCollection.insert({ 
      name: "cup brown rice",
      calorie: 50,
      carb: 50,
      protein: 5,
      fat: 1
    });
    foodCollection.insert({ 
      name: "grams of cheese",
      calorie: 20,
      carb: 5,
      protein: 10,
      fat: 5
    });
    foodCollection.insert({ 
      name: "grams of chicken",
      calorie: 20,
      carb: 5,
      protein: 10,
      fat: 5
    });
    foodCollection.insert({ 
      name: "salt and pepper",
      calorie: 0,
      carb: 0,
      protein: 0,
      fat: 0
    });
    foodCollection.insert({ 
      name: "can of chickpeas (drained)",
      calorie: 20,
      carb: 5,
      protein: 10,
      fat: 5
    });
    // Add some Dishes
    const dishCollection = database.getCollection('dishBank');
    dishCollection.insert({
      dishName: "Roast Chicken",
      recipe: "Get the chicken. Kill, then cook."
    });
    dishCollection.insert({
      dishName: "Beef Burger",
      recipe: "Take the buns, throw some meat between."
    });
    const dishesFoodsCollection = database.getCollection('dishesFoods');
    dishesFoodsCollection.insert({
      dishId: 1,
      foodId: 4,
      quantity: 3
    });
    dishesFoodsCollection.insert({
      dishId: 2,
      foodId: 5,
      quantity: 2
    });
    // Add some baking
    const bakingCollection = database.getCollection('bakingBank');
    bakingCollection.insert({
      name: "Chocolate Brownies",
      recipe: "Take some flour and Chocolate. Mix it all up. Oh and butter.",
      calorie: 200,
      carb: 50,
      protein: 100,
      fat: 50
    });
    // Save all
    database.saveDatabase();
}