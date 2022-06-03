/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import Alert from 'react-bootstrap/Alert';
import PropTypes from 'prop-types';

const DeprecationWarning = () => (
    <Alert variant="warning" className="description-view mb-3">
        <Alert.Heading className="mb-3">Deprecation warning</Alert.Heading>
        <p>
            This app has been replaced by the Toolchain Manager app. Go to the
            app overview to install and open the <b>Toolchain Manager</b>.
        </p>
        <p className="mb-0">
            The Toolchain Manager is available for Windows, Mac and Ubuntu
            operating systems and enables installs of the full toolchain that
            you need in order to work with the nRF Connect SDK. If you need to
            do a manual toolchain installation, please refer to the{' '}
            <a
                href="https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/gs_installing.html"
                target="_blank"
            >
                nRF Connect SDK documentation
            </a>
            .
        </p>
    </Alert>
);
const CourseView = ({ description, recipes, checkables, checkAll }) => (
    <div className="deprecation-wrapper">
        <DeprecationWarning />
    </div>
);

CourseView.propTypes = {
    recipes: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    checkables: PropTypes.shape({}).isRequired,
    description: PropTypes.string.isRequired,
    checkAll: PropTypes.func.isRequired,
};

export default CourseView;
