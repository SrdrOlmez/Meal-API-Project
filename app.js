const searchButton = document.querySelector('.search-button');
const mealResult = document.getElementById('meal');
const mealDetails = document.querySelector('.meal-details');
const popupCloseBtn = document.getElementById('popup-close-btn');
const selectCategory = document.getElementById('select-category');



selectCategory.addEventListener('click', createCategories);
searchButton.addEventListener('click', resultsByIngredient);
mealResult.addEventListener('click', createPopup);
popupCloseBtn.addEventListener('click', () =>{
  mealDetails.parentElement.classList.remove('showPopup')
});


async function createCategories() {
  try {
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list");
    const data = await response.json(); 
    data.meals.forEach((meal) => {
      const optionElement = document.createElement("option");
      optionElement.textContent = meal.strCategory;
      selectCategory.appendChild(optionElement);
    });
    selectCategory.removeEventListener('click', createCategories);
  } catch (err) {
    console.log(err.message)
  }
}


async function resultsByCategory() {
  try {
    selectCategory.addEventListener('change', async (event) => {
      const response = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=" + event.target.value);
      const data = await response.json();
      let html = "";
      if (data.meals) {
        data.meals.forEach(element => {
          html += `
          <div class="meal-result" data-id="${element.idMeal}">
                <div class="meal-img">
                  <img src="${element.strMealThumb}" alt="meal">
                </div>
                <div class="meal-name">
                  <h3>${element.strMeal}</h3>
                  <a href="" class="get-recipe-btn">Show Recipe</a>
                </div>
          </div>      
          `;
        });
        mealResult.classList.remove('noResult')
      }
      mealResult.innerHTML = html; 
    })
  } catch (err) {
    console.log(err.message);
  }
}


async function resultsByIngredient() {
  try {
    let searchInput = document.querySelector('#search-input').value.trim();
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInput}`);
    const data = await response.json();
  
    let html = "";
    if (data.meals) {
      data.meals.forEach(element => {
        html += `
        <div class="meal-result" data-id="${element.idMeal}">
              <div class="meal-img">
                <img src="${element.strMealThumb}" alt="meal">
              </div>
              <div class="meal-name">
                <h3>${element.strMeal}</h3>
                <a href="" class="get-recipe-btn">Show Recipe</a>
              </div>
        </div>      
        `;
      });
      mealResult.classList.remove('noResult')
    } else {
      html = "Oops! Sorry, try another one."
      mealResult.classList.add('noResult')
    }
    mealResult.innerHTML = html; 

  } catch (err) {
    console.log(err.message);
  }
}


async function createPopup(event) {
  try {
    event.preventDefault();
  if (event.target.classList.contains('get-recipe-btn')) {
    let mealItem = event.target.parentElement.parentElement;
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
    const data = await response.json();
    renderPopup(data.meals);
  }
  } catch (err) {
    console.log(err.message);
  }
}


function renderPopup(meal) {
  meal = meal[0];
  let html = `
    <h2 class="recipe-title">${meal.strMeal}</h2>
    <p class="recipe-category">${meal.strCategory}</p>      
    <div class="recipe-instructions">
      <div class="recipe-ingredients">
        <ul class="recipe-list"></ul>
      </div>
      <h3>Instructions:</h3>
      <p>${meal.strInstructions}</p>
    </div>
    <div class="recipe-meal-img">
      <img src="${meal.strMealThumb}" alt="">
    </div>
    <div class="recipe-link">
      <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
    </div>
  `;
  mealDetails.innerHTML = html;
  mealDetails.parentElement.classList.add('showPopup');
}

window.addEventListener('load', resultsByCategory);