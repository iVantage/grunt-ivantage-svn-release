# grunt-ivantage-svn-release

> Pulls it all together, bump, changelogs, tag, ... RELEASE!

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-ivantage-svn-release');
```

## The "release" task

### Overview

This task exists to pull together a bunch of other tasks which should still
exist in isolation.

#### The Bump

With [grunt-svn-bump](https://github.com/iVantage/grunt-svn-bump), we pass
through arguments for how to perform the bump. I.e. you might do something like:

```shell
grunt release:patch
```

or

```shell
grunt release:minor:prerelease
```

#### The Changelog

Using
[grunt-ivantage-svn-changelog](https://github.com/iVantage/grunt-ivantage-svn-changelog)
we crank out a changelog for everything since the previous (semver) tagged
version. These will be saved to `./changelog/CHANGELOG-<new-version>.md`
by default but will honor config settings in your gruntfile for that task.

#### The Tag

Finally [grunt-svn-tag](https://github.com/iVantage/grunt-svn-tag.git) closes
the deal by creating a new tag for us under the updated version number.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code
using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
