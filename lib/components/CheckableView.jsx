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
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import DescriptionView from './DescriptionView';
import { CheckableState } from '../actions/courseActions';

const CheckableView = ({
    tool,
    data,
    currentState,
    manualCheck,
    check,
    install,
}) => {
    const manualButtonText = currentState === CheckableState.DONE
        ? 'Mark not done'
        : 'Mark done';

    let checkableStateClassName = 'checkable-state';
    checkableStateClassName += currentState === CheckableState.DONE ? ' marked' : '';
    checkableStateClassName += currentState === CheckableState.NOT_DONE ? ' unmarked' : '';
    checkableStateClassName += currentState === CheckableState.IN_PROGRESS ? ' in-progress' : '';

    return (
        <div key={`${tool}-${data.id}`} className="checkable">
            <div className={checkableStateClassName} />
            <ul className="checkable-description">
                {
                    data.steps.filter(step => step.enabled)
                        .map(({ id, description }) => (
                            <DescriptionView
                                className="description"
                                key={id}
                                description={description}
                            />
                        ))
                }
            </ul>
            <ButtonGroup className="checkable-button-group">
                <Button
                    className="checkable-button btn btn-primary btn-nordic"
                    onClick={manualCheck}
                >
                    { manualButtonText }
                </Button>

                { !data.isManual && (
                    <Button
                        className="checkable-button btn btn-primary btn-nordic"
                        onClick={check}
                    >
                        Verify
                    </Button>
                )}

                { data.automation && (
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
