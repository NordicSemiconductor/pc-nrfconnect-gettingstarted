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


import * as courseActions from '../actions/courseActions';
import persistentStore from '../persistentStore';

const initialState = {};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case courseActions.COURSE_LOADED: {
            // Load checkable states from persistent storage (config file).
            // If not available, init all checkables as not checked.
            const checkables = persistentStore.get('checkables', {});

            for (const recipe of action.course.recipes) {
                if (recipe.enabled) {
                    const tool = recipe.tool;
                    if (!checkables[tool]) {
                        checkables[tool] = [];
                        for (const checkable of recipe.checkables) {
                            checkables[tool][checkable.id] = courseActions.CheckableState.NOT_DONE;
                        }
                    }
                }
            }

            return checkables;
        }

        case courseActions.COURSE_LOAD_FAIL: {
            return initialState;
        }

        case courseActions.CHECKABLE_CHANGE: {
            const tool = state[action.tool];
            tool[action.checkableIndex] = action.checkableState;
            const checkables = {
                ...state,
                [action.tool]: tool,
            };

            // Do not save the state when a child process is running - this covers
            // the case where a user kills the application while a check is
            // running on a child process.
            if (action.checkableState !== courseActions.CheckableState.IN_PROGRESS) {
                persistentStore.set('checkables', checkables);
            }

            return checkables;
        }

        default:
            break;
    }
    return state;
}
