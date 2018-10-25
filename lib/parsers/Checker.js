/* eslint no-underscore-dangle: "off" */


import ChildProcess from 'child_process';
import { stat } from './fs-promises';
import AbstractParser from './AbstractParser';

class AbstractChecker extends AbstractParser {
    constructor(json, id) {
        super(json, 'Checker', id, ['checkerType', { name: 'command', optional: true }, { name: 'filenames', optional: true }]);
    }

    /**
     * Runs the check for this checker.
     * @return {Promise<Boolean>} Whether the check from this checker passes or not.
     */
    // eslint-disable-next-line class-methods-use-this
    run() {}
}


class CommandChecker extends AbstractChecker {
    run() {
        if (!this.enabled) {
            return Promise.resolve(true);
        }

        // Spawn a child process, and then wait for its 'close' event
        return new Promise((resolve, reject) => {
            const child = ChildProcess.exec(this._command,
                {},
                (error, stdout, stderr) => {
                    if (error) {
                        console.log('Error', error);
                    }
                    if (stderr) {
                        console.log('stderr', stderr);
                    }
                    if (stdout) {
                        console.log('stdout', stdout);
                    }
                });

            child.on('close', exitCode => {
                if (exitCode) {
                    reject(exitCode);
                } else {
                    resolve();
                }
            });
        });
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
        this._filenames = (json.filenames instanceof Array) ?
            json.filenames : [json.filenames];
    }

    run() {
        if (!this.enabled) { return Promise.resolve(true); }

        // Just delegate to the 'sander' library - it will return a Promise as
        // expected here
        return this._filenames.map(stat);
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

