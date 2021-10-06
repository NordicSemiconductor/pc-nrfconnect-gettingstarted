/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { connect } from 'react-redux';

import { checkAll } from '../actions/courseActions';
import CourseView from '../components/CourseView';

export default connect(
    (state, props) => ({
        ...props,
        title: state.app.course.title,
        description: state.app.course.description,
        recipes: state.app.course.recipes,
        checkables: state.app.checkables,
    }),
    dispatch => ({
        checkAll: recipe => dispatch(checkAll(recipe)),
    })
)(CourseView);
