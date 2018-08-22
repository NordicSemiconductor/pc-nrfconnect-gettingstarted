
import OsInfo from 'linux-os-info';

// Get the ID and ID_LIKE fields from /etc/os-release, concatenate their values
const osInfo = OsInfo({synchronous: true});
const currentOsIDs = (osInfo.id_like || "").split(/\s+/);
currentOsIDs.push(osInfo.id);

/**
 * Given two string or arrays of strings, parses them as recipe platforms/OS releases
 * and returns whether the current process is running on one of those platforms
 * *and* on one of those OS releases.
 * Throws an error if the platforms definition is malformed.
 * @param {String|Array<String>} platforms The platforms definition
 * @param {String|Array<String>} osReleases The OS Releases definition
 * @return {Boolean} Whether the current process is running on a platform
 * fitting the given definition
 */
export default function appliesToRunningPlatform(platforms = 'all', osReleases = 'all') {
    const plats = (typeof platforms === 'string') ?
        [platforms] : platforms;

    const osIDs = (typeof osReleases === 'string') ?
        [osReleases] : osReleases;

    plats.forEach(p => {
        const [platform, arch] = p.split('-');

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
        const [platform, arch] = p.split('-');

        return (
            (platform === 'all' || platform === process.platform) &&
            (arch === undefined || arch === process.arch)
        );
    });

    const supportedOsID = osIDs.some(o => {
        return (o === 'all' || currentOsIDs.indexOf(o) !== -1);
    });

    return supportedPlatform && supportedOsID;
}
