/* eslint no-underscore-dangle: "off" */

// import appliesToRunningPlatform from './platform-check';

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
        this._platforms = Platform.fromData(json);
        this._enabled = this._platforms.some(p => {
            const {
                platform,
                osRelease,
                arch,
            } = p;

            if (!availablePlatforms.includes(platform)) {
                throw new Error(`${platform} is not valid for the "platform" field.`);
            }

            if (!abailableArchs.includes(arch)) {
                throw new Error(`${arch} is not valid for the "arch" field.`);
            }

            return (
                Platform.correctPlatform(platform) &&
                Platform.correctArch(arch) &&
                Platform.correctOsRelease(osRelease)
            );
        });
    }

    static fromData(data) {
        if (data === undefined) {
            return Platform.fromNothing();
        }
        if (typeof data === 'string') {
            return Platform.fromString(data);
        }
        if (typeof data === 'object') {
            return Platform.fromObject(data);
        }
        if (data instanceof Array) {
            return Platform.fromArray(data);
        }

        throw new Error('Not a valid form of "Platform".');
    }

    static fromNothing() {
        return Platform.fromObject({});
    }

    static fromString(text) {
        return Platform.fromObject({ platform: text });
    }

    static fromObject(obj) {
        return [Object.assign({}, { platform: 'all', osRelease: 'any', arch: 'any' }, obj)];
    }

    static fromArray(arr) {
        return arr.map(element => Platform.fromObject(element)).flat(1);
    }

    static correctPlatform(platform) {
        if (platform === 'all') {
            return true;
        }

        return platform === process.platform;
    }

    static correctArch(arch) {
        if (arch === 'any') {
            return true;
        }

        return arch === process.arch;
    }

    static correctOsRelease(osRelease) {
        if (osRelease === 'any') {
            return true;
        }

        return (currentOsIDs.indexOf(osRelease) !== -1);
    }

    isEnabled() {
        return this._enabled;
    }

    /**
     * @return {Object} A JSON representation of the current instance.
     */
    asJSON() {
        return this._platforms.map(platform => ({
            platform: platform._platforms,
            osRelease: platform._osreleases,
            arch: platform._arch,
        }));
    }
}
