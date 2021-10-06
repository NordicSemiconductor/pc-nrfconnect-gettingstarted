/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { logger } from 'nrfconnect/core';

import Course from '../parsers/Course';
import { loadVariables } from './variableActions';

export const CheckableState = {
    DONE: 'DONE',
    NOT_DONE: 'NOT_DONE',
    IN_PROGRESS: 'IN_PROGRESS',
};

export const COURSE_LOADED = 'COURSE_LOADED';
export const COURSE_LOAD_FAIL = 'COURSE_LOAD_FAIL';
export const CHECKABLE_CHANGE = 'CHECKABLE_CHANGE';

function courseLoadedAction(course) {
    return {
        type: COURSE_LOADED,
        course,
    };
}

function courseLoadFailedAction(error) {
    return {
        type: COURSE_LOAD_FAIL,
        error,
    };
}

// @param {String} courseFilename The file name of the JSON course file to load
// @returns {function(*)} Function that can be passed to redux dispatch.
export function loadCourseAction(courseFilename) {
    return dispatch => {
        Course.loadFromFile(courseFilename)
            .then(course => {
                dispatch(courseLoadedAction(course));
                dispatch(loadVariables(course));
            })
            .catch(error => {
                dispatch(courseLoadFailedAction(error));
            });
    };
}

// @param {String} tool Name/version of the tool the checkable belongs to
// @param {Number} checkableIndex Numeric ID of the checkable (relative to the tool)
// @param {String} checkableState New state of the checkable ("no", "in_process", "done")
// @returns {function(*)} Function that can be passed to redux dispatch.
export function checkableChangeAction(tool, checkableIndex, checkableState) {
    return {
        type: CHECKABLE_CHANGE,
        tool,
        checkableIndex,
        checkableState,
    };
}

export function manualCheck(tool, checkableIndex) {
    return (dispatch, getState) => {
        const state = getState().app.checkables[tool][checkableIndex];
        let newState;
        switch (state) {
            case CheckableState.DONE:
                newState = CheckableState.NOT_DONE;
                break;
            case CheckableState.NOT_DONE:
                newState = CheckableState.DONE;
                break;
            default:
                newState = state;
        }
        dispatch(checkableChangeAction(tool, checkableIndex, newState));
    };
}

export function check(tool, data) {
    return dispatch => {
        const { id } = data;
        dispatch(checkableChangeAction(tool, id, CheckableState.IN_PROGRESS));
        logger.debug(`${tool}-${id} verifying`);
        return data
            .runCheckers()
            .then(() => {
                dispatch(checkableChangeAction(tool, id, CheckableState.DONE));
                logger.info(`${tool}-${id} verified successfully`);
            })
            .catch(() => {
                dispatch(
                    checkableChangeAction(tool, id, CheckableState.NOT_DONE)
                );
                logger.info(`${tool}-${id} verification failed`);
            });
    };
}

function runCheck(first, ...rest) {
    return dispatch =>
        first
            ? dispatch(check(first.tool, first.checkable)).then(() =>
                  dispatch(runCheck(...rest))
              )
            : Promise.resolve();
}

export function checkAll(recipe) {
    return dispatch => {
        const checkerRunners = [];
        const { tool } = recipe;
        recipe.checkables.forEach(checkable => {
            if (!checkable.isManual) {
                checkerRunners.push({ tool, checkable });
            }
        });

        dispatch(runCheck(...checkerRunners));
    };
}

export function install(tool, data) {
    return dispatch => {
        const { id } = data;
        dispatch(checkableChangeAction(tool, id, CheckableState.IN_PROGRESS));
        return data
            .runAutomation()
            .then(() => {
                dispatch(
                    checkableChangeAction(tool, id, CheckableState.NOT_DONE)
                );
                logger.info(`${tool}-${id} is installed, should be verified`);
            })
            .catch(() => {
                dispatch(
                    checkableChangeAction(tool, id, CheckableState.NOT_DONE)
                );
                logger.error(`${tool}-${id} installation failed`);
            });
    };
}
