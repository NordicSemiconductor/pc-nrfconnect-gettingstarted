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

/* eslint comma-dangle: "off" */

import React from 'react';
import PropTypes from 'prop-types';
import { ButtonGroup, Button } from 'react-bootstrap';
import DescriptionView from './DescriptionView';
import * as courseActions from '../actions/courseActions';

const Description = (id, desc) => (
    <DescriptionView
        className="description"
        key={id}
        description={desc}
    />
);

const Steps = data => (
    data.steps.filter(step => step.enabled)
        .map(step => Description(step.id, step.description)));

const MarkButton = (tool, id, changeState, manualButtonText) => (
    <Button
        className="checkable-button btn btn-primary btn-nordic"
        onClick={() => changeState(tool, id)}
    >
        { manualButtonText }
    </Button>
);

const CheckButton = data => (
    <Button
        className="checkable-button btn btn-nordic"
        onClick={data.runCheckers}
    >
        Check
    </Button>
);

const CheckableView = ({
    tool,
    data,
    currentState,
    changeState,
}) => {
    const manualButtonText = currentState === courseActions.done ?
        'Unmark' :
        'Mark';

    let checkableDescClassName = 'checkable-description ';
    const CheckableState = courseActions.CheckableState;
    checkableDescClassName += currentState === CheckableState.DONE ? 'marked' : '';
    checkableDescClassName += currentState === CheckableState.NOT_DONE ? 'unmarked' : '';
    checkableDescClassName += currentState === CheckableState.IN_PROGRESS ? 'progress' : '';

    return (
        <div key={`${tool}-${data.id}`} className="checkable">
            <ul className={checkableDescClassName}>{Steps(data)}</ul>
            <ButtonGroup className="checkable-button-group">
                {MarkButton(tool, data.id, changeState, manualButtonText)}
                {data.isManual && CheckButton(data)}
            </ButtonGroup>
        </div>
    );
};

CheckableView.propTypes = {
    tool: PropTypes.string.isRequired,
    data: PropTypes.shape({
        steps: PropTypes.array.isRequired,
        runCheckers: PropTypes.func.isRequired,
    }).isRequired,
    changeState: PropTypes.func.isRequired,
    currentState: PropTypes.string.isRequired,
};

export default CheckableView;
