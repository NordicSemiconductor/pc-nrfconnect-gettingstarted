/* eslint no-underscore-dangle: "off" */

import path from 'path';
import { readFile } from 'sander';
import Checkable from './Checkable';
import appliesToRunningPlatform from './platform-check';

/**
 * A Recipe is a set of things that should get one tool installed to a known
 * state.
 */
export default class Recipe {
    /**
     * @param {Object} json The input JSON representation for this recipe
     * @param {Number=} id An optional numeric identifier, which should be
     * unique for each Recipe during runtime.
     */
    constructor(json, id) {
        // Assume that a string is really a recipe for all platforms
        const data = (json instanceof String) ?
            { platforms: 'all', url: json } : json;

        // Sanity checks
        if (!data || !(data instanceof Object)) {
            throw new Error('No JSON specified for Recipe constructor.');
        }
        if (data.type !== 'Recipe') {
            // Inspired by GeoJSON, a course must have a "type": "Recipe" field
            throw new Error('"type" field in JSON is not "Recipe".');
        }
        if (!data.tool || typeof data.tool !== 'string') {
            throw new Error('"tool" field must be a string.');
        }

        // 'platforms' and 'osReleases' fields are optional in recipes
        this._platforms = data.platforms ? data.platforms : 'all';
        this._osreleases = data.osReleases ? data.osReleases : 'all';
        this._enabled = appliesToRunningPlatform(this._platforms, this._osreleases);

        // Using indexOf() instead of slice() to split name/semver, because the
        // semver part can have hyphens too.
        const hypenPosition = data.tool.indexOf('-');
        if (hypenPosition === -1) {
            throw new Error('"tool" field is malformed.');
        }
        this._toolName = data.tool.substring(0, hypenPosition);
        this._toolSemver = data.tool.substring(hypenPosition + 1);

        this._title = data.title;
        this._description = data.description;
        this._id = id;

        // / TODO: Decide whether to stick with this name or change it.
        if (!data.checkables || !(data.checkables instanceof Array)) {
            throw new Error('"checkables" field missing or not an Array.');
        }
        this._checkables = data.checkables.map((checkable, i) => new Checkable(checkable, i));
    }

    /**
     * Loads a .json file from the filesystem, parses it, and returns an instance
     * of Recipe from it.
     *
     * @param {String} filename Relative path of the file to load
     * @returns {Promise<Recipe>} A Promise to an instance of Recipe
     */
    static loadFromFile(filename) {
        return readFile(filename, { encoding: 'utf8' }).then(text => {
            let json;
            try {
                json = JSON.parse(text);
            } catch (ex) {
                throw new Error(`File ${filename} failed to be parsed as JSON: ${ex}`);
            }

            // Sanity check: The filename must equal the "tool" field inside it.
            // This is done to make file metadata explicit in the file's contents,
            // to force the file contents (after editing) to match the file name,
            // and to be able to recreate the filename from the file contents.
            if (json.tool !== path.basename(filename).replace(/\.json$/, '')) {
                throw new Error(`"tool" field doesn't match filename: ${json.tool} vs ${filename}`);
            }
            return new Recipe(json);
        });
    }

    /**
     * @return {Object} A JSON representation of the current instance.
     */
    asJSON() {
        return {
            type: 'Recipe',
            title: this._title,
            tool: this.tool,
            platforms: this._platforms,
            osReleases: this._osreleases,
            description: this._description,
            checkables: this._checkables.map(checkable => checkable.asJSON()),
            //       recipes: this._recipes.map(recipe => recipe.asJSON())
        };
    }

    get checkables() {
        return this._checkables;
    }

    get enabled() {
        return this._enabled;
    }

    get description() {
        return this._description;
    }

    get title() {
        return this._title;
    }

    get tool() {
        return `${this._toolName}-${this._toolSemver}`;
    }

    get id() {
        return this._id;
    }

    // / TODO: load state from local config or from state json
}
