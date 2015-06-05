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
version. These will be saved to `./changelogs/CHANGELOG-<new-version>.md`
by default but will honor config settings in your gruntfile for that task.

#### The Release Notes
Using the
[grunt-ivantage-trello-release-notes](https://github.com/iVantage/grunt-ivantage-trello-release-notes)
task we can put together release notes from user stores in a Trello board. This
step will only be run if you have an `ivantage_trello_release` section in your
grunt config.

#### The Tag

Finally [grunt-svn-tag](https://github.com/iVantage/grunt-svn-tag.git) closes
the deal by creating a new tag for us under the updated version number.

## Contributing
Please see our [contribution guidelines](https://github.com/iVantage/Contribution-Guidelines).

## Release History

06-05-2015 v0.5.0 Run release notes task if present
01-15-2014 v0.2.4 Ignore externals and unversioned files
