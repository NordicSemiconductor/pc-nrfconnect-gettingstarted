/* eslint no-underscore-dangle: "off" */

import path from 'path';
import { readFile } from './fs-promises';
import Recipe from './Recipe';
import appliesToRunningPlatform from './platform-check';

/**
 *
 */
export default class Course {
    /**
     * @param {Object} json The input JSON representation for this course
     * @param {String=} searchPath An optional filesystem path where to look for
     * the JSON files containing Recipe definitions.
     */
    constructor(json, searchPath) {
        // Sanity checks
        if (!json || !(json instanceof Object)) {
            throw new Error('No JSON specified for Course constructor.');
        }
        if (json.type !== 'Course') {
            // Inspired by GeoJSON, a course must have a "type": "Course" field
            throw new Error('"type" field in JSON is not "Course".');
        }
        if (!json.title) {
            throw new Error('"title" field missing.');
        }
        if (!json.recipes || !(json.recipes instanceof Array)) {
            throw new Error('"recipes" field missing or not an Array.');
        }

        this._title = json.title;
        this._description = json.description;
        this._recipesPromise = Promise.all(json.recipes.map((f, i) => {
            let filename = f;
            if (path.extname(filename) !== 'json') {
                filename += '.json';
            }
            const fullPath = searchPath
                ? path.join(searchPath, filename)
                : filename;
            return Recipe.loadFromFile(fullPath, i);
        })).then(recipes => {
            this._recipes = recipes;
        });

        // 'platforms' and 'osReleases' fields are optional in courses
        this._platforms = json.platforms ? json.platforms : 'all';
        this._osreleases = json.osReleases ? json.osReleases : 'all';
        this._enabled = appliesToRunningPlatform(this._platforms, this._osreleases);
    }

    /**
     * Asynchronously loads the recipes pointed from the 'recipes' field of the
     * definition; filenames are supposed to be relative to the executable,
     * or relative to the file this Course was loaded from, if the Course was
     * instantiated through loadFromFile.
     * @return {Promise<Recipe>} The loaded recipes
     */
    loadRecipes() {
        return this._recipesPromise;
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
            .then(text => {
                let json;
                try {
                    json = JSON.parse(text);
                } catch (ex) {
                    throw new Error(`File ${filename} failed to be parsed as JSON: ${ex}`);
                }

                return new Course(json, path.dirname(filename));
            })
            .then(course => course.loadRecipes().then(() => course));
    }

    /**
     * @return {Object} A JSON representation of the current instance.
     */
    asJSON() {
        if (!this._recipes) {
            throw new Error('Cannot represent Course as JSON: its recipes haven\'t been loaded yet. Wait for the Course.loadRecipes() promise.');
        }
        return {
            type: 'Course',
            title: this._title,
            description: this._description,
            recipes: this._recipes.map(recipe => recipe.asJSON()),
        };
    }

    get title() {
        return this._title;
    }

    get description() {
        return this._description;
    }

    get recipes() {
        if (!this._recipes) {
            throw new Error('Cannot get recipes from Course: its recipes haven\'t been loaded yet. Wait for the Course.loadRecipes() promise.');
        }
        return this._recipes;
    }

    // / TODO: load state from local config or from state json
}