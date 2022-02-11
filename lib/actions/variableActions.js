/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import remote from '@electron/remote';

import persistentStore from '../persistentStore';

export const SET_VARIABLE = 'SET_VARIABLE';

function setVariableAction(name, value) {
    return {
        type: SET_VARIABLE,
        name,
        value,
    };
}

export function setVariable(name, value, save = true) {
    return dispatch => {
        if (save) {
            const savedVariables = persistentStore.get('variables', {});
            savedVariables[name] = value;
            persistentStore.set('variables', savedVariables);
        }
        dispatch(setVariableAction(name, value));
    };
}

async function showOpenDialog(defaultPath, type) {
    const {
        filePaths: [filename],
    } = await remote.dialog.showOpenDialog({
        defaultPath,
        properties: [type],
    });
    return filename;
}

export function setVariableOpenDialog(name, value, type) {
    return async dispatch => {
        const filename = await showOpenDialog(value, type);
        if (filename) {
            dispatch(setVariable(name, filename));
        }
    };
}

export function loadVariables(course) {
    return dispatch => {
        const savedVariables = persistentStore.get('variables', {});
        const { env } = remote.process;
        Object.keys(course.variables).forEach(key => {
            const value = savedVariables[key] || env[key];
            if (value !== undefined) {
                dispatch(setVariable(key, value, false));
            }
        });
    };
}
