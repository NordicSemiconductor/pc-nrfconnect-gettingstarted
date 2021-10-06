/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import {
    string, node, array, oneOfType,
} from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { shell } from 'electron';

const link = ({ href, children }) => (
    <a
        href={href}
        onClick={event => {
            event.preventDefault();
            shell.openExternal(event.target.getAttribute('href'));
        }}
    >
        { children }
    </a>
);

link.propTypes = { href: string, children: node };
link.defaultProps = { href: null, children: null };

const DescriptionView = ({ description, ...rest }) => (
    <ReactMarkdown
        className="description-view"
        source={description}
        renderers={{ link }}
        {...rest}
    />
);

DescriptionView.propTypes = {
    description: oneOfType([string, array]),
};

DescriptionView.defaultProps = {
    description: '',
};

export default DescriptionView;
