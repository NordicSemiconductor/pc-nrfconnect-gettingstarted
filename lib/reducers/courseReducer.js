/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import * as courseActions from '../actions/courseActions';

const initialState = {
    title: '',
    description: '',
    recipes: [],
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case courseActions.COURSE_LOADED: {
            return {
                ...action.course,
            };
        }

        case courseActions.COURSE_LOAD_FAIL: {
            return initialState;
        }

        default:
            break;
    }
    return state;
}
