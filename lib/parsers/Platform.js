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

import OsInfo from 'linux-os-info';

// Get the ID and ID_LIKE fields from /etc/os-release, concatenate their values
const osInfo = OsInfo({ mode: 'sync' });
const currentOsIDs = (osInfo.id_like || '').split(/\s+/);
currentOsIDs.push(osInfo.id);

const availablePlatforms = ['all', 'win32', 'darwin', 'linux'];
const abailableArchs = ['any', 'x86', 'x64'];

/**

 *
 */
export default class Platform {
    /**
     * @param {Object} json The input JSON representation for this platform
     */
    constructor(json) {
        try {
            this.platforms = Platform
                .extractPlatforms(json)
                .map(platform => ({
                    platform: platform.platform.toLowerCase(),
                    arch: Platform.translateArch(platform.arch.toLowerCase()),
                    osRelease: platform.osRelease.toLowerCase(),
                }));

            // We are using a map here instead of directly use
            // the some to ensure that we excecute all the elements
            // to catch any error that may be in an array.
            this.enabled = this.platforms
                .map(p => {
                    const {
                        platform,
                        osRelease,
                        arch,
                    } = p;

                    if (!availablePlatforms.includes(platform)) {
                        throw new Error(`"${platform}" is not valid for the "platform" field.`);
                    }

                    if (!abailableArchs.includes(arch)) {
                        throw new Error(`"${arch}" is not valid for the "arch" field.`);
                    }

                    return (
                        Platform.correctPlatform(platform) &&
                        Platform.correctArch(arch) &&
                        Platform.correctOsRelease(osRelease)
                    );
                })
                .some(p => p);
            this.error = undefined;
        } catch (error) {
            this.enabled = false;
            this.error = error;
        }
    }

    static translateArch(arch) {
        if (arch === 'ia32') {
            return 'x86';
        }

        return arch;
    }

    static extractPlatforms(data) {
        const processedPlatforms = Platform.fromData(data);

        if (!(processedPlatforms instanceof Array)) {
            return [processedPlatforms];
        }

        return processedPlatforms;
    }

    static fromData(data) {
        if (data === undefined) {
            return Platform.fromNothing();
        }
        if (data instanceof Array) {
            return Platform.fromArray(data);
        }
        if (typeof data === 'string') {
            return Platform.fromString(data);
        }
        if (typeof data === 'object') {
            return Platform.fromObject(data);
        }

        throw new Error(`"${data}" is not a valid form of "Platform".`);
    }

    static fromNothing() {
        return Platform.fromObject({ platform: 'all' });
    }

    static fromString(text) {
        return Platform.fromObject({ platform: text });
    }

    static fromObject(obj) {
        if (!obj.platform) {
            throw new Error(`${obj} does not contain the mandatory property "platform".`);
        }
        return Object.assign({}, { platform: 'all', osRelease: 'any', arch: 'any' }, obj);
    }

    static fromArray(arr) {
        return arr.map(element => Platform.fromData(element));
    }

    static correctPlatform(platform) {
        if (platform === 'all') {
            return true;
        }

        return platform === process.platform.toLowerCase();
    }

    static correctArch(arch) {
        if (arch === 'any') {
            return true;
        }

        return arch === Platform.translateArch(process.arch.toLowerCase());
    }

    static correctOsRelease(osRelease) {
        if (osRelease === 'any') {
            return true;
        }

        return (currentOsIDs.indexOf(osRelease) !== -1);
    }

    /**
     * @return {Object} A JSON representation of the current instance.
     */
    asJSON() {
        return this.platforms.map(platform => ({
            platform: platform.platforms,
            osRelease: platform.osreleases,
            arch: platform.arch,
        }));
    }
}
