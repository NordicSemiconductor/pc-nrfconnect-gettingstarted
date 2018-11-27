/* eslint no-underscore-dangle: "off" */
/* eslint no-prototype-builtins: "off" */
/* eslint class-methods-use-this: "off" */

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

        this._id = id;
        this._type = json.type;
        this._title = '';
        this._description = '';

        properties.forEach(property => this.extractProperty(json, property));

        this._platforms = new Platform(json.platforms);
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
     * @return {void}
     */
    extractProperty(json, property) {
        const {
            name,
            propertytype,
            optional = false,
            processer,
            promise = false,
        } = getPropertyDetails(property);

        const propertyName = `_${name}${promise ? 'Promise' : ''}`;

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

        this[propertyName] = processer ? processer(json[name]) : json[name];
    }

    get id() {
        return this._id;
    }

    get type() {
        return this._type;
    }

    get title() {
        return this._title;
    }

    get description() {
        return this._description;
    }

    get enabled() {
        return this._platforms.isEnabled;
    }

    get platforms() {
        return this._platforms;
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
     * @return {Object} Serialized version of the object
     */
    asJson() {
        return Object.assign({}, {
            type: this._type,
            title: this._title,
            description: this._description,
            platforms: this._platforms.asJSON(),
        }, this.serialize());
    }

    /**
     * Abstract function that subclasses are supposed to override to
     * add their custom properties to the asJson() function.
     *
     * @throws {Error} Subclasses are supposed to override this function
     * @return {Object} Serialized version of custom properties.
     */
    serialize() {
        throw new Error('This class should never be serialized. Implement the serialize function in the subclass.');
    }
}
