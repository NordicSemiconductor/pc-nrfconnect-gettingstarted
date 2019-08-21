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
     * @returns {Object} A JSON representation of the custom properties.
     */
    serialize() {
        return {
            tool: this.tool,
            checkables: this.checkables.map(checkable => checkable.asJSON()),
        };
    }
}
