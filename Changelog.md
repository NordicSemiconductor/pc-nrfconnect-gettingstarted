## 2.0.2 - 2022-02-28
- Stop using legacy api for internal functionality.

## 2.0.1 - 2021-11-30
### Fixed
- `Restore Defaults...` option not removing stored values.

## 2.0.0 - 2021-11-01
### Changed
- Use new look & feel of nRF Connect for Desktop.
### Removed
- Support for Windows and macOS. There the Toolchain Manager should be used.

## 1.1.5 - 2021-09-28
### Changed
- Bump required CMake version to 3.20.5 for Linux.

## 1.1.4 - 2021-07-07
### Changed
- Mention that Toolchain Manager is supported on Mac explicitly.

## 1.1.3 - 2021-07-06
### Added
- Deprecation warning for Mac.

## 1.1.2 - 2021-05-26
### Changed
- Update west install instructions.

## 1.1.1 - 2021-04-13
### Fixed
- Main view scrolling issue.

## 1.1.0 - 2021-04-12
### Changed
- Align instructions with online documentation structure.
- Update instructions for GNU toolchain 9-2019-q4-major.

## 1.0.10 - 2021-01-25
### Added
- Installing section for Connected Home over IP dependencies.
### Changed
- Updated project import step.

## 1.0.9 - 2020-10-21
### Changed
- Updated according to changes of Electron dialog API.

## 1.0.8 - 2020-06-12
### Changed
- Text regarding SDK device family support.
- NCS repository URL.
### Added
- zephyr-export step.
### Fixed
- dtc install step for Linux.

## 1.0.7 - 2020-03-06
### Changed
- Deprecation warning for Windows + NCS 1.2.

## 1.0.6 - 2020-02-19
### Fixed
- Update mcuboot path, fix pip call on macOS.

## 1.0.5 - 2019-12-02
### Fixed
- gcc version check on windows.

## 1.0.4 - 2019-11-25
### Changed
- Instructions for GNU toolchain 8-2019q3.

## 1.0.3 - 2019-11-14
### Changed
- Clarify scope of this guide.
- Link to user guide for nRF9160 and nRF5340.
### Fixed
- Reference new [docs project](https://nordicsemiconductor.github.io/pc-nrfconnect-docs/) (replacing the [defunct wiki](https://github.com/NordicSemiconductor/pc-nrfconnect-core/wiki)).
- Fix verification issues for `python3` and `cmake` (Thanks, @ndrake).
