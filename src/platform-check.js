/**
 * Given a string or array of strings, parses it as recipe platforms and
 * returns whether the current process is running on one of those platforms.
 * Throws an error if the platforms definition is malformed.
 * @param {String|Array<String>} platforms The platforms definition
 * @return {Boolean} Whether the current process is running on a platform
 * fitting the given definition
 */
export default function appliesToRunningPlatform(platforms) {
    const plats = (typeof platforms === 'string') ?
        [platforms] : platforms;

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

    return plats.some(p => {
        const [platform, arch] = p.split('-');

        return (
            (platform === 'all' || platform === process.platform) &&
            (arch === undefined || arch === process.arch)
        );
    });
}
