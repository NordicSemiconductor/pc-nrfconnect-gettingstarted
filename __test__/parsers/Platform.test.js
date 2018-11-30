import Platform from '../../lib/parsers/Platform';

describe('Platform', () => {
    describe('mathing all platforms', () => {
        it('accepts an empty platform and enables', () => {
            const platform = new Platform(undefined);

            expect(platform.platforms.length).toBe(1);
            expect(platform.platforms[0]).toMatchObject({ platform: 'all', osRelease: 'any', arch: 'any' });
            expect(platform.enabled).toBe(true);
        });

        it('accepts a string platform and enables', () => {
            const platform = new Platform('all');

            expect(platform.platforms.length).toBe(1);
            expect(platform.platforms[0]).toMatchObject({ platform: 'all', osRelease: 'any', arch: 'any' });
            expect(platform.enabled).toBe(true);
        });

        it('accepts an object platform and enables', () => {
            const platform = new Platform({ platform: 'all', osRelease: 'any', arch: 'any' });

            expect(platform.platforms.length).toBe(1);
            expect(platform.platforms[0]).toMatchObject({ platform: 'all', osRelease: 'any', arch: 'any' });
            expect(platform.enabled).toBe(true);
        });

        it('accepts an array of platforms and enables', () => {
            const platforms = [
                { platform: 'win32', osRelease: 'any', arch: 'any' },
                { platform: 'linux', osRelease: 'any', arch: 'any' },
                { platform: 'darwin', osRelease: 'any', arch: 'any' }
            ];
            const platform = new Platform(platforms);

            expect(platform.platforms.length).toBe(3);
            platforms.forEach((p, index) => {
                expect(platform.platforms[index]).toMatchObject(p);
            })
            expect(platform.enabled).toBe(true);
        });

        it('accepts an array of platforms in different formats and enables', () => {
            const platforms = [
                { platform: 'win32', osRelease: 'any', arch: 'any' },
                { platform: 'linux' },
                'darwin'
            ];
            const platform = new Platform(platforms);

            expect(platform.platforms.length).toBe(3);
            expect(platform.platforms[0]).toMatchObject({ platform: 'win32', osRelease: 'any', arch: 'any' });
            expect(platform.platforms[1]).toMatchObject({ platform: 'linux', osRelease: 'any', arch: 'any' });
            expect(platform.platforms[2]).toMatchObject({ platform: 'darwin', osRelease: 'any', arch: 'any' });
            expect(platform.enabled).toBe(true);
        });
    });

    describe(`match the current platform (${process.platform}) and arch (${process.arch})`, () => {
        it('accepts when platform is correct', () => {
            const platform = new Platform(process.platform);

            expect(platform.platforms.length).toBe(1);
            expect(platform.platforms[0]).toMatchObject({ platform: process.platform.toLowerCase(), osRelease: 'any', arch: 'any' });
            expect(platform.enabled).toBe(true);
        });

        it('accepts when arch is correct', () => {
            const platform = new Platform({
                platform: 'all',
                arch: process.arch,
            });

            expect(platform.platforms.length).toBe(1);
            expect(platform.platforms[0]).toMatchObject({ platform: 'all', osRelease: 'any', arch: Platform.translateArch(process.arch.toLowerCase()) });
            expect(platform.enabled).toBe(true);
        });

        it('accepts when platform and arch is correct', () => {
            const platform = new Platform({
                platform: process.platform,
                arch: process.arch,
            });

            expect(platform.platforms.length).toBe(1);
            expect(platform.platforms[0]).toMatchObject({ platform: process.platform.toLowerCase(), osRelease: 'any', arch: Platform.translateArch(process.arch.toLowerCase()) });
            expect(platform.enabled).toBe(true);
        });
    });

    describe('handle errors in data', () => {
        it('stores error and is not enabled on illegal platform', () => {
            const platform = new Platform('illegal platform');

            expect(platform.enabled).toBe(false);
            expect(platform.error).toMatchSnapshot();
        });

        it('stores error and is not enabled on illegal arch', () => {
            const platform = new Platform({ platform: 'win32', arch: 'illegal arch' });

            expect(platform.enabled).toBe(false);
            expect(platform.error).toMatchSnapshot();
        });

        it('stores error and is not enabled when both illegal platform and arch', () => {
            const platform = new Platform({ platform: 'illegal platform', arch: 'illegal arch' });

            expect(platform.enabled).toBe(false);
            expect(platform.error).toMatchSnapshot();
        });

        it('stores error and is not enabled on an array containing one illegal platform and arch, and a legal, matching element first', () => {
            const platform = new Platform([
                'all',
                { platform: 'illegal platform', arch: 'illegal arch' },
            ]);

            expect(platform.enabled).toBe(false);
            expect(platform.error).toMatchSnapshot();
        });

        it('stores error and is not enabled on an array containing one illegal platform and arch, and a legal, matching element after', () => {
            const platform = new Platform([
                { platform: 'illegal platform', arch: 'illegal arch' },
                'win32',
            ]);

            expect(platform.enabled).toBe(false);
            expect(platform.error).toMatchSnapshot();
        });

        it('stores error and is not enabled when a number is sent in', () => {
            const platform = new Platform(1);

            expect(platform.enabled).toBe(false);
            expect(platform.error).toMatchSnapshot();
        });

        it('stores error and is not enabled when an object without the "platform" property is sent', () => {
            const platform = new Platform({});

            expect(platform.enabled).toBe(false);
            expect(platform.error).toMatchSnapshot();
        });
    });
});
