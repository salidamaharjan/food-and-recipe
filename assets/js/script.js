var form = document.querySelector("#ingredientForm");

form.addEventListener("submit", function (event) {
  // Prevent the default form submission
  event.preventDefault();

  // Call your API function
  fetchNutrientApi();
});

// Call updateSavedIngredients when the page loads
window.addEventListener('load', function () {
  updateSavedIngredients();
});

function fetchNutrientApi() {
  var inputSection = document.querySelector("#ingredientInput");
  var value = inputSection.value;

  console.log("ingredient value", value);

  saveIngredientToLocalStorage(value);

  var nutrientURL = `https://api.edamam.com/api/food-database/v2/parser?app_id=f02972e7&app_key=3d2353afd7e7eccce279b9f2bb359688&ingr=${encodeURIComponent(
    value
  )}&nutrition-type=cooking`;
  fetch(nutrientURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(`API Response:`,data);

  // Access the first item in the "hints" array
  if (data.hints && data.hints.length > 0) {
    var firstHint = data.hints[0];

        // Log general information about the food
        console.log('Food label:', firstHint.food.label);
        console.log('Category:', firstHint.food.category);
        console.log('Image:', firstHint.food.image);

  // Log nutritional information
  if (firstHint.food.nutrients) {
        var nutrients = firstHint.food.nutrients;
        console.log('Calories:', nutrients.ENERC_KCAL);
        console.log('Protein:', nutrients.PROCNT);
        console.log('Fat:', nutrients.FAT);
        console.log('Carbohydrates:', nutrients.CHOCDF);
        console.log('Fiber:', nutrients.FIBTG);
        }
     }}
    )
  };
// Save ingredient to local storage function
function saveIngredientToLocalStorage(ingredient) {
  // Get existing saved ingredients from local storage
  var savedIngredients = JSON.parse(localStorage.getItem("savedIngredients")) || [];
  console.log("Saved ingredients before:", savedIngredients);
  // Add the new ingredient to the top of the Array
  savedIngredients.unshift(ingredient);
  //Maximum number of history items is 15
  if (savedIngredients.length > 15) {
      savedIngredients = savedIngredients.slice(0, 15);
  }
  // Save the updated array back to local storage
  localStorage.setItem("savedIngredients", JSON.stringify(savedIngredients));
  
  console.log("Ingredient saved to local storage:", ingredient);

  // Update the displayed saved ingredients
  updateSavedIngredients();

}

// Update saved ingredients in the "Saved Ingredients" section
function updateSavedIngredients() {
  var savedIngredientsContainer = document.getElementById("ingredientButtons");
  var savedIngredientsList = document.getElementById("ingredientList");

  // Clear existing content
  savedIngredientsContainer.innerHTML = "";
  savedIngredientsList.innerHTML = "";

  // Get saved ingredients from local storage
  var savedIngredients = JSON.parse(localStorage.getItem("savedIngredients")) || [];

  // Display each saved ingredient in the list
  savedIngredients.forEach(function (ingredient) {
      var button = document.createElement("button");
      button.classList.add("button", "is-medium", "is-info", "mr-2");
      button.textContent = ingredient;

    // Attach a click event listener to each button
    button.addEventListener("click", function () {
      // Handle the click event 
      console.log("Button clicked for ingredient:", ingredient);
    });
    savedIngredientsContainer.appendChild(button);
  });

 var inputSection = document.querySelector('#input')
 var recipesBtn = document.querySelector('.recipes-btn');
 recipesBtn.addEventListener('click', function(){
  fetchRecipeApi().then(function(result) {
    console.log(result);
  
  //clear out ingredient once submitted
 $("#ingredientInput").val("");
  console.log(test);
  });
 });
 
 async function fetchRecipeApi() {
  var inputElement = document.querySelector("#ingredientInput");
  var value = inputElement.value;
  var response = await fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(value)}&app_id=df46ca95&app_key=277fe705327a2981fb85ba1e1202742a`);
  var result = await response.json();
  return result;
}}

