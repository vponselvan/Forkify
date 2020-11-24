import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResult = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchPage.innerHTML = '';
}

export const highlightSelected = id => {
    Array.from(document.querySelectorAll('.results__link')).forEach(el => el.classList.remove('results__link--active'));
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}

const limitString = (str, limit = 17) => {
    const newStr = [];
    if (str.length > limit) {
        str.split(' ').reduce((acc, cur) => {
            if (acc + cur.length < limit) {
                newStr.push(cur);
                return acc + cur.length;
            }   
        }, 0);
        return newStr.join(' ') + ' ...';
    }    
    return str;
}

const renderRecipe = recipe => {
    const recipeHtml = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitString(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;

    elements.searchResultList.insertAdjacentHTML('beforeend', recipeHtml);
};

export const renderResult = (recipes, page = 1, pageSize = 10) => {
    const start = (page - 1) * pageSize;
    const end = page * pageSize;

    recipes.slice(start, end).forEach(renderRecipe);
    renderButton(page, recipes.length, pageSize);    
};

export const renderButton = (page, totalRecipes, pageSize) => {
    const totalPages = Math.ceil(totalRecipes / pageSize);

    if (totalPages > 1 && page === 1) {
        createButton(page, 'next');
    } else if (page < totalPages) {
        //Both
        createButton(page, 'next');
        createButton(page, 'prev');
    } else if (page === totalPages) {
        //Prev
        createButton(page, 'prev');
    }
};

const createButton = (page, type) => {
    const btnHtml = `
    <button class="btn-inline results__btn--${type}" data-page=${type === 'prev' ? page - 1 : page + 1}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    </button>
    `;    
    elements.searchPage.insertAdjacentHTML('afterbegin', btnHtml);
};