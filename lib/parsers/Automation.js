/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import execute from './execute';
import AbstractParser from './AbstractParser';

export default class Automation extends AbstractParser {
    constructor(json, id) {
        super(json, 'Automation', id, [
            { name: 'commands', optional: true },
        ]);
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
