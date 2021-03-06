

export function setDemoData(database) {
    console.log("Adding demo data");
    // Add some clients
    const clientCollection = database.getCollection('clients');
    clientCollection.insert({
      name: "Nic Smith",
      cell: "02712355678",
      email: "nicsmith@gmail.com",
      intolerances: "Gluten",
      likes: "bananas",
      dislikes: "steak",
      medications: "Iron",
    });
    clientCollection.insert({ 
      name: "Erin Hoskins",
      cell: "0254363645",
      email: "erinhoskins@gmail.com",
      intolerances: "",
      likes: "bananas",
      dislikes: "tea",
      medications: "Vitamin C",
    });
    clientCollection.insert({ 
      name: "Maria Brett",
      cell: "02112345678",
      email: "nicsmith@gmail.com",
      intolerances: "Dairy",
      likes: "bread",
      dislikes: "berries",
      medications: "",
    });
    // Add some foods
    const foodCollection = database.getCollection('foodBank');
    foodCollection.insert({ 
      name: "egg{s}",
      calorie: 70,
      carb: 8,
      protein: 1,
      fat: 0.2
    });
    foodCollection.insert({ 
      name: "rice cake{s}",
      calorie: 20,
      carb: 18,
      protein: 1,
      fat: 1
    });
    foodCollection.insert({ 
      name: "medium banana{s}",
      calorie: 20,
      carb: 18,
      protein: 1,
      fat: 1
    });
    foodCollection.insert({ 
      name: "gram{s} of tofu",
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
      name: "cup{s} brown rice",
      calorie: 50,
      carb: 50,
      protein: 5,
      fat: 1
    });
    foodCollection.insert({ 
      name: "gram{s} of cheese",
      calorie: 20,
      carb: 5,
      protein: 10,
      fat: 5
    });
    foodCollection.insert({ 
      name: "gram{s} of chicken",
      calorie: 20,
      carb: 5,
      protein: 10,
      fat: 5
    });
    foodCollection.insert({ 
      name: "tsp salt and pepper",
      calorie: 0,
      carb: 0,
      protein: 0,
      fat: 0
    });
    foodCollection.insert({ 
      name: "can{s} of chickpeas (drained)",
      calorie: 20,
      carb: 5,
      protein: 10,
      fat: 5
    });
    foodCollection.insert({ 
      name: "gram{s} of beef (uncooked)",
      calorie: 20,
      carb: 5,
      protein: 10,
      fat: 5
    });
    foodCollection.insert({ 
      name: "burger bun{s}",
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
      foodId: 8,
      quantity: 300
    });
    dishesFoodsCollection.insert({
      dishId: 1,
      foodId: 9,
      quantity: 1
    });
    dishesFoodsCollection.insert({
      dishId: 2,
      foodId: 11,
      quantity: 200
    });
    dishesFoodsCollection.insert({
      dishId: 2,
      foodId: 12,
      quantity: 2
    });
    // Add some baking
    const bakingCollection = database.getCollection('bakingBank');
    bakingCollection.insert({
      name: "Chocolate Brownie",
      unitName: "piece{s} of chocolate brownie.",
      recipe: "Take some flour and Chocolate. Mix it all up. Oh and butter.",
      calorie: 200,
      carb: 50,
      protein: 100,
      fat: 50
    });
    // Save all
    database.saveDatabase();
}