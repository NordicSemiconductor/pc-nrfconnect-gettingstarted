import Course from '../parsers';

export const CheckableState = {
    DONE: 'DONE',
    NOT_DONE: 'NOT_DONE',
    IN_PROGRESS: 'IN_PROGRESS',
};

export const COURSE_LOADED = 'COURSE_LOADED';
export const COURSE_LOAD_FAIL = 'COURSE_LOAD_FAIL';
export const CHECKABLE_CHANGE = 'CHECKABLE_CHANGE';

// @param {String} courseFilename The file name of the JSON course file to load
// @returns {function(*)} Function that can be passed to redux dispatch.
export function loadCourseAction(courseFilename) {
    return dispatch => {
        Course.loadFromFile(courseFilename).then(course => {
            dispatch({
                type: COURSE_LOADED,
                course,
            });
        }).catch(error => {
            dispatch({
                type: COURSE_LOAD_FAIL,
                error,
            });
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
        const state = getState().app.courseReducer.checkables[tool][checkableIndex];
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
