var form = document.querySelector("#ingredientForm");
//match any characters that are not letters both upper and lower case
var regexNotLettersSpaces = /[^a-zA-Z\s]/g;
//recipe view of the modal element
var recipeViewModal = document.querySelector(".recipe-view-modal");
//event listener to close the modal when clicked outside of the content or the close button
recipeViewModal.addEventListener("click", function (event) {
  console.log(event.target);
  //check if the click event is outside of the content or the close button
  if (
    event.target.matches(".btn-close-recipeModal") ||
    event.target.matches(".recipe-modal-container")
  ) {
    //select the modal
    var modal = document.querySelector(".modal");
    //hide the modal
    modal.classList.remove("is-active");
  }
});
//Variables to display nutrient information, error messages, and text
var nutrientComponent = document.querySelector(".nutrient-component");
var errorModal = document.querySelector(".error-modal");
var displayText = document.querySelector(".display-text");
//event listener to close the error modal when clicked outside the content or the close button
errorModal.addEventListener("click", function (event) {
  console.log(event.target);
  //check if the click event is outside of the content or the close button
  if (
    event.target.matches(".btn-close-errorModal") ||
    event.target.matches(".error-modal-container")
  ) {
    //select modal
    var modal = document.querySelector(".error-modal");
    //hide the modal
    modal.classList.remove("is-active");
  }
});
//Form Submission
form.addEventListener("submit", async function (event) {
  // Prevent the default form submission
  event.preventDefault();

  // Call API function for nutrient information
  fetchNutrientApi();
  //fetching recipe API and display result after ingredient is submitted
  var recipeResult = await fetchRecipeApi($("#ingredientInput").val());
  //clear out ingredient once submitted
  $("#ingredientInput").val("");
  //showing the nutrient detail
  nutrientComponent.classList.remove("is-hidden");
  //display recipe box with fetched information
  displayRecipeBox(recipeResult);
});

// Call updateSavedIngredients when the page loads
window.addEventListener("load", function () {
  //update the list of saved ingredients 
  updateSavedIngredients();
});

function fetchNutrientApi() {
  var inputSection = document.querySelector("#ingredientInput");
  var value = inputSection.value.trim();
  //strip out anything other than letters and spaces
  value = value.replace(regexNotLettersSpaces, "");

  console.log("ingredient value", value);
  // check length
  if (value.length > 0) {
    saveIngredientToLocalStorage(value);
    //Fetch the nutrient information
    var nutrientURL = `https://api.edamam.com/api/food-database/v2/parser?app_id=f02972e7&app_key=3d2353afd7e7eccce279b9f2bb359688&ingr=${encodeURIComponent(
      value
    )}&nutrition-type=cooking`;
    fetch(nutrientURL)
      //Request to retrieve nutrient data
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(`API Response:`, data);

        // Access the first item in the "hints" array
        if (data.hints && data.hints.length > 0) {
          var firstHint = data.hints[0];
          //Update UI
          $("#foodName").text(`${firstHint.food.label}`);
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
            $("#calories").text(nutrients.ENERC_KCAL + " kcal");
            $("#protein").text(nutrients.PROCNT + " g");
            $("#fat").text(nutrients.FAT + " g");
            $("#carbohydrates").text(nutrients.CHOCDF + " g");
            $("#fiber").text(nutrients.FIBTG + " g");
          }
          //Clear the input field after fetched details
          inputSection.value = "";
        }
      });
  } else {
    var errorModal = document.querySelector(".error-modal");
    //adding class is-active to show the modal in UI
    errorModal.classList.add("is-active");
  }
}
// Save ingredient to local storage function
function saveIngredientToLocalStorage(ingredient) {
  // Get existing saved ingredients from local storage
  var savedIngredients =
    JSON.parse(localStorage.getItem("savedIngredients")) || [];
  console.log("Saved ingredients before:", savedIngredients);

  // making sure the saved ingredient do not duplicate in list
  //searching in lowercase because ingredient is saved in lowercase in local storage
  if (
    !savedIngredients.includes(ingredient.toLowerCase()) &&
    ingredient.length > 0
  ) {
    // Add the new ingredient to the top of the Array
    //saving new ingredient in lower case to search and compare ingredient easily
    savedIngredients.unshift(ingredient.toLowerCase());
    //Maximum number of history items is 5
    if (savedIngredients.length > 20) {
      savedIngredients = savedIngredients.slice(0, 10);
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
  //references to html elements
  var savedIngredientsContainer = document.getElementById("ingredientButtons");
  var savedIngredientsList = document.getElementById("ingredientList");
  //retrieve saved ingredients from local storage OR initialize empty array
  var savedIngredients =
    JSON.parse(localStorage.getItem("savedIngredients")) || [];
  //max number of ingredients to be displayed is 5 most recent searches
  savedIngredients = savedIngredients.slice(0,5);
  // Clear existing content
  savedIngredientsContainer.innerHTML = "";
  savedIngredientsList.innerHTML = "";
  //display each saved ingredient to the UI
  savedIngredients.forEach(function (ingredient) {
    //convert all ingredients to uppercase for consistency 
    ingredient = ingredient.toUpperCase();

    // creating a common container for button and class added
    var divButtonsEL = document.createElement("div");
    divButtonsEL.classList.add("mb-2", "saved-ingredient-btn-wrapper");
    //button for each saved ingredient
    var button = document.createElement("button");
    button.classList.add(
      "button",
      "is-medium",
      "is-primary",
      "is-outlined",
      "has-text-weight-bold",
      "is-size-6",
      "is-block",
      "white-button",
      "has-text-primary"
    );
    button.textContent = ingredient;

    // Attach a click event listener to each button
    button.addEventListener("click", function () {
      // Handle the click event
      handleSavedIngredientClick(ingredient);
    });

    //created another button to delete the saved ingredient
    var close = document.createElement("button");
    close.classList.add(
      "button",
      "is-medium",
      "is-danger",
      "has-text-weight-bold",
      "is-size-6"
    );
    //added x icon
    close.innerHTML = `<i class="fa-solid fa-rectangle-xmark"></i>`;
    close.addEventListener("click", function () {
      //finding the index of an array
      var index = savedIngredients.indexOf(ingredient.toLowerCase());
      savedIngredients.splice(index, 1);
      //updating local storage with modified array
      localStorage.setItem(
        "savedIngredients",
        JSON.stringify(savedIngredients)
      );
      //updated ingredients in on the UI
      updateSavedIngredients();
    });
    //append buttons to the container
    divButtonsEL.append(button, close);
    savedIngredientsContainer.append(divButtonsEL);
  });
}
//handle click event on a saved ingredient
async function handleSavedIngredientClick(ingredient) {
  // Fetch details for the clicked ingredient
  fetchNutrientDetails(ingredient);
  //fetch recipe API when clicked on the ingredient
  var recipeResult = await fetchRecipeApi(ingredient);
  console.log(recipeResult);
  //display nutrient details on UI
  nutrientComponent.classList.remove("is-hidden");
  //display recipe 
  displayRecipeBox(recipeResult);
}
//Fetch nutrient details for searched ingredient
function fetchNutrientDetails(ingredient) {
  var nutrientURL = `https://api.edamam.com/api/food-database/v2/parser?app_id=f02972e7&app_key=3d2353afd7e7eccce279b9f2bb359688&ingr=${encodeURIComponent(
    ingredient
  )}&nutrition-type=cooking`;
  fetch(nutrientURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(`API Response for ${ingredient}:`, data);
      // Access the first item in the "hints" array
      if (data.hints && data.hints.length > 0) {
        var firstHint = data.hints[0];

        // Update the displayed information in the ingredientContainer
        $("#foodName").text(`${firstHint.food.label}`);
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
          $("#calories").text(nutrients.ENERC_KCAL + " kcal");
          $("#protein").text(nutrients.PROCNT + " g");
          $("#fat").text(nutrients.FAT + " g");
          $("#carbohydrates").text(nutrients.CHOCDF + " g");
          $("#fiber").text(nutrients.FIBTG + " g");
        }
      }
    });
}
//displays the available recipe in the UI
function displayRecipeBox(recipes) {
  //clear recipes before displaying new
  $("#recipe-cards").html("");
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
  //create new div element for recipe box
  var divEl = document.createElement("div");
  divEl.setAttribute(
    "class",
    "column is-half-mobile is-one-third-desktop is-one-quarter-widescreen"
  );
  //set the HTML for the recipe box
  divEl.innerHTML = `
                  <div
                    class="recipe container box has-background-primary-dark is-flex is-flex-direction-column"
                  >
                    <div
                      class="recipe-name has-text-white has-text-weight-bold is-size-4 has-text-centered mb-1"
                    >
                      ${recipe.label}
                    </div>
                    <img class="recipe-image" src="${
                      recipe.images.THUMBNAIL.url
                    }" alt="recipe image" />
                    <ul class="recipe-nutrients">
                      <li class="recipe-calorie has-text-white is-size-5 mt-1 has-text-centered">
                        Calorie: <span>${Math.round(
                          recipe.totalNutrients.ENERC_KCAL.quantity
                        )} ${recipe.totalNutrients.ENERC_KCAL.unit}</span> 
                      </li>
                      <li class="recipe-protein has-text-white is-size-5 has-text-centered">
                        Protein: <span>${Math.round(
                          recipe.totalNutrients.PROCNT.quantity
                        )} ${recipe.totalNutrients.PROCNT.unit}</span>
                      </li>
                      <li class="recipe-fat has-text-white is-size-5 has-text-centered">
                        Fat: <span>${Math.round(
                          recipe.totalNutrients.FAT.quantity
                        )} ${recipe.totalNutrients.FAT.unit}</span>
                      </li>
                      <li class="recipe-carbs has-text-white is-size-6 has-text-centered">
                        Carbohydrates: <span>${Math.round(
                          recipe.totalNutrients.CHOCDF.quantity
                        )} ${recipe.totalNutrients.CHOCDF.unit}</span>
                      </li>
                      <li class="recipe-fiber has-text-white is-size-5 has-text-centered">
                        Fiber: <span>${Math.round(
                          recipe.totalNutrients.FIBTG.quantity
                        )} ${recipe.totalNutrients.FIBTG.unit}</span>
                      </li>
                    </ul>
                    <button class="button btn-recipe-view is-medium mt-3">
                      View Recipe
                    </button>
                  </div>`;
  //Event listener to the view recipe button
  var recipeBtn = divEl.querySelector(".btn-recipe-view");
  recipeBtn.addEventListener("click", function () {
    //create and display the recipe modal
    createRecipeModal(recipe);
  });
  //return the created div element
  return divEl;
}
//
function createRecipeModal(recipe) {
  var recipeModal = document.querySelector(".recipe-view-modal");
  //adding class is-active to show the modal in UI
  recipeModal.classList.add("is-active");
  var recipeLabel = document.querySelector(".recipe-label");
  recipeLabel.textContent = recipe.label;
  var recipeImg = document.querySelector(".recipe-img");
  recipeImg.setAttribute("src", recipe.images.THUMBNAIL.url);

  //searching add to favorite button from the html to DOM
  var favBtn = document.querySelector(".add-favorite");
  favBtn.addEventListener("click", function () {
    //add recipe to the saved recipes in local storage
    var savedRecipe = JSON.parse(localStorage.getItem("savedRecipe")) || [];
    if (
      savedRecipe.some(function (item) {
        return item.label === recipe.label;
      })
    ) {
      return;
    }
    savedRecipe.push(recipe);
    localStorage.setItem("savedRecipe", JSON.stringify(savedRecipe));
  });

  //looping through the items of ingredientLines and putting the value to list
  for (var i = 0; i < recipe.ingredientLines.length; i++) {
    var ingredientLinesListOl = document.querySelector(".ingredientLines-list");
    var ingredientLinesLi = document.createElement("li");
    ingredientLinesListOl.append(ingredientLinesLi);
    ingredientLinesLi.textContent = recipe.ingredientLines[i];
  }
  //display instructions in a list or provide link
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
async function fetchRecipeApi(recipe) {
  //strip out anything other than letters and spaces
  value = recipe.replace(regexNotLettersSpaces, "");
  var response = await fetch(
    `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(
      value
    )}&app_id=df46ca95&app_key=277fe705327a2981fb85ba1e1202742a`
  );
  // var response = await fetch(`./assets/js/recipe.json`);
  var result = await response.json();
  return result;
}
