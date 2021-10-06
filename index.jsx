/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { ipcRenderer } from 'electron';
import { join } from 'path';

import { loadCourseAction } from './lib/actions/courseActions';
import CourseView from './lib/containers/courseView';
import SidePanel from './lib/containers/sidePanel';
import AbstractParser from './lib/parsers/AbstractParser';
import appReducer from './lib/reducers';

import './resources/css/index.scss';

/* eslint-disable react/prop-types */

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
// https://nordicsemiconductor.github.io/pc-nrfconnect-docs/api_reference

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
    deviceSetup: {},
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
    // TODO: remove this hack when checkers are properly called via actions
    AbstractParser.getState = getState;
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
export function onReady(dispatch) {
    // TODO: Do not hardcode the course path.
    // IPC stuff to fetch the path of the currently running code (not
    // remote.app.getAppPath(), which is the path of the core code)
    ipcRenderer.once('app-details', (sender, details) => {
        dispatch(
            loadCourseAction(
                join(details.path, 'resources/data/course-zephyr.json')
            )
        );
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
export function decorateDeviceSelector() {
    return () => null;
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
    return ({ course, checkables }) => (
        <MainView>
            {!course && 'No course loaded'}
            {course && (
                <CourseView
                    title={course.title}
                    description={course.description}
                    recipes={course.recipes}
                    checkables={checkables}
                />
            )}
        </MainView>
    );
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
    return props => <NavBar {...props} />;
}

/**
 * Decorates the core NavMenu component, which is the navigation menu
 * that is rendered in the NavBar. See:
 * https://github.com/NordicSemiconductor/pc-nrfconnect-core/blob/master/lib/components/NavMenu.jsx
 *
 * @param {Function} NavMenu The core NavMenu component.
 * @returns {Function} A new React component.
 */
export function decorateNavMenu() {
    return ({ title }) => <h4>{title}</h4>;
}

/**
 * Decorates the core SidePanel component, which is the empty area
 * rendered to the right of the app. See:
 * https://github.com/NordicSemiconductor/pc-nrfconnect-core/blob/master/lib/windows/app/components/SidePanel.jsx
 *
 * @param {Function} SidePanel The core SidePanel component.
 * @returns {Function} A new React component.
 */
export function decorateSidePanel() {
    return props => <SidePanel {...props} />;
}

// Passing information from state to components
// ============================================

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
        course: state.app.course,
        checkables: state.app.checkables,
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
export function mapNavMenuState(state) {
    return {
        title: state.app.course.title,
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
export const reduceApp = appReducer;
