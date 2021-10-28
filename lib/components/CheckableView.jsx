/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import PropTypes from 'prop-types';

import { CheckableState } from '../actions/courseActions';
import DescriptionView from './DescriptionView';

const CheckableView = ({
    tool,
    data,
    currentState,
    manualCheck,
    check,
    install,
}) => {
    const manualButtonText =
        currentState === CheckableState.DONE ? 'Mark not done' : 'Mark done';

    let checkableStateClassName = 'checkable-state';
    checkableStateClassName +=
        currentState === CheckableState.DONE ? ' marked' : '';
    checkableStateClassName +=
        currentState === CheckableState.NOT_DONE ? ' unmarked' : '';
    checkableStateClassName +=
        currentState === CheckableState.IN_PROGRESS ? ' in-progress' : '';

    return (
        <div key={`${tool}-${data.id}`} className="checkable">
            <div className={checkableStateClassName} />
            <ul className="checkable-description">
                {data.steps.map(({ id, description }) => (
                    <DescriptionView
                        className="description"
                        key={id}
                        description={description}
                    />
                ))}
            </ul>
            <ButtonGroup className="checkable-button-group">
                <Button
                    className="checkable-button btn btn-primary btn-nordic"
                    onClick={manualCheck}
                >
                    {manualButtonText}
                </Button>

                {!data.isManual && (
                    <Button
                        className="checkable-button btn btn-primary btn-nordic"
                        onClick={check}
                    >
                        Verify
                    </Button>
                )}

                {data.automation && (
                    <Button
                        className="checkable-button btn btn-primary btn-nordic"
                        onClick={install}
                    >
                        Install
                    </Button>
                )}
            </ButtonGroup>
        </div>
    );
};

CheckableView.propTypes = {
    tool: PropTypes.string.isRequired,
    data: PropTypes.shape({
        automation: PropTypes.any,
        id: PropTypes.number.isRequired,
        isManual: PropTypes.bool.isRequired,
        runCheckers: PropTypes.func.isRequired,
        steps: PropTypes.array.isRequired,
    }).isRequired,
    manualCheck: PropTypes.func.isRequired,
    currentState: PropTypes.string.isRequired,
    check: PropTypes.func.isRequired,
    install: PropTypes.func.isRequired,
};

export default CheckableView;
