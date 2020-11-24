export default class Favorite {
    constructor() {
        this.likes = []
    }

    addItem(id, title, author, image) {
        const item = {
            id,
            title,
            author,
            image
        };
        this.likes.push(item);
        this.persistFavorite()
        return item;
    }

    deleteItem(id) {
        const index = this.likes.findIndex(el => el.id === id);
        if (index !== -1) {
            this.likes.splice(index, 1);
        }
        this.persistFavorite();
    }

    getCount() {
        return this.likes.length;
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    persistFavorite() {
        localStorage.setItem('favorites', JSON.stringify(this.likes));
    }

    getFavorite() {
        const storage = JSON.parse(localStorage.getItem('favorites'));
        if (storage) this.likes = storage;
    }
}