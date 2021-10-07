/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import PropTypes from 'prop-types';

import CheckableView from '../containers/checkableView';
import DescriptionView from './DescriptionView';

const RecipeView = ({ tool, id, description, checkables }) => (
    <div className="recipe-view">
        <DescriptionView key={id} description={description} />
        <br />
        {checkables.map(checkable => (
            <CheckableView
                key={`${tool}-${checkable.id}`}
                tool={tool}
                recipeID={id}
                data={checkable}
            />
        ))}
    </div>
);

RecipeView.propTypes = {
    tool: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    checkables: PropTypes.arrayOf(
        PropTypes.shape({
            checkers: PropTypes.array,
            steps: PropTypes.array.isRequired,
        })
    ).isRequired,
};

export default RecipeView;
