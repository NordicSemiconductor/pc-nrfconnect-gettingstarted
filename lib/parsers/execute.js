/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import ChildProcess from 'child_process';
import { remote } from 'electron';
import { logger } from 'pc-nrfconnect-shared';

export default function execute(commands, variables) {
    const outputs = {
        error: [],
        stderr: [],
        stdout: [],
    };
    let lastExitCode = 0;

    const promiseOneCommand = command =>
        new Promise((resolve, reject) => {
            logger.debug(`Executing: ${command}`);
            ChildProcess.exec(
                command,
                {
                    maxBuffer: 1024 * 1024,
                    env: { ...remote.process.env, ...variables },
                },
                (error, stdout, stderr) => {
                    if (error) {
                        logger.debug(stderr.trim());
                        outputs.error.push(error);
                    }
                    if (stderr) {
                        logger.error(stderr.trim());
                        outputs.stderr.push(stderr);
                    }
                    if (stdout) {
                        logger.debug(stdout.trim());
                        outputs.stdout.push(stdout);
                    }
                }
            ).on('close', exitCode => {
                lastExitCode = exitCode;
                if (exitCode !== 0) {
                    reject(new Error({ command, exitCode, outputs }));
                } else {
                    resolve({ command, exitCode, outputs });
                }
            });
        });

    const sequence = (first, ...rest) =>
        first
            ? promiseOneCommand(first).then(() => sequence(...rest))
            : Promise.resolve();

    return sequence(...commands).then(() => ({ lastExitCode, outputs }));
}
