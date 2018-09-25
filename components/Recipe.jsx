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

/* This uses `dangerouslySetInnerHTML` + the 'marked' JS library to put the
   markdown strings into the document. The "cleaner" option, 'react-markdown',
   has a parser that misbehaves on quote blocks plus whitespace. */
/* eslint react/no-danger: "off" */

import marked from 'marked-it-core';
import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'react-bootstrap';
import { connect } from 'react-redux';

import { checkableChange } from '../actions/courseActions';

function markup(md) {
    return { __html: marked.generate(md).html.text };
}

function Recipe(props) {
// class Recipe extends React.Component {
//     render() {
    const { recipe, checkables } = props;

    return (<div>
        <p dangerouslySetInnerHTML={markup(recipe.description)} /><br />
        {
                recipe.checkables.map(checkable => {
                    const steps = checkable.steps.filter(step => step.enabled).map(step => (
                        <li key={step.id} dangerouslySetInnerHTML={markup(step.description)} />),
                    );

//                     console.log('Checkbox number ', j, ' state shall be ', checkables[j]);

                    return (
                        <div key={`${recipe.tool}-${checkable.id}`} >
                            <Checkbox
                                key={checkable.id}
                                style={{
                                    float: 'left',
                                    marginTop: 0,
                                }}
                                onChange={ev => {
                                    props.onCheckboxChange(
                                        recipe.tool,
                                        checkable.id,
                                        ev.target.checked,
                                    );
                                }
                                }
                                checked={checkables[checkable.id]}
                            >&nbsp;</Checkbox>
                            <ul>{steps}</ul>
                        </div>
                    );
                })
            }
    </div>
    );
}
// }

Recipe.propTypes = {
    recipe: PropTypes.shape({}).isRequired,
    checkables: PropTypes.arrayOf(PropTypes.bool.isRequired).isRequired,

    // Apparently eslint doesn't realise that `onCheckboxChange` is called
    // inside an event handler, so the next line is commented out.
    // onCheckboxChange: PropTypes.function.isRequired,
};

export default connect(
    state => state,
    dispatch => ({
        onCheckboxChange: (tool, checkableIndex, isDone) => {
            checkableChange(tool, checkableIndex, isDone)(dispatch);
        },
    }),
)(Recipe);
