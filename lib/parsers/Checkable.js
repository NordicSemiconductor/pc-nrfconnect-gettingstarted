/* Copyright (c) 2015, Nordic Semiconductor ASA
 *
 * All rights reserved.
 *
 * Use in source and binary forms, redistribution in binary form only, with
 * or without modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions in binary form, except as embedded into a Nordic
 *    Semiconductor ASA integrated circuit in a product or a software update for
 *    such product, must reproduce the above copyright notice, this list of
 *    conditions and the following disclaimer in the documentation and/or other
 *    materials provided with the distribution.
 *
 * 2. Neither the name of Nordic Semiconductor ASA nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * 3. This software, with or without modification, must only be used with a Nordic
 *    Semiconductor ASA integrated circuit.
 *
 * 4. Any software provided in binary form under this license must not be reverse
 *    engineered, decompiled, modified and/or disassembled.
 *
 * THIS SOFTWARE IS PROVIDED BY NORDIC SEMICONDUCTOR ASA "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY, NONINFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL NORDIC SEMICONDUCTOR ASA OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
 * TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import AbstractParser from './AbstractParser';

import Step from './Step';
import checkerFactory from './Checker';
import Automation from './Automation';

function runPromises(first, ...rest) {
    return first
        ? first.run().then(() => runPromises(...rest))
        : Promise.resolve();
}

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
            {
                name: 'steps',
                type: Array,
                processer: data => data.map((value, stepId) => new Step(value, stepId)),
            },
            {
                name: 'checkers',
                type: Array,
                optional: true,
                processer: data => data.map((value, checkerId) => checkerFactory(value, checkerId)),
            },
            {
                name: 'automation',
                type: Array,
                optional: true,
                processer: data => data.map(
                    (value, automationId) => new Automation(value, automationId),
                ),
            },
        ]);
        this.parseVariablesFrom(this.steps);
        this.parseVariablesFrom(this.checkers);
        this.parseVariablesFrom(this.automation);
    }

    /**
     * Serializes the custom properties for this parser
     * @returns {Object} A JSON representation of the custom properties.
     */
    serialize() {
        return {
            steps: this.steps.map(step => step.asJSON()),
            checkers: this.checkers
                ? this.checkers.map(checker => checker.asJson())
                : undefined,
        };
    }

    get isManual() {
        if (!this.checkers) {
            return true;
        }

        return !this.checkers.some(item => item.enabled);
    }

    /**
     * @returns {Promise<Boolean>} Whether all own checkers passed or not.
     */
    runCheckers() {
        if (this.isManual) {
            throw new Error('Cannot runCheckers() on a manual checkable');
        }

        return runPromises(...this.checkers);
    }

    runAutomation() {
        return runPromises(...this.automation);
    }
}
