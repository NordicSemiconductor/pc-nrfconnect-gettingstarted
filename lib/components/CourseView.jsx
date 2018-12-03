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

import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Col, Row, Nav, NavItem } from 'react-bootstrap';
import RecipeView from './RecipeView';
import DescriptionView from './DescriptionView';
import { CheckableState } from '../actions/courseActions';

const recipeState = recipeCheckables => {
    if (recipeCheckables.every(item => item === CheckableState.DONE)) {
        return 'marked';
    } else if (recipeCheckables.every(item => item === CheckableState.NOT_DONE)) {
        return 'unmarked';
    }
    return 'in-progress';
};

const { Container, Content, Pane } = Tab;
const CourseView = ({ description, recipes, checkables }) => (
    <Container id="course-view" className="course-view" defaultActiveKey={0}>
        <Row className="clearfix">
            <Col sm={3}>
                <Nav bsStyle="pills" stacked>
                    <NavItem eventKey={0}>
                        <i className="recipe-number">{ 1 }</i>
                        Overview
                    </NavItem>
                    {
                        recipes.map(({ title, tool }, index) => (
                            <NavItem
                                eventKey={index + 1}
                                key={`${index + 1}`}
                                className={`${recipeState(checkables[tool])}`}
                            >
                                <i className="recipe-number">{ index + 2 }</i>
                                { title }
                            </NavItem>
                        ))
                    }
                </Nav>
            </Col>
            <Col sm={9}>
                <Content animation={false}>
                    <Pane eventKey={0} className="course-pane">
                        <h3>Overview</h3>
                        <DescriptionView description={description} />
                    </Pane>
                    {
                        recipes.map((recipe, index) => (
                            <Pane
                                eventKey={index + 1}
                                key={`${index + 1}`}
                                className={`recipe-pane ${recipeState(checkables[recipe.tool])}`}
                            >
                                <h3>{ recipe.title }</h3>
                                <RecipeView {...recipe} />
                            </Pane>
                        ))
                    }
                </Content>
            </Col>
        </Row>
    </Container>
);

CourseView.propTypes = {
    recipes: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    checkables: PropTypes.shape({}).isRequired,
    description: PropTypes.string.isRequired,
};

export default CourseView;
