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

  var validateEnv = function() {
    // We need the svn command line tools
    if(!sh.which('svn')) {
      grunt.fail.fatal('Task "release" requires svn command line tools');
    }

    // Old versions of svn put `.svn` dirs in every subdir
    var svnVersion = sh.exec('svn --version', {silent: true}).output.split('.');
    if(svnVersion.length < 3) {
      grunt.fail.fatal('Task "release" could not parse your svn version number');
    }

    if(svnVersion[0] < 1 || svnVersion[0] === 1 && svnVersion[1] < 7) {
      grunt.fail.fatal('Task "release" requires svn version 1.7.0 or greater');
    }

    // We must be at the repo root - check for the `.svn` folder
    if(sh.test('-d', '.svn')) {
      grunt.fail.fatal('Task "release" must be run from project root');
    }
  };

  grunt.registerTask('release', 'Pulls it all together, bump, changelogs, tag, ...', function() {
    validateEnv();

    // Update JSON files
    grunt.task.run([
      'svn_bump' + this.args.length ? ':' + this.args.join(':') : ''
    ]);

    // Add config entry for *new* package.json
    var pkg = grunt.file.readJSON('package.json');

    var logConf = grunt.config.get('ivantage_svn_changelog') || {}
      , logTargets = Object.keys(logConf);

    if(!logTargets.length) {
      grunt.config.set('ivantage_svn_changelog', {
        internal: {
          options: {
            outFile: 'changelog/CHANGELOG-' + pkg.version + '.md',
            changesetUrl: '#' + pkg.version,
            revFrom: 'LAST_SEMVER_TAG'
          }
        }
      });
    }

    // Changelogs and commits
    grunt.task.run([
      'ivantage_svn_changelog',
      'svn_tag'
    ]);

  });

};
