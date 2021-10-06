/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { combineReducers } from 'redux';

import checkables from './checkablesReducer';
import course from './courseReducer';
import variables from './variablesReducer';

const rootReducer = combineReducers({
    course,
    checkables,
    variables,
});

export default rootReducer;
