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

/* eslint no-debugger: "off" */
/* eslint comma-dangle: "off" */


import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Actions from '../actions/courseActions';

function getNextState(isManual, currentState) {
    if (isManual) {
        if (currentState === Actions.notDone) {
            return Actions.done;
        }

        return Actions.notDone;
    }

    if (currentState === Actions.done) {
        return Actions.inProgress;
    }

    if (currentState === Actions.inProgress) {
        return Actions.done;
    }

    return Actions.inProgress;
}

function InnerButton(props) {
    const { status, label, changeFunction } = props;

    return (
        <span>
            {status}
            <button onClick={changeFunction}>
                {label}
            </button>
        </span>
    );
}

InnerButton.defaultProps = {
    status: '',
};

InnerButton.propTypes = {
    status: PropTypes.string,
    label: PropTypes.string.isRequired,
    changeFunction: PropTypes.func.isRequired,
};

function extractInformation(isManual, currentState) {
    const status = currentState === Actions.done ? 'Done' : '';
    let label = '';

    if (isManual) {
        if (currentState === Actions.notDone) {
            label = 'Manually mark as done';
        } else {
            label = 'Manually mark as not done';
        }
    } else if (currentState === Actions.notDone ||
            currentState === Actions.done) {
        label = 'Run checkers';
    } else {
        label = 'Checkers are running';
    }

    return {
        label,
        status,
    };
}

function CheckableButton(props) {
    const {
        currentState,
        isManual,
        setStatus,
        tool,
        id,
        nextState,
        runFunctions,
    } = props;

    const {
        label,
        status,
    } = extractInformation(isManual, currentState);

    if (currentState === Actions.inProgress) {
        runFunctions().then(
            () => setStatus(tool, id, Actions.done),
            ({ command, exitCode, outputs }) => {
                console.log(`The call to '${command}' exited with exit code ${exitCode}.`);
                console.log(`Output: ${outputs.stderr.join('\r\n')}`);
                setStatus(tool, id, Actions.notDone);
            }
        );
    }

    return (
        <InnerButton
            changeFunction={() => setStatus(tool, id, nextState)}
            label={label}
            status={status}
        />
    );
}

CheckableButton.defaultProps = {
    runFunctions: () => Promise.resolve(),
};

CheckableButton.propTypes = {
    currentState: PropTypes.string.isRequired,
    nextState: PropTypes.string.isRequired,
    isManual: PropTypes.bool.isRequired,
    setStatus: PropTypes.func.isRequired,
    tool: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    runFunctions: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
    currentState: state.app.courseReducer.checkables[ownProps.tool][ownProps.data.id],
});

const mapDispatchToProps = {
    setStatus: Actions.checkableChangeAction,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    nextState: getNextState(ownProps.data.isManual, stateProps.currentState),
    ...dispatchProps,
    tool: ownProps.tool,
    id: ownProps.data.id,
    isManual: ownProps.data.isManual,
    runFunctions: ownProps.runFunctions,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(CheckableButton);
