

import Course from '../parsers';

// @param {String} courseFilename The file name of the JSON course file to load
// @returns {function(*)} Function that can be passed to redux dispatch.

export function loadCourse(courseFilename) {
    return function(dispatch) {
        Course.loadFromFile(courseFilename).then((course)=>{
            dispatch({
                type: 'COURSE_LOADED',
                course
            });
        }).catch((error)=>{
            dispatch({
                type: 'COURSE_LOAD_FAIL',
                error
            });
        });
    }
}

export function checkableChange(tool, checkableIndex, isDone) {
    return function(dispatch) {
        dispatch({
            type: 'CHECKABLE_CHANGE',
            tool,
            checkableIndex,
            isDone
        });
    }
}




