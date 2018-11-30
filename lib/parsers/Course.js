/* Copyright (c) 2015 - 2018, Nordic Semiconductor ASA
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

import path from 'path';
import { readFile } from './fs-promises';
import Recipe from './Recipe';

import AbstractParser from './AbstractParser';

/**
 *
 */
export default class Course extends AbstractParser {
    /**
     * @param {Object} json The input JSON representation for this course
     * @param {String=} searchPath An optional filesystem path where to look for
     * the JSON files containing Recipe definitions.
     */
    constructor(json, searchPath) {
        super(json, 'Course', -1, [
            'title',
            { name: 'description', optional: true, processer: AbstractParser.processDescriptionArray },
            { name: 'recipes', type: Array, processer: Course.extractRecipes(searchPath), promise: true },
        ]);
    }

    loadRecipes() {
        return this.recipesPromise
            .then(recipes => recipes.filter(({ enabled }) => enabled))
            .then(recipes => {
                this.recipes = recipes;
                this.parseVariablesFrom(recipes);
            });
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
            .then(text => JSON.parse(text))
            .catch(error => { throw new Error(`File ${filename} failed to be parsed as JSON: ${error}`); })
            .then(json => new Course(json, path.dirname(filename)))
            .then(course => course.loadRecipes().then(() => course));
    }

    static extractRecipes(searchPath) {
        return recipes => Promise.all(
                    recipes
                        .map(filename => (path.extname(filename) !== '.json' ? `${filename}.json` : filename))
                        .map(filename => (searchPath ? path.join(searchPath, filename) : filename))
                        .map((filepath, recipeId) => Recipe.loadFromFile(filepath, recipeId)),
        );
    }

    /**
     * Serializes the custom properties for this parser
     * @return {Object} A JSON representation of the custom properties.
     */
    serialize() {
        if (!this.recipes) {
            throw new Error('Cannot represent Course as JSON: its recipes haven\'t been loaded yet. Wait for the Course.loadRecipes() promise.');
        }
        return {
            recipes: this.recipes.map(recipe => recipe.tool),
        };
    }
}
