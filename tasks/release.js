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

  grunt.registerTask('release', 'Pulls it all together, bump, changelogs, tag, ...', function() {
    // Merge task-specific and/or target-specific options with these defaults.

    // TODO massage the config for our changelog settings
    // - Check for local modifications?
    // - Destination
    //   - Need new version number
    // - revFrom
    // - Warn if there's no changeset url

    // Update JSON files
    grunt.task.run([
      'svn_bump' + this.args.length ? ':' + this.args.join(':') : ''
    ]);

    // Add config entry for *new* package.json
    var pkg = grunt.file.readJSON('package.json');

    var logConf = grunt.config.get('ivantage_svn_changelog') || {}
      , logTargets = Object.keys(logConf);
    console.log(logTargets);
    
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
