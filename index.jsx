/* Copyright (c) 2015 - 2017, Nordic Semiconductor ASA
 *
 * All rights reserved.
 *
 * Use in source and binary forms, redistribution in binary form only, with
 * or without modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions in binary form, except as embedded into a Nordic
 *    Semiconductor ASA integrated circuit in a product or a software update for
 *    such product, must reproduce the above copyright notice, this list of
 *    conditions and the following disclaimer in the documentation and/or other
 *    materials provided with the distribution.
 *
 * 2. Neither the name of Nordic Semiconductor ASA nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * 3. This software, with or without modification, must only be used with a Nordic
 *    Semiconductor ASA integrated circuit.
 *
 * 4. Any software provided in binary form under this license must not be reverse
 *    engineered, decompiled, modified and/or disassembled.
 *
 * THIS SOFTWARE IS PROVIDED BY NORDIC SEMICONDUCTOR ASA "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY, NONINFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL NORDIC SEMICONDUCTOR ASA OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
 * TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { join } from 'path';
import React from 'react';
import { combineReducers } from 'redux';
import { ipcRenderer } from 'electron';
import { loadCourseAction } from './lib/actions/courseActions';
import courseReducer from './lib/reducers/courseReducer';
import CourseView from './lib/containers/CourseView';
import './resources/css/index.less';

/* eslint-disable react/prop-types, no-unused-vars */


// nRF Connect boilerplate app
// ===========================
//
// In this boilerplate app, we show a "dummy" implementation of all
// available functions. By implementing one or more of the functions
// below, you can add your own behavior.
//
// All of these functions are optional, and those that are not needed
// for customizing the app should be removed.
//
// The API for apps is also documented with additional examples on:
// https://github.com/NordicSemiconductor/pc-nrfconnect-core/wiki/API-reference


// App configuration
// =================

/**
 * Configures which device types to show in the device selector, and how
 * they should be set up (programmed) when selected.
 *
 * @description Supported properties:
 * - `selectorTraits`: Configures which device types to show in the
 * device selector. The config format is described on
 * https://github.com/NordicSemiconductor/nrf-device-lister-js.
 * - `deviceSetup`: Configures which firmware to program when a device is
 * selected in the device selector. The config format is described on
 * https://github.com/NordicSemiconductor/nrf-device-setup-js.
 */
export const config = {
    selectorTraits: {
        jlink: false,
        nordicUsb: false,
        serialport: false,
    },
    deviceSetup: {
        // dfu: {},
        // jprog: {},
    },
};


// Lifecycle methods
// =================

/**
 * Invoked right before the app is rendered for the first time.
 *
 * @param {Function} dispatch The Redux dispatch function, which may be
 * invoked to dispatch actions.
 * @param {Function} getState The Redux getState function, which may be
 * invoked to read the current app state.
 * @returns {undefined}
 */
export function onInit(dispatch, getState) {

}

/**
 * Invoked right after the app has been rendered for the first time.
 *
 * @param {Function} dispatch The Redux dispatch function, which may be
 * invoked to dispatch actions.
 * @param {Function} getState The Redux getState function, which may be
 * invoked to read the current app state.
 * @returns {undefined}
 */
export function onReady(dispatch, getState) {
    // TODO: Do not hardcode the course path.
    // IPC stuff to fetch the path of the currently running code (not
    // remote.app.getAppPath(), which is the path of the core code)
    ipcRenderer.once('app-details', (sender, details) => {
        dispatch(loadCourseAction(join(details.path, 'resources/data/course-zephyr.json')));
    });

    ipcRenderer.send('get-app-details');
}


// Component decoration
// ====================

/**
 * Decorates the core DeviceSelector component, which is rendered in the
 * top left corner of the app. See:
 * https://github.com/NordicSemiconductor/pc-nrfconnect-core/blob/master/lib/windows/app/components/DeviceSelector.jsx
 *
 * @param {Function} DeviceSelector The core DeviceSelector component.
 * @returns {Function} A new React component.
 */
export function decorateDeviceSelector(DeviceSelector) {
    return props => (
        <div />
    );
}

/**
 * Decorates the core Logo component, which is rendered in the top right
 * corner of the app. See:
 * https://github.com/NordicSemiconductor/pc-nrfconnect-core/blob/master/lib/components/Logo.jsx
 *
 * @param {Function} Logo The core Logo component.
 * @returns {Function} A new React component.
 */
export function decorateLogo(Logo) {
    return props => (
        <Logo {...props} />
    );
}

/**
 * Decorates the core LogEntry component, which renders a single log line
 * in the LogViewer. See:
 * https://github.com/NordicSemiconductor/pc-nrfconnect-core/blob/master/lib/windows/app/components/LogEntry.jsx
 *
 * @param {Function} LogEntry The core LogEntry component.
 * @returns {Function} A new React component.
 */
export function decorateLogEntry(LogEntry) {
    return props => (
        <LogEntry {...props} />
    );
}

/**
 * Decorates the core LogHeader component, which renders the header above
 * the log entries. See:
 * https://github.com/NordicSemiconductor/pc-nrfconnect-core/blob/master/lib/windows/app/components/LogHeader.jsx
 *
 * @param {Function} LogHeader The core LogHeader component.
 * @returns {Function} A new React component.
 */
export function decorateLogHeader(LogHeader) {
    return props => (
        <LogHeader {...props} />
    );
}

/**
 * Decorates the core LogHeaderButton component, which are the buttons
 * rendered in the LogViewer header. See:
 * https://github.com/NordicSemiconductor/pc-nrfconnect-core/blob/master/lib/windows/app/components/LogHeaderButton.jsx
 *
 * @param {Function} LogHeaderButton The core LogHeaderButton component.
 * @returns {Function} A new React component.
 */
export function decorateLogHeaderButton(LogHeaderButton) {
    return props => (
        <LogHeaderButton {...props} />
    );
}

/**
 * Decorates the core MainView component, which is the empty area below
 * the NavBar and above the LogViewer. See:
 * https://github.com/NordicSemiconductor/pc-nrfconnect-core/blob/master/lib/windows/app/components/MainView.jsx
 *
 * @param {Function} MainView The core MainView component.
 * @returns {Function} A new React component.
 */
export function decorateMainView(MainView) {
    return props => {
        if (!props.course) {
            return (
                <MainView {...props} >
        No course loaded
        </MainView>
            );
        }

        return (
            <MainView {...props} >
                <CourseView
                    title={props.course.title}
                    description={props.course.description}
                    recipes={props.course.recipes}
                    checkables={props.checkables}
                />
            </MainView>
        );
    };
}

/**
 * Decorates the core NavBar component, which is the bar that is rendered
 * in the upper part of the app. See:
 * https://github.com/NordicSemiconductor/pc-nrfconnect-core/blob/master/lib/windows/app/components/NavBar.jsx
 *
 * @param {Function} NavBar The core NavBar component.
 * @returns {Function} A new React component.
 */
export function decorateNavBar(NavBar) {
    return props => (
        <NavBar {...props} />
    );
}

/**
 * Decorates the core NavMenu component, which is the navigation menu
 * that is rendered in the NavBar. See:
 * https://github.com/NordicSemiconductor/pc-nrfconnect-core/blob/master/lib/components/NavMenu.jsx
 *
 * @param {Function} NavMenu The core NavMenu component.
 * @returns {Function} A new React component.
 */
export function decorateNavMenu(NavMenu) {
    return props => (
        <NavMenu {...props} />
    );
}

/**
 * Decorates the core NavMenuItem component, which represents one item in
 * the NavMenu. See:
 * https://github.com/NordicSemiconductor/pc-nrfconnect-core/blob/master/lib/components/NavMenuItem.jsx
 *
 * @param {Function} NavMenuItem The core NavMenu component.
 * @returns {Function} A new React component.
 */
export function decorateNavMenuItem(NavMenuItem) {
    return props => (
        <NavMenuItem {...props} />
    );
}

/**
 * Decorates the core SidePanel component, which is the empty area
 * rendered to the right of the app. See:
 * https://github.com/NordicSemiconductor/pc-nrfconnect-core/blob/master/lib/windows/app/components/SidePanel.jsx
 *
 * @param {Function} SidePanel The core SidePanel component.
 * @returns {Function} A new React component.
 */
export function decorateSidePanel(SidePanel) {
    return props => (
        <SidePanel {...props} />
    );
}


// Passing information from state to components
// ============================================

/**
 * Receives the state object and returns props that will be passed to the
 * DeviceSelector component. See also the default `mapStateToProps` in:
 * https://github.com/NordicSemiconductor/pc-nrfconnect-core/blob/master/lib/windows/app/containers/DeviceSelectorContainer.js
 *
 * @param {Object} state The Redux state object.
 * @param {Object} props The default core props.
 * @returns {Object} Props that will be passed to the component.
 */
export function mapDeviceSelectorState(state, props) {
    return {
        ...props,
    };
}

/**
 * Receives the state object and returns props that will be passed to the
 * LogHeader component. See also the default `mapStateToProps` in:
 * https://github.com/NordicSemiconductor/pc-nrfconnect-core/blob/master/lib/windows/app/containers/LogHeaderContainer.js
 *
 * @param {Object} state The Redux state object.
 * @param {Object} props The default core props.
 * @returns {Object} Props that will be passed to the component.
 */
export function mapLogHeaderState(state, props) {
    return {
        ...props,
    };
}

/**
 * Receives the state object and returns props that will be passed to the
 * LogViewer component. See also the default `mapStateToProps` in:
 * https://github.com/NordicSemiconductor/pc-nrfconnect-core/blob/master/lib/windows/app/containers/LogViewerContainer.js
 *
 * @param {Object} state The Redux state object.
 * @param {Object} props The default core props.
 * @returns {Object} Props that will be passed to the component.
 */
export function mapLogViewerState(state, props) {
    return {
        ...props,
    };
}

/**
 * Receives the state object and returns props that will be passed to the
 * MainView component. See also the default `mapStateToProps` in:
 * https://github.com/NordicSemiconductor/pc-nrfconnect-core/blob/master/lib/windows/app/containers/MainViewContainer.js
 *
 * @param {Object} state The Redux state object.
 * @param {Object} props The default core props.
 * @returns {Object} Props that will be passed to the component.
 */
export function mapMainViewState(state, props) {
    return {
        ...props,
        course: state.app.courseReducer.course,
        checkables: state.app.courseReducer.checkables,
    };
}

/**
 * Receives the state object and returns props that will be passed to the
 * NavMenu component. See also the default `mapStateToProps` in:
 * https://github.com/NordicSemiconductor/pc-nrfconnect-core/blob/master/lib/windows/app/containers/NavMenuContainer.js
 *
 * @param {Object} state The Redux state object.
 * @param {Object} props The default core props.
 * @returns {Object} Props that will be passed to the component.
 */
export function mapNavMenuState(state, props) {
    return {
        ...props,
    };
}

/**
 * Receives the state object and returns props that will be passed to the
 * SidePanel component. See also the default `mapStateToProps` in:
 * https://github.com/NordicSemiconductor/pc-nrfconnect-core/blob/master/lib/windows/app/containers/SidePanelContainer.js
 *
 * @param {Object} state The Redux state object.
 * @param {Object} props The default core props.
 * @returns {Object} Props that will be passed to the component.
 */
export function mapSidePanelState(state, props) {
    return {
        ...props,
    };
}


// Dispatching actions from components
// ===================================

/**
 * Receives the Redux dispatch function and returns props that will be
 * passed to the DeviceSelector component. See also the default
 * `mapDispatchToProps` in:
 * https://github.com/NordicSemiconductor/pc-nrfconnect-core/blob/master/lib/windows/app/containers/DeviceSelectorContainer.js
 *
 * @param {Function} dispatch The Redux dispatch function, which may be invoked to dispatch actions.
 * @param {Object} props The default core props
 * @returns {Object} Props that will be passed to the component.
 */
export function mapDeviceSelectorDispatch(dispatch, props) {
    return {
        ...props,
    };
}

/**
 * Receives the Redux dispatch function and returns props that will be
 * passed to the LogHeader component. See also the default
 * `mapDispatchToProps` in:
 * https://github.com/NordicSemiconductor/pc-nrfconnect-core/blob/master/lib/windows/app/containers/LogHeaderContainer.js
 *
 * @param {Function} dispatch The Redux dispatch function, which may be invoked to dispatch actions.
 * @param {Object} props The default core props
 * @returns {Object} Props that will be passed to the component.
 */
export function mapLogHeaderDispatch(dispatch, props) {
    return {
        ...props,
    };
}

/**
 * Receives the Redux dispatch function and returns props that will be
 * passed to the LogViewer component. See also the default
 * `mapDispatchToProps` in:
 * https://github.com/NordicSemiconductor/pc-nrfconnect-core/blob/master/lib/windows/app/containers/LogViewerContainer.js
 *
 * @param {Function} dispatch The Redux dispatch function, which may be invoked to dispatch actions.
 * @param {Object} props The default core props
 * @returns {Object} Props that will be passed to the component.
 */
export function mapLogViewerDispatch(dispatch, props) {
    return {
        ...props,
    };
}

/**
 * Receives the Redux dispatch function and returns props that will be
 * passed to the MainView component. See also the default
 * `mapDispatchToProps` in:
 * https://github.com/NordicSemiconductor/pc-nrfconnect-core/blob/master/lib/windows/app/containers/MainViewContainer.js
 *
 * @param {Function} dispatch The Redux dispatch function, which may be invoked to dispatch actions.
 * @param {Object} props The default core props
 * @returns {Object} Props that will be passed to the component.
 */
export function mapMainViewDispatch(dispatch, props) {
    return {
        ...props,
    };
}

/**
 * Receives the Redux dispatch function and returns props that will be
 * passed to the NavMenu component. See also the default
 * `mapDispatchToProps` in:
 * https://github.com/NordicSemiconductor/pc-nrfconnect-core/blob/master/lib/windows/app/containers/NavMenuContainer.js
 *
 * @param {Function} dispatch The Redux dispatch function, which may be invoked to dispatch actions.
 * @param {Object} props The default core props
 * @returns {Object} Props that will be passed to the component.
 */
export function mapNavMenuDispatch(dispatch, props) {
    return {
        ...props,
    };
}

/**
 * Receives the Redux dispatch function and returns props that will be
 * passed to the SidePanel component. See also the default
 * `mapDispatchToProps` in:
 * https://github.com/NordicSemiconductor/pc-nrfconnect-core/blob/master/lib/windows/app/containers/NavMenuContainer.js
 *
 * @param {Function} dispatch The Redux dispatch function, which may be invoked to dispatch actions.
 * @param {Object} props The default core props
 * @returns {Object} Props that will be passed to the component.
 */
export function mapSidePanelDispatch(dispatch, props) {
    return {
        ...props,
    };
}


// Adding information to state
// ===========================

/**
 * Redux reducer for the app. Receives the current state object and an
 * action, and returns a new state.
 *
 * @param {Object} state The Redux state object.
 * @param {Object} action A Redux action object.
 * @returns {Object} A new Redux state object.
 */
export const reduceApp = combineReducers({ courseReducer });

// export function reduceApp(state = (new Record({})), action) {
//     return courseReducer(state, action);
// }


// Intercepting actions with middleware
// ====================================

/**
 * A custom Redux middleware that can intercept any action. The
 * middleware is invoked after an action has been dispatched, but before
 * it reaches the reducers. See https://redux.js.org/advanced/middleware.
 *
 * This is useful e.g. when the app wants to perform some asynchronous
 * operation when a core action is dispatched. To see which core actions
 * may be intercepted, see:
 * https://github.com/NordicSemiconductor/pc-nrfconnect-core/tree/master/lib/windows/app/actions
 *
 * Note that the Redux store has a `dispatch` function for dispatching
 * actions, and a `getState` function for getting the state object.
 *
 * @param {Object} store The Redux store.
 * @returns {Function} The Redux middleware implementation.
 */
export function middleware(store) {
    return next => action => {
        next(action);
    };
}
