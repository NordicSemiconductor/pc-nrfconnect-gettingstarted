/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { App } from 'pc-nrfconnect-shared';

import Main from './lib/components/Main';
import appReducer from './lib/reducers';

import './resources/css/index.scss';

export default () => (
    <App
        appReducer={appReducer}
        panes={[{ name: 'nRF Connect SDK', Main }]}
        sidePanel={null}
        showLogByDefault={false}
    />
);
