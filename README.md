# GitHub Action to Setup Mill for Scala Projects

![Build & Test](https://github.com/zhutmost/setup-mill/actions/workflows/ci.yml/badge.svg)

Use this action to make [mill](http://www.lihaoyi.com/mill/) available in a job.

## Usage

```yaml
- uses: zhutmost/setup-mill@master
  with:
    mill-version: 0.11.7 # Specify the default Mill version
- name: Compile
  run: mill project.compile
- name: Test
  run: mill project.test
```

### Difference from the existing `setup-mill` action

This repository was created to fix [an issue](https://github.com/jodersky/setup-mill/issues/7) in [jodersky/setup-mill](https://github.com/jodersky/setup-mill), where the action did not support specifying the Mill version using `.mill-version`.

In this repository, this action will download the Mill wrapper script (rather than the binary) and make it available in the PATH.
It will download the binary with proper version when needed.
That is to say, if you specify a Mill version via `REPO/.mill-version`/`REPO/.config/mill-version`, the action will download the specified version.

## Acknowledgement

This repository is standing on the shoulder of giants.

This repository is forked from [jodersky/setup-mill](https://github.com/jodersky/setup-mill). Thanks for the original author's work.
