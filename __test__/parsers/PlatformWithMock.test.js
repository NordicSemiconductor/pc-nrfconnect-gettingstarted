import Platform from '../../lib/parsers/Platform';

let originalPlatform = {};
let originalArch = {};

const setPlatform = platform => Object
    .defineProperty(
        process,
        'platform',
        {
            value: platform,
        }
    );

const setArch = arch => Object
    .defineProperty(
        process,
        'arch',
        {
            value: arch,
        }
    );

const storeAll = () => {
    originalPlatform = process.platform;
    originalArch = process.arch;
};

const resetPlatform = () => setPlatform(originalPlatform);
const resetArch = () => setArch(originalArch);

const resetAll = () => {
    resetPlatform();
    resetArch();
};

describe('Platform', () => {
    beforeAll(() => storeAll());

    afterAll(() => resetAll());

    describe('mocking platform as Linux', () => {
        beforeAll(() => setPlatform('Linux'));

        afterAll(() => resetPlatform());

        it('accepts an empty platform and enables', () => {
            const platform = new Platform(undefined);

            expect(platform._platforms.length).toBe(1);
            expect(platform._platforms[0]).toMatchObject({ platform: 'all', osRelease: 'any', arch: 'any' });
            expect(platform.isEnabled).toBe(true);
        });

        it('accepts Linux as platform and enables', () => {
            const platform = new Platform('Linux');

            expect(platform._platforms.length).toBe(1);
            expect(platform._platforms[0]).toMatchObject({ platform: 'linux', osRelease: 'any', arch: 'any' });
            expect(platform.isEnabled).toBe(true);
        });

        it('accepts Linux as part of platform array and enables', () => {
            const platform = new Platform([
                'linux',
                'darwin'
            ]);

            expect(platform._platforms.length).toBe(2);
            expect(platform._platforms[0]).toMatchObject({ platform: 'linux', osRelease: 'any', arch: 'any' });
            expect(platform._platforms[1]).toMatchObject({ platform: 'darwin', osRelease: 'any', arch: 'any' });
            expect(platform.isEnabled).toBe(true);
        });

        it('does not enable when linux is not in the platform array', () => {
            const platform = new Platform([
                'win32',
                'darwin'
            ]);

            expect(platform._platforms.length).toBe(2);
            expect(platform._platforms[0]).toMatchObject({ platform: 'win32', osRelease: 'any', arch: 'any' });
            expect(platform._platforms[1]).toMatchObject({ platform: 'darwin', osRelease: 'any', arch: 'any' });
            expect(platform.isEnabled).toBe(false);
        });
    });

    describe('mocking platform as darwin', () => {
        beforeAll(() => setPlatform('Darwin'));

        afterAll(() => resetPlatform());

        it('accepts an empty platform and enables', () => {
            const platform = new Platform(undefined);

            expect(platform._platforms.length).toBe(1);
            expect(platform._platforms[0]).toMatchObject({ platform: 'all', osRelease: 'any', arch: 'any' });
            expect(platform.isEnabled).toBe(true);
        });

        it('accepts Darwin as platform and enables', () => {
            const platform = new Platform('Darwin');

            expect(platform._platforms.length).toBe(1);
            expect(platform._platforms[0]).toMatchObject({ platform: 'darwin', osRelease: 'any', arch: 'any' });
            expect(platform.isEnabled).toBe(true);
        });

        it('accepts Darwin as part of platform array and enables', () => {
            const platform = new Platform([
                'linux',
                'darwin'
            ]);

            expect(platform._platforms.length).toBe(2);
            expect(platform._platforms[0]).toMatchObject({ platform: 'linux', osRelease: 'any', arch: 'any' });
            expect(platform._platforms[1]).toMatchObject({ platform: 'darwin', osRelease: 'any', arch: 'any' });
            expect(platform.isEnabled).toBe(true);
        });

        it('does not enable when darwin is not in the platform array', () => {
            const platform = new Platform([
                'win32',
                'linux'
            ]);

            expect(platform._platforms.length).toBe(2);
            expect(platform._platforms[0]).toMatchObject({ platform: 'win32', osRelease: 'any', arch: 'any' });
            expect(platform._platforms[1]).toMatchObject({ platform: 'linux', osRelease: 'any', arch: 'any' });
            expect(platform.isEnabled).toBe(false);
        });
    });

    describe('mocking platform as win32', () => {
        beforeAll(() => setPlatform('win32'));

        afterAll(() => resetPlatform());

        it('accepts an empty platform and enables', () => {
            const platform = new Platform(undefined);

            expect(platform._platforms.length).toBe(1);
            expect(platform._platforms[0]).toMatchObject({ platform: 'all', osRelease: 'any', arch: 'any' });
            expect(platform.isEnabled).toBe(true);
        });

        it('accepts win32 as platform and enables', () => {
            const platform = new Platform('win32');

            expect(platform._platforms.length).toBe(1);
            expect(platform._platforms[0]).toMatchObject({ platform: 'win32', osRelease: 'any', arch: 'any' });
            expect(platform.isEnabled).toBe(true);
        });

        it('accepts win32 as part of platform array and enables', () => {
            const platform = new Platform([
                'win32',
                'darwin'
            ]);

            expect(platform._platforms.length).toBe(2);
            expect(platform._platforms[0]).toMatchObject({ platform: 'win32', osRelease: 'any', arch: 'any' });
            expect(platform._platforms[1]).toMatchObject({ platform: 'darwin', osRelease: 'any', arch: 'any' });
            expect(platform.isEnabled).toBe(true);
        });

        it('does not enable when win32 is not in the platform array', () => {
            const platform = new Platform([
                'darwin',
                'linux'
            ]);

            expect(platform._platforms.length).toBe(2);
            expect(platform._platforms[0]).toMatchObject({ platform: 'darwin', osRelease: 'any', arch: 'any' });
            expect(platform._platforms[1]).toMatchObject({ platform: 'linux', osRelease: 'any', arch: 'any' });
            expect(platform.isEnabled).toBe(false);
        });
    });

    describe('mock arch as x86, with win32 as platform', () => {
        beforeAll(() => {
            setArch('x86');
            setPlatform('win32');
        });

        afterAll(() => resetAll());

        it('accepts an empty platform and enables', () => {
            const platform = new Platform(undefined);

            expect(platform._platforms.length).toBe(1);
            expect(platform._platforms[0]).toMatchObject({ platform: 'all', osRelease: 'any', arch: 'any' });
            expect(platform.isEnabled).toBe(true);
        });

        it('accepts x86 as arch and enables', () => {
            const platform = new Platform({ platform: 'all', arch: 'x86' });

            expect(platform._platforms.length).toBe(1);
            expect(platform._platforms[0]).toMatchObject({ platform: 'all', osRelease: 'any', arch: 'x86' });
            expect(platform.isEnabled).toBe(true);
        });

        it('accepts x86 as part of platform array and enables', () => {
            const platform = new Platform([
                { platform: 'all', arch: 'x64' },
                { platform: 'all', arch: 'x86' }
            ]);

            expect(platform._platforms.length).toBe(2);
            expect(platform._platforms[0]).toMatchObject({ platform: 'all', osRelease: 'any', arch: 'x64' });
            expect(platform._platforms[1]).toMatchObject({ platform: 'all', osRelease: 'any', arch: 'x86' });
            expect(platform.isEnabled).toBe(true);
        });

        it('does not enable when x86 is not in the platform array', () => {
            const platform = new Platform([
                { platform: 'linux', arch: 'x64' },
                { platform: 'win32', arch: 'x64' },
                { platform: 'darwin', arch: 'x64' },
            ]);

            expect(platform._platforms.length).toBe(3);
            expect(platform._platforms[0]).toMatchObject({ platform: 'linux', osRelease: 'any', arch: 'x64' });
            expect(platform._platforms[1]).toMatchObject({ platform: 'win32', osRelease: 'any', arch: 'x64' });
            expect(platform._platforms[2]).toMatchObject({ platform: 'darwin', osRelease: 'any', arch: 'x64' });
            expect(platform.isEnabled).toBe(false);
        });

        it('does not enable when x86 is not specified for win32 in the platform array', () => {
            const platform = new Platform([
                { platform: 'linux', arch: 'any' },
                { platform: 'win32', arch: 'x64' },
                { platform: 'darwin', arch: 'any' },
            ]);

            expect(platform._platforms.length).toBe(3);
            expect(platform._platforms[0]).toMatchObject({ platform: 'linux', osRelease: 'any', arch: 'any' });
            expect(platform._platforms[1]).toMatchObject({ platform: 'win32', osRelease: 'any', arch: 'x64' });
            expect(platform._platforms[2]).toMatchObject({ platform: 'darwin', osRelease: 'any', arch: 'any' });
            expect(platform.isEnabled).toBe(false);
        });

        it('does not enable when x86 for win32 is the only arch/platform specified in the platform array', () => {
            const platform = new Platform([
                { platform: 'linux', arch: 'any' },
                { platform: 'linux', arch: 'x86' },
                { platform: 'linux', arch: 'x64' },
                { platform: 'win32', arch: 'x64' },
                { platform: 'darwin', arch: 'any' },
                { platform: 'darwin', arch: 'x86' },
                { platform: 'darwin', arch: 'x64' },
            ]);

            expect(platform._platforms.length).toBe(7);
            expect(platform._platforms[0]).toMatchObject({ platform: 'linux', osRelease: 'any', arch: 'any' });
            expect(platform._platforms[1]).toMatchObject({ platform: 'linux', osRelease: 'any', arch: 'x86' });
            expect(platform._platforms[2]).toMatchObject({ platform: 'linux', osRelease: 'any', arch: 'x64' });
            expect(platform._platforms[3]).toMatchObject({ platform: 'win32', osRelease: 'any', arch: 'x64' });
            expect(platform._platforms[4]).toMatchObject({ platform: 'darwin', osRelease: 'any', arch: 'any' });
            expect(platform._platforms[5]).toMatchObject({ platform: 'darwin', osRelease: 'any', arch: 'x86' });
            expect(platform._platforms[6]).toMatchObject({ platform: 'darwin', osRelease: 'any', arch: 'x64' });
            expect(platform.isEnabled).toBe(false);
        });
    });

    describe('mock arch as x64, with win32 as platform', () => {
        beforeAll(() => {
            setArch('x64');
            setPlatform('win32');
        });

        afterAll(() => resetAll());

        it('accepts an empty platform and enables', () => {
            const platform = new Platform(undefined);

            expect(platform._platforms.length).toBe(1);
            expect(platform._platforms[0]).toMatchObject({ platform: 'all', osRelease: 'any', arch: 'any' });
            expect(platform.isEnabled).toBe(true);
        });

        it('accepts x64 as arch and enables', () => {
            const platform = new Platform({ platform: 'all', arch: 'x64' });

            expect(platform._platforms.length).toBe(1);
            expect(platform._platforms[0]).toMatchObject({ platform: 'all', osRelease: 'any', arch: 'x64' });
            expect(platform.isEnabled).toBe(true);
        });

        it('accepts x64 as part of platform array and enables', () => {
            const platform = new Platform([
                { platform: 'all', arch: 'x64' },
                { platform: 'all', arch: 'x86' }
            ]);

            expect(platform._platforms.length).toBe(2);
            expect(platform._platforms[0]).toMatchObject({ platform: 'all', osRelease: 'any', arch: 'x64' });
            expect(platform._platforms[1]).toMatchObject({ platform: 'all', osRelease: 'any', arch: 'x86' });
            expect(platform.isEnabled).toBe(true);
        });

        it('does not enable when x64 is not in the platform array', () => {
            const platform = new Platform([
                { platform: 'linux', arch: 'x86' },
                { platform: 'win32', arch: 'x86' },
                { platform: 'darwin', arch: 'x86' },
            ]);

            expect(platform._platforms.length).toBe(3);
            expect(platform._platforms[0]).toMatchObject({ platform: 'linux', osRelease: 'any', arch: 'x86' });
            expect(platform._platforms[1]).toMatchObject({ platform: 'win32', osRelease: 'any', arch: 'x86' });
            expect(platform._platforms[2]).toMatchObject({ platform: 'darwin', osRelease: 'any', arch: 'x86' });
            expect(platform.isEnabled).toBe(false);
        });

        it('does not enable when x64 is not specified for win32 in the platform array', () => {
            const platform = new Platform([
                { platform: 'linux', arch: 'any' },
                { platform: 'win32', arch: 'x86' },
                { platform: 'darwin', arch: 'any' },
            ]);

            expect(platform._platforms.length).toBe(3);
            expect(platform._platforms[0]).toMatchObject({ platform: 'linux', osRelease: 'any', arch: 'any' });
            expect(platform._platforms[1]).toMatchObject({ platform: 'win32', osRelease: 'any', arch: 'x86' });
            expect(platform._platforms[2]).toMatchObject({ platform: 'darwin', osRelease: 'any', arch: 'any' });
            expect(platform.isEnabled).toBe(false);
        });

        it('does not enable when x64 for win32 is the only arch/platform specified in the platform array', () => {
            const platform = new Platform([
                { platform: 'linux', arch: 'any' },
                { platform: 'linux', arch: 'x86' },
                { platform: 'linux', arch: 'x64' },
                { platform: 'win32', arch: 'x86' },
                { platform: 'darwin', arch: 'any' },
                { platform: 'darwin', arch: 'x86' },
                { platform: 'darwin', arch: 'x64' },
            ]);

            expect(platform._platforms.length).toBe(7);
            expect(platform._platforms[0]).toMatchObject({ platform: 'linux', osRelease: 'any', arch: 'any' });
            expect(platform._platforms[1]).toMatchObject({ platform: 'linux', osRelease: 'any', arch: 'x86' });
            expect(platform._platforms[2]).toMatchObject({ platform: 'linux', osRelease: 'any', arch: 'x64' });
            expect(platform._platforms[3]).toMatchObject({ platform: 'win32', osRelease: 'any', arch: 'x86' });
            expect(platform._platforms[4]).toMatchObject({ platform: 'darwin', osRelease: 'any', arch: 'any' });
            expect(platform._platforms[5]).toMatchObject({ platform: 'darwin', osRelease: 'any', arch: 'x86' });
            expect(platform._platforms[6]).toMatchObject({ platform: 'darwin', osRelease: 'any', arch: 'x64' });
            expect(platform.isEnabled).toBe(false);
        });
    });

    describe('mock arch as ia32, with win32 as platform', () => {
        beforeAll(() => {
            setArch('ia32');
            setPlatform('win32');
        });

        afterAll(() => resetAll());

        it('accepts an empty platform and enables', () => {
            const platform = new Platform(undefined);

            expect(platform._platforms.length).toBe(1);
            expect(platform._platforms[0]).toMatchObject({ platform: 'all', osRelease: 'any', arch: 'any' });
            expect(platform.isEnabled).toBe(true);
        });

        it('accepts x86 as arch and enables', () => {
            const platform = new Platform({ platform: 'all', arch: 'x86' });

            expect(platform._platforms.length).toBe(1);
            expect(platform._platforms[0]).toMatchObject({ platform: 'all', osRelease: 'any', arch: 'x86' });
            expect(platform.isEnabled).toBe(true);
        });

        it('does not accept x64 as arch and does not enables', () => {
            const platform = new Platform({ platform: 'all', arch: 'x64' });

            expect(platform._platforms.length).toBe(1);
            expect(platform._platforms[0]).toMatchObject({ platform: 'all', osRelease: 'any', arch: 'x64' });
            expect(platform.isEnabled).toBe(false);
        });
    });
});
