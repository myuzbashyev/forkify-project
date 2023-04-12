import * as model from './module.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //0) Update result view to mark selected search results
    resultView.update(model.getSearchResultsPage());
    //1)Updating bookmarks view
    bookmarkView.update(model.state.bookmarks);

    //2) Loading recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;

    //3)Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    //1)Get search query
    const query = searchView.getQuery();
    if (!query) return;
    //2)Load search results
    await model.loadSearchResults(query);
    //3)Render results
    resultView.renderSpinner();
    // resultView.render(model.state.search.results);
    resultView.render(model.getSearchResultsPage());

    //4)Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (goToPage) {
  // 1)Render NEW results
  resultView.render(model.getSearchResultsPage(goToPage));

  // 2) Render initial pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings(in state)
  model.updateServings(newServings);
  //Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1)Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  //2)Update recipe view
  recipeView.update(model.state.recipe);

  //3)Render bookmarks
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();

    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarkView.render(model.state.bookmarks);

    //Change Id in  Url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back();

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
  }
};
// const controlAddRecipe = async function (newRecipe) {
//   try {
//     //Upload the new recipe data
//     await model.uploadRecipe(newRecipe);
//   } catch (err) {
//     console.error('🤷‍♂️', err);
//     addRecipeView.renderError(err.message);
//   }
// };

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

//////////////////////////////////////
// const array = [
//   {
//     quantity: 0.5,
//     name: 'hello',
//   },
//   {
//     quantity: 0.5,
//     name: 'hello',
//   },
//   {
//     quantity: 0.5,
//     name: 'hello',
//   },
//   {
//     quantity: 0.5,
//     name: 'hello',
//   },
//   {
//     quantity: 0.5,
//     name: 'hello',
//   },
// ];

// // NOTE my test for api array
// const newArray = array.map(el => {
//   return `
//   <li class="preview">
//   <a class="preview__link preview" href="#${el.quantity}">
//     <figure class="preview__fig">
//       <img src="${el.name}" alt="{e}" />
//     </figure>
//     <div class="preview__data">
//       <h4 class="preview__title">{t}}</h4>
//       <p class="preview__publisher">{e}</p>
//     </div>
//   </a>
// </li>
//   `;
// });

// console.log(newArray.join(''));
