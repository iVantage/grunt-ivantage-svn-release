/*
 * grunt-ivantage-svn-release
 * https://github.com/iVantage/grunt-ivantage-svn-release
 *
 * Copyright (c) 2013 jtrussell
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  var sh = require('shelljs');

  var run = function(cmd, force) {
    force = force || false;
    if(grunt.option('dry-run') && !force) {
      console.log('Not running: ' + cmd);
      return {
        code: 0,
        output: ''
      };
    } else {
      return sh.exec(cmd, {silent: true});
    }
  };

  var getSvnVersionNumber = function() {
    var cmd = run('svn --version', true)
      , lines = cmd.output.split(/\r?\n/)
      , matches = /\s(\d+)\.(\d+)\.(\d+)[\s-]/.exec(lines[0]);
    return matches ? {major: matches[1], minor: matches[2], patch: matches[3]} : null;
  };

  var validateEnv = function() {
    // We need the svn command line tools
    if(!sh.which('svn')) {
      grunt.fail.fatal('Task "release" requires svn command line tools');
    }

    // Old versions of svn put `.svn` dirs in every subdir
    var svnVersion = getSvnVersionNumber();
    if(!svnVersion) {
      grunt.fail.fatal('Task "release" could not parse your svn version number');
    }

    if(svnVersion.major < 1 || svnVersion.major === 1 && svnVersion.minor < 7) {
      grunt.fail.fatal('Task "release" requires svn version 1.7.0 or greater');
    }

    // We must be at the repo root - check for the `.svn` folder
    if(!sh.test('-d', '.svn')) {
      grunt.fail.fatal('Task "release" must be run from project root');
    }

    // There must be no local modifications. We don't care abount unversioned
    // files or externals
    if(run('svn status -q', true).output.length > 0) {
      grunt.fail.warn('Task "release" detected modifications in your working copy');
    }

  };

  grunt.loadNpmTasks('grunt-svn-bump');
  grunt.loadNpmTasks('grunt-ivantage-svn-changelog');
  grunt.loadNpmTasks('grunt-svn-tag');

  grunt.registerTask('_release_prep_changelogs', 'Private helper task for "release"', function() {
    // Add config entry for *new* package.json
    var pkg = grunt.file.readJSON('package.json');

    var logConf = grunt.config.get('ivantage_svn_changelog') || {}
      , logTargets = Object.keys(logConf);

    if(!logTargets.length) {
      grunt.config.set('ivantage_svn_changelog', {
        internal: {
          options: {
            outFile: 'changelogs/CHANGELOG-' + pkg.version + '.md',
            changesetUrl: 'https://ivantage.beanstalkapp.com/' + pkg.name + '/changesets/{{revision}}',
            revFrom: 'LAST_SEMVER_TAG'
          }
        }
      });
    }
  });

  grunt.registerTask('release', 'Pulls it all together, bump, changelogs, tag, ...', function() {
    validateEnv();

    var tasksToRun = [
      'bump' + (this.args.length ? ':' + this.args.join(':') : 'patch'),
      '_release_prep_changelogs',
      'ivantage_svn_changelog',
    ];

    // Queue up the release notes task too if present
    if(grunt.config.get('ivantage_trello_release')) {
      tasksToRun.push('ivantage_trello_release');
    }

    tasksToRun.push('svn_tag');

    // Update JSON files
    grunt.task.run(tasksToRun);

  });

};
