# Contributing

This project requires Node.js 22 and up.

## Making a release

This library follows [semantic versioning](https://semver.org/).  To cut a new release:

- Submit a PR bumping the version in `package.json`
- After it's merged, [create a new release](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release).  Make sure the version in the release matches the version in `package.json`.
- A GitHub Action should be automatically kicked off. Check <https://github.com/twinklyjs/twinklyjs/actions> to make sure it's working as intended.
- Check <https://www.npmjs.com/package/@twinklyjs/twinkly> to make sure the new package version you published appears as expected.
