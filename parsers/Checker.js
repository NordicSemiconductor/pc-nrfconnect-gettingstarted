/* eslint no-underscore-dangle: "off" */


import ChildProcess from 'child_process';
import { stat } from './fs-promises';
import appliesToRunningPlatform from './platform-check';


class AbstractChecker {
    constructor(json) {
        this._platforms = json.platforms ? json.platforms : 'all';
        this._osreleases = json.osReleases ? json.osReleases : 'all';
        this._enabled = appliesToRunningPlatform(this._platforms, this._osreleases);
    }

    /**
     * Runs the check for this checker.
     * @return {Promise<Boolean>} Whether the check from this checker passes or not.
     */
    // eslint-disable-next-line class-methods-use-this
    run() {}

    /**
     * Returns a JSON serialization of the current checker
     * @return {Object} The JSON serialization of the current checker
     */
    // eslint-disable-next-line class-methods-use-this
    asJson() {}

    get enabled() {
        return this._enabled;
    }
}


class CommandChecker extends AbstractChecker {
    constructor(json) {
        super(json);
        this._command = json.command;
    }

    run() {
        if (!this.enabled) { return Promise.resolve(true); }

        // Spawn a child process, and then wait for its 'close' event

        // / TODO: provide some way of fetching the child's output, for
        // / logging purposes. Maybe two callbacks passed to run() ???
        return new Promise((resolve, reject) => {
            const cp = ChildProcess.exec(this._command);

            cp.on('close', exitCode => {
                if (exitCode) {
                    reject(exitCode);
                } else {
                    resolve();
                }
            });
        });
    }

    asJson() {
        return {
            type: 'Checker',
            checkerType: 'command',
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

    asJson() {
        return {
            type: 'Checker',
            checkerType: 'fileExists',
            filenames: this._filenames,
        };
    }

}


export default function checkerFactory(json) {
    if (json.type !== 'Checker') {
        if (json.type !== 'Checkable') {
            // Inspired by GeoJSON, a checker must have a "type": "Checker" field
            throw new Error('"type" field in JSON is not "Checker".');
        }
    }

    if (json.checkerType === 'command') {
        return new CommandChecker(json);
    } else if (json.checkerType === 'fileExists') {
        return new FileExistsChecker(json);
    }
    throw new Error('"checkerType" field in Checker JSON must be either "command" or "fileExists".');
}

