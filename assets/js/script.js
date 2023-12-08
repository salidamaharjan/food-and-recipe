var form = document.querySelector("#ingredientForm");

form.addEventListener("submit", function (event) {
  // Prevent the default form submission
  event.preventDefault();

  // Call your API function
  fetchNutrientApi();
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
      console.log(data);
    });
}

// Save ingredient to local storage function
function saveIngredientToLocalStorage(ingredient) {
  // Get existing saved ingredients from local storage
  var savedIngredients = JSON.parse(localStorage.getItem("savedIngredients")) || [];
  console.log("Saved ingredients before:", savedIngredients);
  // Add the new ingredient to the array
  savedIngredients.push(ingredient);
  // Save the updated array back to local storage
  localStorage.setItem("savedIngredients", JSON.stringify(savedIngredients));
  
  console.log("Ingredient saved to local storage:", ingredient);

  // Update the displayed saved ingredients
  updateSavedIngredients();

}

// Update saved ingredients in the "Saved Ingredients" section
function updateSavedIngredients() {
  var savedIngredientsContainer = document.getElementById("savedIngredients");
  var savedIngredientsList = document.getElementById("ingredientList");

  // Clear existing content
  savedIngredientsList.innerHTML = "";

  // Get saved ingredients from local storage
  var savedIngredients = JSON.parse(localStorage.getItem("savedIngredients")) || [];

  // Display each saved ingredient in the list
  savedIngredients.forEach(function (ingredient) {
      var listItem = document.createElement("li");
      listItem.textContent = ingredient;
      savedIngredientsList.appendChild(listItem);
  });

 var recipesBtn = document.querySelector('.recipes-btn');

 recipesBtn.addEventListener('click', function(){
  fetchRecipeApi().then(function(result) {
    console.log(result);
  });
 });
 
 async function fetchRecipeApi() {
  var inputElement = document.querySelector("#ingredientInput");
  var value = inputElement.value;
  var response = await fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(value)}&app_id=df46ca95&app_key=277fe705327a2981fb85ba1e1202742a`);
  var result = await response.json();
  return result;
}}

