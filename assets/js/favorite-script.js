var savedRecipe = JSON.parse(localStorage.getItem("savedRecipe")) || [];
console.log(savedRecipe);
displayRecipeBox(savedRecipe);

var recipeViewModal = document.querySelector(".recipe-view-modal");
recipeViewModal.addEventListener("click", function (event) {
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
//displays the available recipe in the UI
function displayRecipeBox(recipes) {
  //clear recipes before displaying new
  $("#recipe-cards").html("");
  //the length hits may not be uniform so using hits.length
  for (var i = 0; i < recipes.length; i++) {
    var displayedRecipes = document.querySelector(".displayed-recipes");
    var recipeEl = constructRecipeBoxInfo(recipes[i]);
    displayedRecipes.append(recipeEl);
  }
}
function constructRecipeBoxInfo(recipe) {
  console.log(recipe);
  var divEl = document.createElement("div");
  divEl.setAttribute(
    "class",
    "column is-half-mobile is-one-third-desktop is-one-quarter-widescreen"
  );
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

  var remBtn = document.querySelector(".remove-favorite");
  remBtn.addEventListener("click", function () {
    var savedRecipe = JSON.parse(localStorage.getItem("savedRecipe")) || [];
    savedRecipe = savedRecipe.filter(function (item) {
      return item.label !== recipe.label;
    });
    localStorage.setItem("savedRecipe", JSON.stringify(savedRecipe));
    displayRecipeBox(savedRecipe);
    var modal = document.querySelector(".modal");
    modal.classList.remove("is-active");
  });

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
