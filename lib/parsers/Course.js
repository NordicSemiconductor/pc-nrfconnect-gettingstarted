import path from 'path';
import { readFile } from './fs-promises';
import Recipe from './Recipe';

import AbstractParser from './AbstractParser';

/**
 *
 */
export default class Course extends AbstractParser {
    /**
     * @param {Object} json The input JSON representation for this course
     * @param {String=} searchPath An optional filesystem path where to look for
     * the JSON files containing Recipe definitions.
     */
    constructor(json, searchPath) {
        super(json, 'Course', -1, [
            'title',
            { name: 'description', optional: true, processer: AbstractParser.processDescriptionArray },
            { name: 'recipes', type: Array, processer: Course.extractRecipes(searchPath), promise: true },
        ]);
    }

    loadRecipes() {
        return this.recipesPromise
            .then(recipes => recipes.filter(({ enabled }) => enabled))
            .then(recipes => {
                this.recipes = recipes;
                this.parseVariablesFrom(recipes);
            });
    }

    /**
     * Loads a .json file from the filesystem, parses it, and returns an instance
     * of Course from it.
     *
     * TODO: Store the path of the loaded file, use it as the base path for
     * the relative path of the recipes' files
     *
     * @param {String} filename Relative path of the file to load
     * @return {Promise<Course>} A Promise to an instance of Course
     */
    static loadFromFile(filename) {
        return readFile(filename, { encoding: 'utf8' })
            .then(text => JSON.parse(text))
            .catch(error => { throw new Error(`File ${filename} failed to be parsed as JSON: ${error}`); })
            .then(json => new Course(json, path.dirname(filename)))
            .then(course => course.loadRecipes().then(() => course));
    }

    static extractRecipes(searchPath) {
        return recipes => Promise.all(
                    recipes
                        .map(filename => (path.extname(filename) !== '.json' ? `${filename}.json` : filename))
                        .map(filename => (searchPath ? path.join(searchPath, filename) : filename))
                        .map((filepath, recipeId) => Recipe.loadFromFile(filepath, recipeId)),
        );
    }

    /**
     * Serializes the custom properties for this parser
     * @return {Object} A JSON representation of the custom properties.
     */
    serialize() {
        if (!this.recipes) {
            throw new Error('Cannot represent Course as JSON: its recipes haven\'t been loaded yet. Wait for the Course.loadRecipes() promise.');
        }
        return {
            recipes: this.recipes.map(recipe => recipe.tool),
        };
    }
}
