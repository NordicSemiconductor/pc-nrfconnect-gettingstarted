

import Course from '../parsers';

export const inProgress = 'in_progress';
export const notDone = 'no';
export const done = 'done';

// @param {String} courseFilename The file name of the JSON course file to load
// @returns {function(*)} Function that can be passed to redux dispatch.
export function loadCourse(courseFilename) {
    return dispatch => {
        Course.loadFromFile(courseFilename).then(course => {
            dispatch({
                type: 'COURSE_LOADED',
                course,
            });
        }).catch(error => {
            dispatch({
                type: 'COURSE_LOAD_FAIL',
                error,
            });
        });
    };
}

// @param {String} tool Name/version of the tool the checkable belongs to
// @param {Number} checkableIndex Numeric ID of the checkable (relative to the tool)
// @param {String} checkableState New state of the checkable ("no", "in_process", "done")
// @returns {function(*)} Function that can be passed to redux dispatch.
export function checkableChange(tool, checkableIndex, checkableState) {
    return ({
        type: 'CHECKABLE_CHANGE',
        tool,
        checkableIndex,
        checkableState,
    });
}

