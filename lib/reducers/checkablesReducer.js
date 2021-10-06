/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
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
                    const { tool } = recipe;
                    if (!checkables[tool]) {
                        checkables[tool] = [];
                        for (const checkable of recipe.checkables) {
                            checkables[tool][checkable.id] =
                                courseActions.CheckableState.NOT_DONE;
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
            if (
                action.checkableState !==
                courseActions.CheckableState.IN_PROGRESS
            ) {
                persistentStore.set('checkables', checkables);
            }

            return checkables;
        }

        default:
            break;
    }
    return state;
}
