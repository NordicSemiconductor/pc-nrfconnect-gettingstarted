/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { connect } from 'react-redux';

import { setVariable, setVariableOpenDialog } from '../actions/variableActions';
import SidePanel from '../components/SidePanel';

export default connect(
    state => ({
        variables: state.app.variables,
    }),
    dispatch => ({
        setVariable: (...args) => dispatch(setVariable(...args)),
        setVariableOpenDialog: (...args) =>
            dispatch(setVariableOpenDialog(...args)),
    })
)(SidePanel);
