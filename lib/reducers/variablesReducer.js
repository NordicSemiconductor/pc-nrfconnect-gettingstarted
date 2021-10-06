/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { COURSE_LOAD_FAIL, COURSE_LOADED } from '../actions/courseActions';
import { SET_VARIABLE } from '../actions/variableActions';

const initialState = {};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case COURSE_LOADED: {
            return {
                ...action.course.variables,
            };
        }

        case COURSE_LOAD_FAIL: {
            return initialState;
        }

        case SET_VARIABLE: {
            const { name, value } = action;
            return {
                ...state,
                [name]: value,
            };
        }

        default:
            break;
    }
    return state;
}
