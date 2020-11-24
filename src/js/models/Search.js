import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }    

    async getResult() {
        const apiUrl = 'https://forkify-api.herokuapp.com/api/';
        const endpoint = 'search';

        try {
            const res = await axios(`${apiUrl}${endpoint}?q=${this.query}`);
            this.result = res.data.recipes;
            //console.log(this.result);
        } catch(error) {
            console.log(error);
        }
    }
};