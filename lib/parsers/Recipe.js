import { readFile } from './fs-promises';
import Checkable from './Checkable';
import AbstractParser from './AbstractParser';

/**
 * A Recipe is a set of things that should get one tool installed to a known
 * state.
 */
export default class Recipe extends AbstractParser {
    /**
     * @param {Object} json The input JSON representation for this recipe
     * @param {Number=} id An optional numeric identifier, which should be
     * unique for each Recipe during runtime.
     */
    constructor(json, id) {
        super(json, 'Recipe', id, [
            'title',
            { name: 'description', optional: true, processer: AbstractParser.processDescriptionArray },
            { name: 'tool', type: String, processer: Recipe.toolParser },
            { name: 'checkables', type: Array, processer: data => data.map((value, index) => new Checkable(value, index)) },
        ]);
        this.parseVariablesFrom(this.checkables);
    }

    /**
     * Splits the name and semvers of a tool name.
     *
     * @param {*} tool Complete name of the tool on the format name-semver
     * @returns {object} The split information of the tool
     */
    static toolParser(tool) {
        // Using indexOf() instead of slice() to split name/semver, because the
        // semver part can have hyphens too.
        const hypenPosition = tool.indexOf('-');

        if (hypenPosition === -1) {
            throw new Error('"tool" field is malformed.');
        }
        return `${tool.substring(0, hypenPosition)}-${tool.substring(hypenPosition + 1)}`;
    }

    /**
     * Loads a .json file from the filesystem, parses it, and returns an instance
     * of Recipe from it.
     *
     * @param {String} filename Relative path of the file to load
     * @param {Number=} id An optional numeric identifier, which should be
     * unique for each Recipe during runtime.
     * @returns {Promise<Recipe>} A Promise to an instance of Recipe
     */
    static async loadFromFile(filename, id) {
        return readFile(filename, { encoding: 'utf8' })
            .then(text => JSON.parse(text))
            .catch(ex => { throw new Error(`File ${filename} failed to be parsed as JSON: ${ex}`); })
            .then(async json => new Recipe(json, id));
    }

    /**
     * Serializes the custom properties for this parser
     * @return {Object} A JSON representation of the custom properties.
     */
    serialize() {
        return {
            tool: this.tool,
            checkables: this.checkables.map(checkable => checkable.asJSON()),
        };
    }
}
