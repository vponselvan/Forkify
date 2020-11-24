// Global app controller
import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as shoppingListView from './views/shoppingListView';
import * as favoriteView from './views/favoriteView';
import { elements, showLoader } from './views/base';
import Recipe from './models/Recipe';
import ShoppingList from './models/ShoppingList';
import Favorite from './models/Favorite';

/*** Global state
 * Search Object
 * current recipe object
 * shopping list object
 * liked recipe
 */

const state = {}

/**
 * SEARCH CONTROLLER 
 */

const controlSearch = async () => {
    //Get input
    const query = searchView.getInput();

    //Create search object
    if (query) {        
        
        state.search = new Search(query);

        //prepare ui
        searchView.clearInput();
        searchView.clearResult();

        //Search for recipe
        showLoader(elements.searchResultList, true);

        try {
            await state.search.getResult();
            //Update ui
            //console.log(state.search.result)
            showLoader(elements.searchResultList, false);
            searchView.renderResult(state.search.result);
        } catch(err) {
            console.log(err);
        }
    }
    
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchPage.addEventListener('click', (el) => {
    const btn = el.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.page, 10);
        searchView.clearResult();
        searchView.renderResult(state.search.result, goToPage);
    }    
});

/**
 * RECIPE CONTROLLER 
 */
const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '') ;
    
    if (id) {
        if (state.search) {
            searchView.highlightSelected(id)
        };
        recipeView.clearRecipe();
        state.recipe = new Recipe(id);   
        showLoader(elements.recipe, true);     
        try {
            await state.recipe.getRecipe(); 
            showLoader(elements.recipe, false);                
            state.recipe.parseIngredient();
            state.recipe.calcServing();
            state.recipe.calcTime();
            recipeView.renderRecipe(state.recipe, state.favorite.isLiked(id));
        } catch(err) {
            console.log(err);
        }
    }
};

['hashchange', 'load'].forEach( event => window.addEventListener(event, controlRecipe));


/**
 * SHOPPING LIST CONTROLLER 
 */

const controlShoppingList = () => {
    const items = state.recipe.ingredients; 

    if (!state.shoppingList) {
        state.shoppingList = new ShoppingList();
    }
    
    items.forEach(el => {
        state.shoppingList.addItem(el.count, el.unit, el.ingredient);        
    })

    state.shoppingList.items.forEach(el => shoppingListView.renderItem(el));
    
};

elements.shoppingList.addEventListener('click', e => {
    const itemId = e.target.closest('.shopping__item').dataset.itemid;    
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.shoppingList.deleteItem(itemId);
        shoppingListView.deleteItem(itemId);                
    }

    if(e.target.matches('.shopping__count-value')) {        
        const count = parseFloat(e.target.value, 10);        
        if (count < 0) {
            e.target.value = 0;
        }
        state.shoppingList.updateCount(itemId, count);
    }

});

/**
 * FAVORITE CONTROLLER 
 */

window.addEventListener('load', () => {
    state.favorite = new Favorite();
    state.favorite.getFavorite();
    //toggle like
    favoriteView.toggleLikeMenu(state.favorite.getCount());
    console.log(state.favorite.getCount());
    state.favorite.likes.forEach(el => {
        favoriteView.toggleLike(el.id, true)
        favoriteView.renderFavorite(el);
    });
});

const controlFavorite = () => {
    const rec = state.recipe;
    const id = rec.id;

    if (!state.favorite) state.favorite = new Favorite();

    if (!state.favorite.isLiked(id)) {
        //Not Liked
        const item = state.favorite.addItem(id, rec.title, rec.author, rec.image);
        favoriteView.renderFavorite(item);
        favoriteView.toggleLike(id, true);
    } else {
        //liked
        state.favorite.deleteItem(id);
        favoriteView.deleteItem(id);
        favoriteView.toggleLike(id, false);
        favoriteView.toggleLikeMenu(state.favorite.getCount());
    }   

}


elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        state.recipe.updateServing('dec');
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServing('inc');
    } else if (e.target.matches('.shopping__add_btn, .shopping__add_btn *')) {
        controlShoppingList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlFavorite();
    }
    recipeView.updateServingIngredient(state.recipe);
});

