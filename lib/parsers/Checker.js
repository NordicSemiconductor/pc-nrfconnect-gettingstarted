/* eslint no-underscore-dangle: "off" */
/* eslint comma-dangle: "off" */


import ChildProcess from 'child_process';
import { stat } from './fs-promises';
import AbstractParser from './AbstractParser';

class AbstractChecker extends AbstractParser {
    constructor(json, id) {
        super(json, 'Checker', id, ['checkerType', { name: 'commands', optional: true }, { name: 'filenames', optional: true }]);
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
        this._commands = (this._commands instanceof Array) ?
            this._commands : [this._commands];
    }
    run() {
        if (!this.enabled) {
            return Promise.resolve(true);
        }

        // Spawn a child process, and then wait for its 'close' event
        // The promise will resolve if the call exits with status code 0
        // The promise will reject if the call exits with any other status
        return this._commands
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
            })
        );
    }

    serialize() {
        return {
            checkerType: this._checkerType,
            command: this._command,
        };
    }

}

class FileExistsChecker extends AbstractChecker {
    constructor(json) {
        super(json);
        this._filenames = (this._filenames instanceof Array) ?
            this._filenames : [this._filenames];
    }

    run() {
        if (!this.enabled) {
            return Promise.resolve(true);
        }

        // Just delegate to the 'sander' library - it will return a Promise as
        // expected here
        return this._filenames.map(filename => stat(filename)
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
                })
            )
        );
    }

    serialize() {
        return {
            checkerType: this._checkerType,
            filenames: this._filenames,
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

