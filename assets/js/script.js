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
