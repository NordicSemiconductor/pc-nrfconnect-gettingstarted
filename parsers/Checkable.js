/* eslint no-underscore-dangle: "off" */

import Step from './Step';

/**
 * A Checkable is a dummy placeholder right now.
 * TODO: add support for specifying command-line commands, so that they might
 * be run. Fetch the exit value of the command(s), report success, etc.
 * TODO: Add a way to mark that there is no automated check, but rather the
 * user should mark this as done
 * TODO: Add support for platform filtering, pretty much like the Recipes
 * TODO: Decide whether to stick with the name, or to change it.
 */
export default class Checkable {
    /**
     * @param {Object} json The input JSON representation for this recipe
     * @param {Number=} id An optional numeric identifier, which should be
     * unique for each Checkable in a Recipe during runtime.
     */
    constructor(json, id) {
        // Sanity checks
        if (!json || !(json instanceof Object)) {
            throw new Error('No JSON specified for Recipe constructor.');
        }
        if (json.type !== 'Checkable') {
            // Inspired by GeoJSON, a course must have a "type": "Checkable" field
            throw new Error('"type" field in JSON is not "Checkable".');
        }

        if (!json.steps || !(json.steps instanceof Array)) {
            throw new Error('"steps" field missing or not an Array.');
        }
        this._steps = json.steps.map((step, i) => new Step(step, i));
        this._id = id;
    }

    /**
     * @return {Object} A JSON representation of the current instance.
     */
    asJSON() {
        return {
            type: 'Checkable',
            steps: this._steps.map(step => step.asJSON()),
            //       recipes: this._recipes.map(recipe => recipe.asJSON())
        };
    }

    get steps() {
        return this._steps;
    }

    get id() {
        return this._id;
    }

    // / TODO: load state from local config or from state json
}
