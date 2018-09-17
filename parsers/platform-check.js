
import OsInfo from 'linux-os-info';

// Get the ID and ID_LIKE fields from /etc/os-release, concatenate their values
const osInfo = OsInfo({ synchronous: true });
const currentOsIDs = (osInfo.id_like || '').split(/\s+/);
currentOsIDs.push(osInfo.id);

/**
 * Given two string or arrays of strings, parses them as recipe platforms/OS releases
 * and returns whether the current process is running on one of those platforms
 * *and* on one of those OS releases.
 * Throws an error if the platforms definition is malformed.
 * @param {Object|Array<Object>} platforms The platforms definition. A plain
 * object containing platform, arch, osRelease and osVersion string members.
 * @return {Boolean} Whether the current process is running on a platform
 * fitting (any of) the given definition(s)
 */
export default function appliesToRunningPlatform(platforms = 'all') {
    const plats = (platforms instanceof Array) ?
        platforms : [platforms];

    plats.forEach(p => {
        const {
            platform, arch,
        } = p;

        // Values for platform/arch should map to possible values for
        // nodejs' process.platform and process.arch
        if (
            platform !== 'all' &&
            platform !== 'win32' &&
            platform !== 'linux' &&
            platform !== 'darwin'
        ) {
            throw new Error('Platform must be one of \'all\', \'win32\', \'linux\' or \'darwin\'');
        }

        if (arch !== undefined && arch !== 'x32' && arch !== 'x64') {
            throw new Error('Platform architecture must be undefined or one of \'x32\', \'x64\'');
        }
    });

    const supportedPlatform = plats.some(p => {
        const {
            platform, arch, osRelease,
            // TODO: get the `osVersion` property from destructuring `p`
        } = p;

        return (
            (platform === 'all' || platform === process.platform) &&
            (arch === undefined || arch === process.arch) &&
            (osRelease === undefined || currentOsIDs.indexOf(osRelease) !== -1)
        );

        // TODO: make a comparison between osVersion and os.release() with e.g.
        // semver.satisfies() - see https://www.npmjs.com/package/semver
    });

    return supportedPlatform;
}
