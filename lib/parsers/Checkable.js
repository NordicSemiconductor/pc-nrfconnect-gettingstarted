import Step from './Step';

import checkerFactory from './Checker';
import AbstractParser from './AbstractParser';

/**
 * A Checkable is a dummy placeholder right now.
 * TODO: add support for specifying command-line commands, so that they might
 * be run. Fetch the exit value of the command(s), report success, etc.
 * TODO: Add a way to mark that there is no automated check, but rather the
 * user should mark this as done
 * TODO: Add support for platform filtering, pretty much like the Recipes
 * TODO: Decide whether to stick with the name, or to change it.
 */
export default class Checkable extends AbstractParser {
    /**
     * @param {Object} json The input JSON representation for this recipe
     * @param {Number=} id An optional numeric identifier, which should be
     * unique for each Checkable in a Recipe during runtime.
     */
    constructor(json, id) {
        super(json, 'Checkable', id, [
            { name: 'steps', type: Array, processer: data => data.map((value, stepId) => new Step(value, stepId)) },
            { name: 'checkers', type: Array, optional: true, processer: data => data.map((value, checkerId) => checkerFactory(value, checkerId)) },
        ]);
        this.parseVariablesFrom(this.steps);
        this.parseVariablesFrom(this.checkers);
    }

    /**
     * Serializes the custom properties for this parser
     * @return {Object} A JSON representation of the custom properties.
     */
    serialize() {
        return {
            steps: this.steps.map(step => step.asJSON()),
            checkers: this.checkers ?
                this.checkers.map(checker => checker.asJson()) :
                undefined,
        };
    }

    get isManual() {
        if (!this.checkers) {
            return true;
        }

        return !this.checkers.some(item => item.enabled);
    }

    /**
     * @return {Promise<Boolean>} Whether all own checkers passed or not.
     */
    runCheckers() {
        if (this.isManual) {
            throw new Error('Cannot runCheckers() on a manual checkable');
        }

        return Promise.all(this.checkers.map(checker => Promise.all(checker.run())));
    }
}
