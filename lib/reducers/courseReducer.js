/* Copyright (c) 2015 - 2017, Nordic Semiconductor ASA
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

/* This file uses for..of iterators, which conflict with the 'no-restricted-syntax'
   eslint rule. However, this runs only on Electron, which has support for the
   ES2015 features we're using here, so there's actually no risk. */
/* eslint no-restricted-syntax: "off" */


import { Record } from 'immutable';
import Store from 'electron-store';

const persistentStore = new Store({ name: 'nrf-framework-recipes' });

const InitialState = new Record({
    course: null,
    checkables: {},
});

export default function reducer(state = new InitialState(), action) {
    let checkables;

    switch (action.type) {
        case 'COURSE_LOADED':

            // Load checkable states from persistent storage (config file).
            // If not available, init all checkables as not checked.
            checkables = persistentStore.get('checkables', checkables) || {};

            for (const recipe of action.course.recipes) {
                if (recipe.enabled) {
                    const tool = recipe.tool;
                    if (!checkables[tool]) {
                        checkables[tool] = [];
                        for (const checkable of recipe.checkables) {
                            checkables[tool][checkable.id] = 'no';
                        }
                    }
                }
            }

            return state
                .set('checkables', checkables)
                .set('course', action.course);

        case 'COURSE_LOAD_FAIL':
            return state
                .set('course', null);

        case 'CHECKABLE_CHANGE':

            checkables = state.get('checkables');
            checkables[action.tool][action.checkableIndex] = action.checkableState;

            // Do not save the state when a child process is running - this covers
            // the case where a user kills the application while a check is
            // running on a child process.
            if (action.checkableState !== 'in_progress') {
                persistentStore.set('checkables', checkables);
            }

            return state.set('checkables', Object.assign({}, checkables));

        default:
    }
    return state;
}
