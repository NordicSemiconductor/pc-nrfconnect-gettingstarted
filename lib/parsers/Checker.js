/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { logger } from 'nrfconnect/core';
import execute from './execute';
import { stat } from './fs-promises';
import AbstractParser from './AbstractParser';


class AbstractChecker extends AbstractParser {
    constructor(json, id) {
        super(json, 'Checker', id, [
            'checkerType',
            { name: 'commands', optional: true },
            { name: 'filenames', optional: true },
        ]);
    }

    /**
     * Runs the check for this checker.
     * @returns {Promise<Boolean>} Whether the check from this checker passes or not.
     */
    run() {} // eslint-disable-line class-methods-use-this
}

class CommandChecker extends AbstractChecker {
    constructor(json) {
        super(json);
        this.commands = (this.commands instanceof Array)
            ? this.commands : [this.commands];
    }

    run() {
        if (!this.enabled) {
            return Promise.resolve(true);
        }
        return execute(
            AbstractParser.replaceVariables(this.commands),
            AbstractParser.getVariables(),
        );
    }

    serialize() {
        return {
            checkerType: this.checkerType,
            command: this.command,
        };
    }
}

class FileExistsChecker extends AbstractChecker {
    constructor(json) {
        super(json);
        this.filenames = (this.filenames instanceof Array)
            ? this.filenames : [this.filenames];
    }

    run() {
        if (!this.enabled) {
            return Promise.resolve(true);
        }

        const filenames = AbstractParser.replaceVariables(this.filenames);
        return Promise.all(
            filenames.map(
                filename => stat(filename)
                    .then(() => {
                        logger.debug(`${filename} exists`);
                        return Promise.resolve();
                    })
                    .catch(error => {
                        logger.error(`${filename} missing`);
                        throw new Error(error);
                    }),
            ),
        );
    }

    serialize() {
        return {
            checkerType: this.checkerType,
            filenames: this.filenames,
        };
    }
}

/**
 * Factory function that creates the correct Checker.
 * @param {Object} json The data defining the parser
 * @param {Number} id The index in the array
 * @returns {Object} The created Checker
 */
export default function checkerFactory(json, id) {
    if (json.type !== 'Checker') {
        if (json.type !== 'Checkable') {
            // Inspired by GeoJSON, a checker must have a "type": "Checker" field
            throw new Error('"type" field in JSON is not "Checker".');
        }
    }

    if (json.checkerType === 'command') {
        return new CommandChecker(json, id);
    }
    if (json.checkerType === 'fileExists') {
        return new FileExistsChecker(json, id);
    }

    throw new Error(`"checkerType" field in Checker JSON must be either "command" or "fileExists". Received: ${json.checkerType}`);
}
