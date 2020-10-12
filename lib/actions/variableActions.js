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

import { remote } from 'electron';
import persistentStore from '../persistentStore';

export const SET_VARIABLE = 'SET_VARIABLE';

function setVariableAction(name, value) {
    return {
        type: SET_VARIABLE,
        name,
        value,
    };
}

export function setVariable(name, value, save = true) {
    return dispatch => {
        if (save) {
            const savedVariables = persistentStore.get('variables', {});
            savedVariables[name] = value;
            persistentStore.set('variables', savedVariables);
        }
        dispatch(setVariableAction(name, value));
    };
}

async function showOpenDialog(defaultPath, type) {
    const { filePaths: [filename] } = await remote.dialog.showOpenDialog({
        defaultPath,
        properties: [type],
    });
    return filename;
}

export function setVariableOpenDialog(name, value, type) {
    return async (dispatch) => {
        const filename = await showOpenDialog(value, type);
        console.log("filename", filename)
        if (filename) {
            dispatch(setVariable(name, filename));
        }
    };
}

export function loadVariables(course) {
    return dispatch => {
        const savedVariables = persistentStore.get('variables', {});
        const { env } = remote.process;
        Object.keys(course.variables).forEach(key => {
            const value = savedVariables[key] || env[key];
            if (value !== undefined) {
                dispatch(setVariable(key, value, false));
            }
        });
    };
}
