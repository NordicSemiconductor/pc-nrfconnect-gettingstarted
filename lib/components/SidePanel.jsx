/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

function getVariableKind(name) {
    if (/(root|path|dir|directory|ChocolateyInstall)$/i.test(name)) {
        return { kind: 'openDirectory', icon: 'folder-open' };
    }
    if (/file$/i.test(name)) {
        return { kind: 'openFile', icon: 'file' };
    }
    return { kind: null, icon: null };
}

const VariableAction = ({
    name, value, kind, setVariable, setVariableOpenDialog,
}) => {
    if (kind) {
        return (
            <Form.Control
                as="button"
                onClick={() => setVariableOpenDialog(name, value, kind)}
            >
                { value }
            </Form.Control>
        );
    }
    return (
        <Form.Control
            type="text"
            value={value}
            onChange={event => setVariable(name, event.target.value)}
        />
    );
};

VariableAction.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    kind: PropTypes.string,
    setVariable: PropTypes.func.isRequired,
    setVariableOpenDialog: PropTypes.func.isRequired,
};

VariableAction.defaultProps = {
    value: '',
    kind: null,
};

const SidePanel = ({ variables, hidden, ...rest }) => (
    <div className={`core-side-panel ${hidden ? 'hidden' : ''}`}>
        <Card header="Variables">
            <Card.Header>Variables</Card.Header>
            <Card.Body style={{ fontSize: '14px' }}>
                {
                    Object.keys(variables)
                        .map(name => ({
                            name, value: variables[name], ...getVariableKind(name),
                        }))
                        .map(({
                            name, value, kind, icon,
                        }) => (
                            <div key={name} className={`variable ${value !== undefined ? 'set' : ''}`}>
                                <span className="variable-name">
                                    { icon && <span className={`mdi mdi-${icon}`} /> }
                                    { name }
                                </span>
                                <VariableAction name={name} value={value} kind={kind} {...rest} />
                            </div>
                        ))
                }
            </Card.Body>
        </Card>
    </div>
);

SidePanel.propTypes = {
    variables: PropTypes.shape({}).isRequired,
    hidden: PropTypes.bool.isRequired,
};

export default SidePanel;
