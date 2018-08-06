import appliesToRunningPlatform from './platform-check';

/**
 * A Step is the most granular level of instructions to download/install/run/configure
 * something.
 *
 */
export default class Step {
    /**
   * @param {Object} json The input JSON representation for this recipe
   */
    constructor(json) {
    // Sanity checks

        if (!json || !(json instanceof Object)) {
            throw new Error('No JSON specified for Recipe constructor.');
        }
        if (json.type !== 'Step') {
            // Inspired by GeoJSON, a course must have a "type": "Recipe" field
            throw new Error('"type" field in JSON is not "Step".');
        }

        // / TODO: Add commands/automation

        this._enabled = appliesToRunningPlatform(json.platforms);
        this._platforms = json.platforms;

        this._title = json.title;
        this._description = json.description;
        this._commands = json.commands;
    }

    /**
   * @return {Object} A JSON representation of the current instance.
   */
    asJSON() {
        return {
            type: 'Step',
            title: this._title,
            platforms: this._platforms,
            description: this._description,
            commands: this._commands,
        };
    }

    get enabled() {
        return this._enabled;
    }

    get title() {
        return this.title;
    }

    get description() {
        return this._description;
    }

    get commands() {
        return this._commands;
    }
    // / TODO: load state from local config or from state json
}
