var searchBtn = document.querySelector(".search-btn");

searchBtn.addEventListener("click", function () {
  fetchNutrientApi();
});
function fetchNutrientApi() {
  var inputSection = document.querySelector(".input-section");
  var value = inputSection.value;
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

 var recipesBtn = document.querySelector('.recipes-btn');

 recipesBtn.addEventListener('click', function(){
  fetchRecipeApi().then(function(result) {
    console.log(result);
  });
 });
 
 async function fetchRecipeApi() {
  var inputSection = document.querySelector(".input-section");
  var value = inputSection.value;
  var response = await fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(value)}&app_id=df46ca95&app_key=277fe705327a2981fb85ba1e1202742a`);
  var result = await response.json();
  return result;
}

