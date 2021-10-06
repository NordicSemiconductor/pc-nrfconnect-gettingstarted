/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

/* eslint no-prototype-builtins: "off" */
/* eslint class-methods-use-this: "off" */

import { logger } from 'nrfconnect/core';
import Platform from './Platform';

function getPropertyDetails(property) {
    if (property instanceof Object) {
        return property;
    }

    return { name: property };
}

/**
 * The AbstractParser is the super class for most of the different parsers.
 *
 * @param {Object} json The json data to be parsed
 * @param {String} type The type of parser this is
 * @param {number} id The order within in array
 * @param {array} properties An array descrining the different properties to extract
 */
export default class AbstractParser {
    constructor(json, type, id, properties) {
        // Sanity checks
        if (!json || !(json instanceof Object)) {
            throw new Error('No JSON specified for Course constructor.');
        }

        // Inspired by GeoJSON, a course must have a "type": field
        // specifying the correct type of parser
        if (json.type !== type) {
            throw new Error(`"type" field in JSON is not ${type}.`);
        }

        this.id = id;
        this.type = json.type;
        this.title = '';
        this.description = '';
        this.variables = {};

        this.platforms = new Platform(json.platforms);

        if (this.enabled) {
            properties.forEach(property => this.extractProperty(json, property));
        }
    }

    static replaceVariables(targetArray) {
        const { variables } = AbstractParser.getState().app;
        return targetArray.map(item => {
            let result = item;
            const regex = /<(?:([^:\s]+)(?::(.*?))?)>/;
            let match;
            do {
                match = regex.exec(result);
                if (match !== null) {
                    if (match.index === regex.lastIndex) {
                        regex.lastIndex += 1;
                    }
                    const [full, variable, defaultValue] = match;
                    if (variables[variable]) {
                        result = result.replace(full, variables[variable]);
                    } else if (defaultValue) {
                        result = result.replace(full, defaultValue);
                        logger.info(`Variable ${variable} is set to default value: ${defaultValue}`);
                    } else {
                        logger.error(`Variable ${variable} is not set`);
                        break;
                    }
                }
            } while (match);
            return result;
        });
    }

    static getVariables() {
        const { variables } = AbstractParser.getState().app;
        return variables;
    }

    /**
     * Helperfunction that extracts the properties from the json.
     * Properties can be optional, of a specified type, promises, and
     * be processed.
     *
     * All properties are added to the object with the name _propertyname. If
     * the property is a promise, Promise will be appended to the name.
     *
     * @param {Object} json The object to extract the properties from
     * @param {Object|String} property Information about the property
     * @returns {void}
     */
    extractProperty(json, property) {
        const {
            name,
            propertytype,
            optional = false,
            processer,
            promise = false,
        } = getPropertyDetails(property);

        const propertyName = `${name}${promise ? 'Promise' : ''}`;

        if (!(Object(json).hasOwnProperty(name))) {
            if (!optional) {
                throw new Error(`The required field "${name}" is missing.`);
            } else {
                this[propertyName] = undefined;
                return;
            }
        }

        if (propertytype !== undefined) {
            if (!(json[name] instanceof propertytype)) {
                throw new Error(`"${name}" field in JSON is not ${propertytype}.`);
            }
        }

        if (processer) {
            this[propertyName] = processer(json[name]);
        } else {
            this[propertyName] = json[name];
        }
        if (this[propertyName] instanceof Array) {
            this[propertyName].forEach(item => this.extractVariables(item));
        } else {
            this.extractVariables(this[propertyName]);
        }
    }

    extractVariables(item) {
        const regex = /<(?:([^:\s]+)(?::(.*?))?)>/g;
        let match;
        do {
            match = regex.exec(item);
            if (match !== null) {
                if (match.index === regex.lastIndex) {
                    regex.lastIndex += 1;
                }
                const [, variable, defaultValue] = match;
                this.variables[variable] = this.variables[variable] || defaultValue;
            }
        } while (match);
    }

    parseVariablesFrom(elements) {
        (elements || []).forEach(element => {
            Object.keys(element.variables).forEach(key => {
                this.variables[key] = this.variables[key] || element.variables[key];
            });
        });
    }

    get enabled() {
        return this.platforms.enabled;
    }

    /**
     * Utilized by subclasses to process description arrays.
     * Will also accept a pure string and a single object.
     *
     * @param {*} description The data to be processed.
     * @param {*} joiner Separator between lines
     * @returns {String} Markdown compatible string
     */
    static processDescriptionArray(description, joiner = '\n\n') {
        const descriptionArray = (description instanceof Array) ? description : [description];


        const process = item => {
            if (typeof item === 'string') {
                return item;
            }

            if (!item.hasOwnProperty('type')) {
                return 'Error in format. Item does not have propery type.';
            }

            if (item.type === 'commands') {
                const itemDescription = AbstractParser.processDescriptionArray(item.description, '\n');
                return [
                    '```',
                    itemDescription,
                    '```',
                ];
            }

            return 'Error in format. Unknown type';
        };

        const processedDescription = descriptionArray
            .map(item => process(item))
            .reduce((acc, val) => acc.concat(val), [])
            .join(joiner);

        return processedDescription;
    }

    /**
     * Creates an object that can be serialzied.
     * @returns {Object} Serialized version of the object
     */
    asJson() {
        return Object.assign({}, {
            type: this.type,
            title: this.title,
            description: this.description,
            platforms: this.platforms.asJSON(),
        }, this.serialize());
    }

    /**
     * Abstract function that subclasses are supposed to override to
     * add their custom properties to the asJson() function.
     *
     * @throws {Error} Subclasses are supposed to override this function
     * @returns {Object} Serialized version of custom properties.
     */
    serialize() {
        throw new Error('This class should never be serialized. Implement the serialize function in the subclass.');
    }
}
