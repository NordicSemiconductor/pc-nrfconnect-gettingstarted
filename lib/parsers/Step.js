import AbstractParser from './AbstractParser';


/**
 * A Step is the most granular level of instructions to download/install/run/configure
 * something.
 *
 */
export default class Step extends AbstractParser {
    /**
     * @param {Object} json The input JSON representation for this recipe
     * @param {Number=} id An optional numeric identifier, which should be
     * unique for each Checkable in a Recipe during runtime.
     */
    constructor(json, id) {
        super(json, 'Step', id, [
            'title',
            { name: 'description', processer: AbstractParser.processDescriptionArray },
            { name: 'commands', optional: true },
        ]);
    }

    /**
     * Serializes the custom properties for this parser
     * @return {Object} A JSON representation of the custom properties.
     */
    serialize() {
        return {
            commands: this.commands,
        };
    }
}
