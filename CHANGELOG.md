# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.0.0](https://github.com/favware/dexa/compare/v2.1.0...v3.0.0) (2022-09-25)

### ⚠ BREAKING CHANGES

- update to gqlp v7

### Features

- update to gqlp v7 ([81ebb56](https://github.com/favware/dexa/commit/81ebb56e611afe8f1ad275233df85d38770886b6))
- update to latest graphql-pokemon ([c0e1088](https://github.com/favware/dexa/commit/c0e10884bc8f1e6e48f2e6a63b66e7930b948362))

### Bug Fixes

- **deps:** update all non-major dependencies ([#126](https://github.com/favware/dexa/issues/126)) ([57dec9e](https://github.com/favware/dexa/commit/57dec9ef9560eacfa43f5fdfc1d4629c560e8040))
- **deps:** update dependency @sapphire/utilities to ^3.7.0 ([#211](https://github.com/favware/dexa/issues/211)) ([c7dcde3](https://github.com/favware/dexa/commit/c7dcde3c3e343c25c5f67d44e6131e3b6090af5b))
- **deps:** update dependency @sapphire/utilities to ^3.8.0 ([#217](https://github.com/favware/dexa/issues/217)) ([0a8d660](https://github.com/favware/dexa/commit/0a8d66078d148e19cfb5486ae5e4637bb30df5db))
- **deps:** update dependency @sapphire/utilities to ^3.9.0 ([#220](https://github.com/favware/dexa/issues/220)) ([8d45e52](https://github.com/favware/dexa/commit/8d45e52202f404cc226406f609438e7898fd7296))
- **deps:** update dependency @sapphire/utilities to ^3.9.3 ([#226](https://github.com/favware/dexa/issues/226)) ([245ac24](https://github.com/favware/dexa/commit/245ac247cdd14e1c84cac13e1fe1a80157eb9444))
- **deps:** update dependency @sapphire/utilities to v3 ([#129](https://github.com/favware/dexa/issues/129)) ([e0dd970](https://github.com/favware/dexa/commit/e0dd970fa05656f28a2c5d49f258b3c5692d56d1))
- **deps:** update dependency confusables to ^1.1.1 ([#209](https://github.com/favware/dexa/issues/209)) ([0773a35](https://github.com/favware/dexa/commit/0773a35ade1c41337c5a1f93aab7e8ebc8859f0d))
- remove apollo-codegen to fix GHSA-p9pc-299p-vxgp ([3c9995e](https://github.com/favware/dexa/commit/3c9995e7426775663bd9e9118d9ec24af8d87f6e))
- update urls ([492d6dc](https://github.com/favware/dexa/commit/492d6dcec0269e3d4364ffc4a5409329a560b135))

## [2.1.0](https://github.com/favware/dexa/compare/v2.0.3...v2.1.0) (2020-05-16)

### Features

- cleanup all queries to use proper graphql syntax ([ef61373](https://github.com/favware/dexa/commit/ef6137330b1b4cde5c9a7c98c80d102671aaab03))

### [2.0.3](https://github.com/favware/dexa/compare/v2.0.2...v2.0.3) (2020-02-02)

### Bug Fixes

- build was broken, now fixed ([71911f7](https://github.com/favware/dexa/commit/71911f7e2134d75af5b4d90e65c3ab48ba544d10))
- fixed typo generaton -> generation ([379e2e0](https://github.com/favware/dexa/commit/379e2e05876f2dfa613c4317853495eb26fa0186))
- multiple bugfixes, details in description ([73ef48b](https://github.com/favware/dexa/commit/73ef48bccfb5751d7b67d59c221ee4150c8719bc))

### [2.0.2](https://github.com/favware/dexa/compare/v2.0.1...v2.0.2) (2020-01-05)

### Bug Fixes

- cover LaunchIntent & ErrorHandler in test and cleanup Launch response ([8d3fb40](https://github.com/favware/dexa/commit/8d3fb40955ac1d4cbb1128869902796260946f9a))

### [2.0.1](https://github.com/favware/dexa/compare/v2.0.0...v2.0.1) (2020-01-05)

### Bug Fixes

- fixed special condition evolution parsing ([ca111e4](https://github.com/favware/dexa/commit/ca111e4e6ccc66cf26fc12d592aa33e158ae8263))

## 2.0.0 (2020-01-05)

### ⚠ BREAKING CHANGES

- TypeScript port means the old code is fully reworked and is not compatible with any old code

Signed-off-by: Jeroen Claassens <support@favware.tech>

- rewrite to TypeScript and graphql-pokemon API ([#30](https://github.com/favware/dexa/issues/30)) ([fff98a9](https://github.com/favware/dexa/commit/fff98a9478b2da2d4d624225fa538719bb137a0c))
