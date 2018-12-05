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
        Course.loadFromFile(courseFilename).then(course => {
            dispatch(courseLoadedAction(course));
            dispatch(loadVariables(course));
        }).catch(error => {
            dispatch(courseLoadFailedAction(error));
        });
    };
}

// @param {String} tool Name/version of the tool the checkable belongs to
// @param {Number} checkableIndex Numeric ID of the checkable (relative to the tool)
// @param {String} checkableState New state of the checkable ("no", "in_process", "done")
// @returns {function(*)} Function that can be passed to redux dispatch.
export function checkableChangeAction(tool, checkableIndex, checkableState) {
    return ({
        type: CHECKABLE_CHANGE,
        tool,
        checkableIndex,
        checkableState,
    });
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
        return data.runCheckers()
            .then(() => {
                dispatch(checkableChangeAction(tool, id, CheckableState.DONE));
                logger.info(`${tool}-${id} is verified`);
            })
            .catch(() => {
                dispatch(checkableChangeAction(tool, id, CheckableState.NOT_DONE));
                logger.info(`${tool}-${id} is verification failed`);
            });
    };
}

export function install(tool, data) {
    return dispatch => {
        const { id } = data;
        dispatch(checkableChangeAction(tool, id, CheckableState.IN_PROGRESS));
        return data.runAutomation()
            .then(() => {
                dispatch(checkableChangeAction(tool, id, CheckableState.NOT_DONE));
                logger.info(`${tool}-${id} is installed, should be verified`);
            })
            .catch(() => {
                dispatch(checkableChangeAction(tool, id, CheckableState.NOT_DONE));
                logger.error(`${tool}-${id} installation failed`);
            });
    };
}
