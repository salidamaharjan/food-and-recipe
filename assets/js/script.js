var form = document.querySelector("#ingredientForm");
var regexNotLettersSpaces = /[^a-zA-Z\s]/g;
//closing the modal when cross or the outside of the box is clicked
var recipeViewModal = document.querySelector(".recipe-view-modal");
recipeViewModal.addEventListener("click", function (event) {
  console.log(event.target);
  //we want to close the modal when clicked outside of the content box and
  //cross button
  if (
    event.target.matches(".btn-close-recipeModal") ||
    event.target.matches(".recipe-modal-container")
  ) {
    var modal = document.querySelector(".modal");
    modal.classList.remove("is-active");
  }
});

form.addEventListener("submit", function (event) {
  // Prevent the default form submission
  event.preventDefault();

  // Call your API function
  fetchNutrientApi();
});

// Call updateSavedIngredients when the page loads
window.addEventListener("load", function () {
  updateSavedIngredients();
});

function fetchNutrientApi() {
  var inputSection = document.querySelector("#ingredientInput");
  var value = inputSection.value.trim();
  //strip out anything other than letters and spaces
  value = value.replace(regexNotLettersSpaces, "");

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
      console.log(`API Response:`, data);

      // Access the first item in the "hints" array
      if (data.hints && data.hints.length > 0) {
        var firstHint = data.hints[0];

        // Log general information about the food
        console.log("Food label:", firstHint.food.label);
        console.log("Category:", firstHint.food.category);
        console.log("Image:", firstHint.food.image);
        $("#foodName").text(firstHint.food.label);
        $("#foodCategory").text(firstHint.food.category);
        // Clear any previous image from the container
        $("#foodImage").html("");
        // Create an image tag
        var foodImage = $("<img />", {
          // Set the image src to the image URL from the API
          src: firstHint.food.image,
        });
        // Append the image to <p id="foodImage"></p>
        foodImage.appendTo($("#foodImage"));
        // Log nutritional information
        if (firstHint.food.nutrients) {
          var nutrients = firstHint.food.nutrients;
          console.log("Calories:", nutrients.ENERC_KCAL);
          console.log("Protein:", nutrients.PROCNT);
          console.log("Fat:", nutrients.FAT);
          console.log("Carbohydrates:", nutrients.CHOCDF);
          console.log("Fiber:", nutrients.FIBTG);
          $("#calories").text(nutrients.ENERC_KCAL + " kcal");
          $("#protein").text(nutrients.PROCNT + " g");
          $("#fat").text(nutrients.FAT + " g");
          $("#carbohydrates").text(nutrients.CHOCDF + " g");
          $("#fiber").text(nutrients.FIBTG + " g");
        }
      }
    });
}
// Save ingredient to local storage function
function saveIngredientToLocalStorage(ingredient) {
  // Get existing saved ingredients from local storage
  var savedIngredients =
    JSON.parse(localStorage.getItem("savedIngredients")) || [];
  console.log("Saved ingredients before:", savedIngredients);
  // making sure the saved ingredient do not duplicate in list
  if (!savedIngredients.includes(ingredient) && ingredient.length > 0) {
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
}

// Update saved ingredients in the "Saved Ingredients" section
function updateSavedIngredients() {
  var savedIngredientsContainer = document.getElementById("ingredientButtons");
  var savedIngredientsList = document.getElementById("ingredientList");

  // Clear existing content
  savedIngredientsContainer.innerHTML = "";
  savedIngredientsList.innerHTML = "";

  // Get saved ingredients from local storage
  var savedIngredients =
    JSON.parse(localStorage.getItem("savedIngredients")) || [];

  // Display each saved ingredient in the list
  savedIngredients.forEach(function (ingredient) {
    var button = document.createElement("button");
    button.classList.add(
      "button",
      "is-medium",
      "is-primary",
      "mr-2",
      "is-fullwidth",
      "has-text-weight-bold",
      "is-size-4"
    );
    button.textContent = ingredient;

    // Attach a click event listener to each button
    button.addEventListener("click", function () {
      // Handle the click event
      console.log("Button clicked for ingredient:", ingredient);

      console.log(searchBtn);
    });
    savedIngredientsContainer.appendChild(button);
    savedIngredientsContainer.classList.add("is-flex-direction-column");
  });

  var inputSection = document.querySelector("#input");
  var recipesBtn = document.querySelector(".recipes-btn");

  recipesBtn.addEventListener("click", async function () {
    var recipeResult = await fetchRecipeApi();
    console.log(recipeResult);

    //clear out ingredient once submitted
    $("#ingredientInput").val("");
    //console.log(ingredientInput.val);

    displayRecipeBox(recipeResult);
  });
}

//displays the available recipe in the UI
function displayRecipeBox(recipes) {
  //the length hits may not be uniform so using hits.length
  for (var i = 0; i < recipes.hits.length; i++) {
    var displayedRecipes = document.querySelector(".displayed-recipes");
    var recipeEl = constructRecipeBoxInfo(recipes.hits[i].recipe);
    displayedRecipes.append(recipeEl);
  }
}
//creating new element according to the recipe and return created element
function constructRecipeBoxInfo(recipe) {
  console.log(recipe);
  var divEl = document.createElement("div");
  divEl.setAttribute("class", "column is-4");
  divEl.innerHTML = `
                  <div
                    class="recipe box has-background-primary-dark is-flex is-flex-direction-column"
                  >
                    <div
                      class="recipe-name has-text-white has-text-weight-bold is-size-6"
                    >
                      ${recipe.label}
                    </div>
                    <img class="recipe-image" src="${
                      recipe.images.THUMBNAIL.url
                    }" alt="recipe image" />
                    <ul class="recipe-nutrients">
                      <li class="recipe-calorie has-text-white is-size-7">
                        Calorie: <span>${Math.round(
                          recipe.totalNutrients.ENERC_KCAL.quantity
                        )} ${recipe.totalNutrients.ENERC_KCAL.unit}</span> 
                      </li>
                      <li class="recipe-protein has-text-white is-size-7">
                        Protein: <span>${Math.round(
                          recipe.totalNutrients.PROCNT.quantity
                        )} ${recipe.totalNutrients.PROCNT.unit}</span>
                      </li>
                      <li class="recipe-fat has-text-white is-size-7">
                        Fat: <span>${Math.round(
                          recipe.totalNutrients.FAT.quantity
                        )} ${recipe.totalNutrients.FAT.unit}</span>
                      </li>
                      <li class="recipe-carbs has-text-white is-size-7">
                        Carbohydrates: <span>${Math.round(
                          recipe.totalNutrients.CHOCDF.quantity
                        )} ${recipe.totalNutrients.CHOCDF.unit}</span>
                      </li>
                      <li class="recipe-fiber has-text-white is-size-7">
                        Fiber: <span>${Math.round(
                          recipe.totalNutrients.FIBTG.quantity
                        )} ${recipe.totalNutrients.FIBTG.unit}</span>
                      </li>
                    </ul>
                    <button class="button btn-recipe-view is-small mt-3">
                      View Recipe
                    </button>
                  </div>`;
  //recipe button is only found in the div element because it is not attached to HTML yet
  var recipeBtn = divEl.querySelector(".btn-recipe-view");
  recipeBtn.addEventListener("click", function () {
    createRecipeModal(recipe);
  });
  return divEl;
}
function createRecipeModal(recipe) {
  var recipeModal = document.querySelector(".recipe-view-modal");
  //adding class is-active to show the modal in UI
  recipeModal.classList.add("is-active");
  var recipeLabel = document.querySelector(".recipe-label");
  recipeLabel.textContent = recipe.label;
  var recipeImg = document.querySelector(".recipe-img");
  recipeImg.setAttribute("src", recipe.images.THUMBNAIL.url);

  //looping through the items of ingredientLines and putting the value to list
  for (var i = 0; i < recipe.ingredientLines.length; i++) {
    var ingredientLinesListOl = document.querySelector(".ingredientLines-list");
    var ingredientLinesLi = document.createElement("li");
    ingredientLinesListOl.append(ingredientLinesLi);
    ingredientLinesLi.textContent = recipe.ingredientLines[i];
  }

  if (recipe.instructionLines.length === 0) {
    // <a class="button">Anchor</a>
    var recipeInstructionLines = document.querySelector(
      ".recipe-instructionLines"
    );
    var recipeInstructionLink = document.createElement("a");
    recipeInstructionLines.append(recipeInstructionLink);
    recipeInstructionLink.textContent = "Click to view instruction";
    recipeInstructionLink.setAttribute("href", recipe.url);
    recipeInstructionLink.setAttribute("target", "_blank");
    recipeInstructionLink.classList.add("button", "mt-3", "is-link");
  }

  //looping through the items of instructionLines and putting the value to list
  for (var i = 0; i < recipe.instructionLines.length; i++) {
    var instructionLinesListOl = document.querySelector(
      ".instructionLines-list"
    );
    var instructionLinesLi = document.createElement("li");
    instructionLinesListOl.append(instructionLinesLi);
    instructionLinesLi.textContent = recipe.instructionLines[i];
  }
}
async function fetchRecipeApi() {
  var inputElement = document.querySelector("#ingredientInput");
  var value = inputElement.value;
  //strip out anything other than letters and spaces
  value = value.replace(regexNotLettersSpaces, "");
  var response = await fetch(
    `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(
      value
    )}&app_id=df46ca95&app_key=277fe705327a2981fb85ba1e1202742a`
  );
  // var response = await fetch(`./assets/js/recipe.json`);
  var result = await response.json();
  return result;
}
