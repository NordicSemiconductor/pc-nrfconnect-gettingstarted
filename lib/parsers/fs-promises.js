/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

// Ideally, these promise-based filesystem operations should be handled by
// some module like 'sander' or 'fs-extra'. Unfortunately using an external
// module causes problems when running the build application outside of
// a development environment.
//
// Please note that such modules handle some edge cases and race conditions,
// and this naïve implementation doesn't.


import fs from 'fs';

export function readFile(filename, options) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, options, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

export function stat(filename) {
    return new Promise((resolve, reject) => {
        fs.stat(filename, (err, stats) => {
            if (err) {
                reject(err);
            } else {
                resolve(stats);
            }
        });
    });
}
