export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResultList: document.querySelector('.results__list'),
    searchPage: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list'),
    favoriteList: document.querySelector('.likes__list'),
    favoriteMenu: document.querySelector('.likes__field')
};

export const elementStrings = {
    loader : 'loader'
}

export const showLoader = (parent, show) => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    const loaderElement = document.querySelector(`.${elementStrings.loader}`);
    if (show) {
        parent.insertAdjacentHTML('afterbegin', loader);
    } else if(loaderElement) {
        parent.removeChild(loaderElement);
    }    
}