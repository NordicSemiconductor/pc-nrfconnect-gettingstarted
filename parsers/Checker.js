

import { exists } from 'sander';

import ChildProcess from 'child_process';




class AbstractChecker {
    /**
     * Runs the check for this checker.
     * @return {Promise<Boolean>} Whether the check from this checker passes or not.
     */
    run() {}

    /**
     * Returns a JSON serialization of the current checker
     * @return {Object} The JSON serialization of the current checker
     */
    asJson() {}
}




class CommandChecker extends AbstractChecker {
    constructor(json) {
        this._command = json.command;
    }

    run() {
        // Spawn a child process, and then wait for its 'close' event

        return new Promise((resolve, reject)=>{

            const cp = ChildProcess.exec(this._command);

            cp.on('close', (exitCode)=>{
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
            type:'Checker',
            checkerType: 'command',
            command: this._command
        }
    }

}


class FileExistsChecker extends AbstractChecker {
    constructor(json) {
        this._filenames = (json.filenames instanceof Array) ?
            json.filenames : [json.filenames];

    }

    run() {
        // Just delegate to the 'sander' library - it will return a Promise as
        // expected here
        return this._filenames.map(exists);
    }

    asJson() {
        return {
            type:'Checker',
            checkerType: 'fileExists',
            filenames: this._filenames
        }
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
    } else {
        throw new Error('"checkerType" field in Checker JSON must be either "command" or "fileExists".');
    }
}





