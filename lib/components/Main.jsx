/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useContext, useEffect } from 'react';
import { ReactReduxContext, useSelector } from 'react-redux';
import { ipcRenderer } from 'electron';
import { join } from 'path';
import { Main } from 'pc-nrfconnect-shared';

import { loadCourseAction } from '../actions/courseActions';
import CourseView from '../containers/courseView';
import AbstractParser from '../parsers/AbstractParser';

export default () => {
    const { course, checkables } = useSelector(state => state.app);

    const { store } = useContext(ReactReduxContext);
    const { getState, dispatch } = store;

    useEffect(() => {
        AbstractParser.getState = getState;

        // TODO: Do not hardcode the course path.
        // IPC stuff to fetch the path of the currently running code (not
        // remote.app.getAppPath(), which is the path of the core code)
        ipcRenderer.once('app-details', (_sender, details) => {
            dispatch(
                loadCourseAction(
                    join(details.path, 'resources/data/course-zephyr.json')
                )
            );
        });

        ipcRenderer.send('get-app-details');
    }, [dispatch, getState]);

    return (
        <Main>
            {!course && 'No course loaded'}
            {course && (
                <CourseView
                    title={course.title}
                    description={course.description}
                    recipes={course.recipes}
                    checkables={checkables}
                />
            )}
        </Main>
    );
};
