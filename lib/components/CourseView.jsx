/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import PropTypes from 'prop-types';

import Alert from 'react-bootstrap/Alert';
import Tab from 'react-bootstrap/Tab';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import RecipeView from './RecipeView';
import DescriptionView from './DescriptionView';
import { CheckableState } from '../actions/courseActions';

const recipeState = recipeCheckables => {
    if (recipeCheckables.every(item => item === CheckableState.DONE)) {
        return 'marked';
    }
    if (recipeCheckables.every(item => item === CheckableState.NOT_DONE)) {
        return 'unmarked';
    }
    return 'in-progress';
};

const btnClassName = 'checkable-button btn btn-primary btn-nordic';
const deprecated = process.platform === 'win32' || process.platform === 'darwin';

const DeprecationWarning = () => (deprecated ? (
    <Alert variant="warning" className="description-view mb-3">
        <Alert.Heading className="mb-3">Deprecation warning</Alert.Heading>
        <p>
            For nRF Connect SDK v1.2.0 (and later), this app has been replaced by the
            Toolchain Manager app. Go to the app overview to install and open
            the <b>Toolchain Manager</b>.
        </p>
        <p className="mb-0">
            The Toolchain Manager is available for Windows and Mac operating systems and installs
            the full toolchain that you need to work with the nRF Connect SDK, including
            SEGGER Embedded Studio and the nRF Connect SDK source code.
        </p>
    </Alert>
) : null);

const CourseView = ({
    description, recipes, checkables, checkAll,
}) => (
    <div className="course-view">
        <Tab.Container
            id="course-view"
            defaultActiveKey={0}
            transition={false}
        >
            <Row className="clearfix">
                <Col sm={3}>
                    <Nav variant="pills" className="flex-column" as="ul">
                        <Nav.Item as="li">
                            <Nav.Link eventKey={0}>
                                <i className="recipe-number"><span className="mdi mdi-star" /></i>
                                <span className="recipe-title">Overview</span>
                            </Nav.Link>
                        </Nav.Item>
                        {
                            recipes.map(({ title, tool }, index) => (
                                <Nav.Item
                                    as="li"
                                    key={`${index + 1}`}
                                    className={`${recipeState(checkables[tool])}`}
                                >
                                    <Nav.Link eventKey={index + 1}>
                                        <i className="recipe-number">{ index + 1 }</i>
                                        <span className="recipe-title">{ title }</span>
                                    </Nav.Link>
                                </Nav.Item>
                            ))
                        }
                    </Nav>
                </Col>
                <Col sm={9}>
                    <Tab.Content>
                        { deprecated && (<div className="deprecated-watermark" />)}
                        <Tab.Pane eventKey={0} className="course-pane">
                            <h3>Overview</h3>
                            <DeprecationWarning />
                            <DescriptionView description={description} />
                        </Tab.Pane>
                        {
                            recipes.map((recipe, index) => (
                                <Tab.Pane
                                    eventKey={index + 1}
                                    key={`${index + 1}`}
                                    className={`recipe-pane ${recipeState(checkables[recipe.tool])}`}
                                >
                                    <div className="course-title">
                                        <h3>{ recipe.title }</h3>
                                        {(recipe.checkables.find(
                                            ({ checkers }) => !!checkers,
                                        ) !== undefined) && (
                                            <ButtonGroup className="checkable-button-group">
                                                <Button
                                                    className={btnClassName}
                                                    onClick={() => checkAll(recipe)}
                                                >
                                                    Verify all
                                                </Button>
                                            </ButtonGroup>
                                        )}
                                    </div>
                                    <RecipeView {...recipe} />
                                </Tab.Pane>
                            ))
                        }
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    </div>
);

CourseView.propTypes = {
    recipes: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    checkables: PropTypes.shape({}).isRequired,
    description: PropTypes.string.isRequired,
    checkAll: PropTypes.func.isRequired,
};

export default CourseView;
