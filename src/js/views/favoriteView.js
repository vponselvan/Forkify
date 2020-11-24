import { elements } from './base';

export const renderFavorite = item => {
    const itemHtml = `
        <li>
            <a class="likes__link" href="#${item.id}">
                <figure class="likes__fig">
                    <img src="${item.image}" alt="${item.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${item.title}</h4>
                    <p class="likes__author">${item.author}</p>
                </div>
            </a>
        </li>
    `;

    elements.favoriteList.insertAdjacentHTML('beforeend', itemHtml);
}

export const deleteItem = id => {
    const item = document.querySelector(`.likes__link[href="#${id}"]`);
    console.log(item);
    item.parentElement.removeChild(item);
};

export const toggleLike = (id, isLiked) => {
    const likeBtn = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${likeBtn}`);
};

export const toggleLikeMenu = count => {
    elements.favoriteMenu.style.visiblity = count > 0 ? 'visible' : 'hidden';
};