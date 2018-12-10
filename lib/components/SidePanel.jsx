/* Copyright (c) 2015, Nordic Semiconductor ASA
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

import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, Glyphicon, Panel } from 'react-bootstrap';

function getVariableKind(name) {
    if (/(root|path|dir|directory|ChocolateyInstall)$/i.test(name)) {
        return { kind: 'openDirectory', icon: 'folder-open' };
    } else if (/file$/i.test(name)) {
        return { kind: 'openFile', icon: 'file' };
    }
    return { kind: null, icon: null };
}

const VariableAction = ({ name, value, kind, setVariable, setVariableOpenDialog }) => {
    if (kind) {
        return (
            <FormControl
                componentClass="button"
                onClick={() => setVariableOpenDialog(name, value, kind)}
            >
                { value }
            </FormControl>
        );
    }
    return (
        <FormControl
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
        <Panel header="Variables">
            {
                Object.keys(variables)
                .map(name => ({ name, value: variables[name], ...getVariableKind(name) }))
                .map(({ name, value, kind, icon }) => (
                    <div key={name} className={`variable ${value !== undefined ? 'set' : ''}`}>
                        <span className="variable-name">
                            { icon && <Glyphicon glyph={icon} /> }
                            { name }
                        </span>
                        <VariableAction name={name} value={value} kind={kind} {...rest} />
                    </div>
                ))
            }
        </Panel>
    </div>
);

SidePanel.propTypes = {
    variables: PropTypes.shape({}).isRequired,
    hidden: PropTypes.bool.isRequired,
};

export default SidePanel;
