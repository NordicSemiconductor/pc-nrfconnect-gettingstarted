/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { connect } from 'react-redux';

import {
    check,
    CheckableState,
    install,
    manualCheck,
} from '../actions/courseActions';
import CheckableView from '../components/CheckableView';

export default connect(
    (state, props) => ({
        ...props,
        currentState:
            state.app.checkables[props.tool][props.data.id] ||
            CheckableState.NOT_DONE,
    }),
    (dispatch, { tool, data }) => ({
        manualCheck: () => dispatch(manualCheck(tool, data.id)),
        check: () => dispatch(check(tool, data)),
        install: () =>
            dispatch(install(tool, data)).then(() =>
                dispatch(check(tool, data))
            ),
    })
)(CheckableView);
