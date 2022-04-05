const searchButton = document.querySelector('.search-button');
const mealResult = document.getElementById('meal');
const mealDetails = document.querySelector('.meal-details');
const popupCloseBtn = document.getElementById('popup-close-btn');
const selectCategory = document.getElementById('select-category');
selectCategory.addEventListener('click', getCategory)
searchButton.addEventListener('click', fetchMealResult);
mealResult.addEventListener('click', createPopup);
popupCloseBtn.addEventListener('click', () =>{
  mealDetails.parentElement.classList.remove('showPopup')
});

async function getCategory() {
  try {
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list");
    const data = await response.json(); 
    const list = data.meals;
    console.log(list);
    list.forEach((meal) => {
      const optionElement = document.createElement("option");
      optionElement.textContent = meal.strCategory;
      selectCategory.appendChild(optionElement);
    });
    
    selectCategory.addEventListener('change', async (event) => {
      const response = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=" + event.target.value);
      const data = await response.json();
      console.log(data);
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
                  <a href="" class="get-recipe-btn">Recipe Link</a>
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


async function fetchMealResult() {
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
                <a href="" class="get-recipe-btn">Recipe Link</a>
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
  event.preventDefault();
  if (event.target.classList.contains('get-recipe-btn')) {
    let mealItem = event.target.parentElement.parentElement;
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
    const data = await response.json();
    mealRecipeModal(data.meals);
  }
}

function mealRecipeModal(meal) {
  console.log(meal);
  meal = meal[0];
  let html = `
    <h2 class="recipe-title">${meal.strMeal}</h2>
    <p class="recipe-category">${meal.strCategory}</p>      
    <div class="recipe-instructions">
      <div class="recipe-ingredients">
        <ul class="recipe-list">s</ul>
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
  const ingredientList = document.querySelector('.recipe-list')
  mealDetails.innerHTML = html;
  mealDetails.parentElement.classList.add('showPopup');
}