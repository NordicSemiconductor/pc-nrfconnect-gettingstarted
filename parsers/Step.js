/* eslint no-underscore-dangle: "off" */

import appliesToRunningPlatform from './platform-check';

/**
 * A Step is the most granular level of instructions to download/install/run/configure
 * something.
 *
 */
export default class Step {
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
        if (json.type !== 'Step') {
            // Inspired by GeoJSON, a course must have a "type": "Step" field
            throw new Error('"type" field in JSON is not "Step".');
        }

        // / TODO: Add commands/automation

        // 'platforms' and 'osReleases' fields are optional in steps
        this._platforms = json.platforms ? json.platforms : 'all';
        this._osreleases = json.osReleases ? json.osReleases : 'all';
        this._enabled = appliesToRunningPlatform(this._platforms, this._osreleases);

        this._title = json.title;
        this._description = json.description;
        this._commands = json.commands;
        this._id = id;
    }

    /**
     * @return {Object} A JSON representation of the current instance.
     */
    asJSON() {
        return {
            type: 'Step',
            title: this._title,
            platforms: this._platforms,
            osReleases: this._osreleases,
            description: this._description,
            commands: this._commands,
        };
    }

    get enabled() {
        return this._enabled;
    }

    get title() {
        return this._title;
    }

    get description() {
        return this._description;
    }

    get commands() {
        return this._commands;
    }

    get id() {
        return this._id;
    }
    // / TODO: load state from local config or from state json
}
