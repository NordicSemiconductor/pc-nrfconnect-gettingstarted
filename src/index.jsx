/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import Alert from 'react-bootstrap/Alert';
import { App, Main } from 'pc-nrfconnect-shared';

import '../resources/css/index.scss';

const DeprecationWarning = () => (
    <Main>
        <div className="deprecation-wrapper">
            <Alert variant="warning" className="description-view mb-3">
                <Alert.Heading className="mb-3">
                    Deprecation warning
                </Alert.Heading>
                <p>
                    This app has been replaced by the Toolchain Manager app. Go
                    to the app overview to install and open the{' '}
                    <b>Toolchain Manager</b>.
                </p>
                <p className="mb-0">
                    The Toolchain Manager is available for Windows, Mac and
                    Ubuntu operating systems and enables installs of the full
                    toolchain that you need in order to work with the nRF
                    Connect SDK. If you need to do a manual toolchain
                    installation, please refer to the{' '}
                    <a
                        href="https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/gs_installing.html"
                        target="_blank"
                        rel="noreferrer"
                    >
                        nRF Connect SDK documentation
                    </a>
                    .
                </p>
            </Alert>
        </div>
    </Main>
);

export default () => (
    <App
        panes={[{ name: 'nRF Connect SDK', Main: DeprecationWarning }]}
        sidePanel={null}
        showLogByDefault={false}
    />
);
