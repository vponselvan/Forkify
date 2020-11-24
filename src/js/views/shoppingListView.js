import { elements } from './base';

export const renderItem = item => {
    const itemHtml = `
        <li class="shopping__item" data-itemId="${item.id}">
            <div class="shopping__count">
                <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;

    elements.shoppingList.insertAdjacentHTML('beforeend', itemHtml);
}

export const deleteItem = id => {
    const item = document.querySelector(`[data-itemId="${id}"]`);
    item.parentElement.removeChild(item);
}