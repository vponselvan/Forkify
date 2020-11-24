import axios from 'axios';

export default class Recipe {
    constructor(recipeId) {
        this.recipeId = recipeId;
    }    

    async getRecipe() {
        const apiUrl = 'https://forkify-api.herokuapp.com/api/';
        const endpoint = 'get';

        try {
            const res = await axios(`${apiUrl}${endpoint}?rId=${this.recipeId}`);
            this.result = res.data.recipe;
            this.title = this.result.title;
            this.author = this.result.publisher;
            this.image = this.result.image_url;
            this.source = this.result.source_url;
            this.ingredients = this.result.ingredients;
           // console.log(this.result);
        } catch(error) {
            console.log(error);
        }
    }

    parseIngredient() {
        const unitsLong = ['tablespoons', 'tablespoon', 'teaspoons', 'teaspoon', 'ounces', 'ounce', 'pounds', 'pound', 'cups'];
        const unitsShort = ['tbps', 'tbps', 'tsp', 'tsp', 'oz', 'oz', 'lbs', 'lbs', 'cup'];

        const newIngredients = this.ingredients.map(e => {
            let ingredient = e.toLowerCase();
            unitsLong.forEach((cur, i) => {
                ingredient = ingredient.replace(cur, unitsShort[i]);
            })

            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            const arrIngredient = ingredient.split(' ');
            const unitIndex = arrIngredient.findIndex(el => unitsShort.includes(el));

            let objIngredient;
            if (unitIndex > -1) {
                //Exist
                const arrCount = arrIngredient.slice(0, unitIndex);
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrCount[0].replace('-', '+'));
                } else {
                    count = eval(arrIngredient.slice(0, unitIndex).join('+'));
                }
                objIngredient = {
                    count,
                    unit: arrIngredient[unitIndex],
                    ingredient: arrIngredient.slice(unitIndex + 1).join(' ')
                }

            } else if (parseInt(arrIngredient[0], 10)) {
                objIngredient = {
                    count: parseInt(arrIngredient[0], 10),
                    unit: '',
                    ingredient: arrIngredient.slice(1).join(' ')
                }
            }
            else if (unitIndex === -1) {
                //None
                objIngredient = {
                    count: '',
                    unit: '',
                    ingredient
                }
            }
            return objIngredient;
        })

        this.ingredients = newIngredients;
    }

    calcTime() {
        //Assuming the cooking time is 15 mins for each 3 ingredient
        const noOfIngredient = this.ingredients.length;
        const period = Math.ceil(noOfIngredient / 3);
        this.time = period * 15;
    }

    calcServing() {
        this.serving = 4;
    }

    updateServing(type) {
        // Serving
        const newServing = (type === 'dec') ? this.serving - 1 : this.serving + 1; 
        if (newServing >= 1) {            
            //ingredient
            this.ingredients = this.ingredients.map((cur, i) => {
                cur.count = cur.count * (newServing/this.serving);
                return cur;
            });
            this.serving = newServing;
        }
    }
};