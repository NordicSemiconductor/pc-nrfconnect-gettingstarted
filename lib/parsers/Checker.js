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

import ChildProcess from 'child_process';
import { logger } from 'nrfconnect/core';
import { stat } from './fs-promises';
import AbstractParser from './AbstractParser';

function replaceVariables(targetArray) {
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
     * @return {Promise<Boolean>} Whether the check from this checker passes or not.
     */
    // eslint-disable-next-line class-methods-use-this
    run() {}
}

class CommandChecker extends AbstractChecker {
    constructor(json) {
        super(json);
        this.commands = (this.commands instanceof Array) ?
            this.commands : [this.commands];
    }
    run() {
        if (!this.enabled) {
            return Promise.resolve(true);
        }

        // Spawn a child process, and then wait for its 'close' event
        // The promise will resolve if the call exits with status code 0
        // The promise will reject if the call exits with any other status
        return replaceVariables(this.commands)
            .map(command => new Promise((resolve, reject) => {
                const outputs = {
                    error: [],
                    stderr: [],
                    stdout: [],
                };

                const child = ChildProcess.exec(command,
                    {},
                    (error, stdout, stderr) => {
                        if (error) {
                            outputs.error.push(error);
                        }
                        if (stderr) {
                            logger.error(stderr.trim());
                            outputs.stderr.push(stderr);
                        }
                        if (stdout) {
                            outputs.stdout.push(stdout);
                        }
                    });

                child.on('close', exitCode => {
                    if (exitCode !== 0) {
                        reject({ command, exitCode, outputs });
                    } else {
                        resolve({ command, exitCode, outputs });
                    }
                });
            }),
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
        this.filenames = (this.filenames instanceof Array) ?
            this.filenames : [this.filenames];
    }

    run() {
        if (!this.enabled) {
            return Promise.resolve(true);
        }

        // Just delegate to the 'sander' library - it will return a Promise as
        // expected here
        return replaceVariables(this.filenames)
            .map(filename => stat(filename)
            .then(
                stats => Promise.resolve({
                    command: `Check for file or folder: ${filename}`,
                    exitCode: 0,
                    outputs: {
                        error: [],
                        stdout: [JSON.stringify(stats)],
                        stderr: [],
                    },
                }),
                error => Promise.reject({
                    command: `Check for file or folder: ${filename}`,
                    exitCode: 1,
                    outputs: {
                        error: [error.message],
                        stdout: [],
                        stderr: [error.message],
                    },
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
 * @return {Object} The created Checker
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
    } else if (json.checkerType === 'fileExists') {
        return new FileExistsChecker(json, id);
    }

    throw new Error(`"checkerType" field in Checker JSON must be either "command" or "fileExists". Received: ${json.checkerType}`);
}
