'use strict';

const build = require('@microsoft/sp-build-web');
const zip = require('gulp-zip');
var clean = require('gulp-clean');
const path = require('path');
const fs = require('fs');
    
/**
 * Bundles the Teams artefacts into a single Zip file
 */
let bundleTeamsTask = build.subTask('bundle-teams', function(gulp, buildOptions, done) {
    
    // We expect to be in the SPFx pipeling and that a package-solution.json exists 
    var psConfigPath = path.join(process.cwd(), 'config', "package-solution.json");
 
    var psConfig = undefined;
    try {
        // Parsing the file as a JSON
        var content = fs.readFileSync(psConfigPath, 'utf8');
        psConfig = JSON.parse(content);

        // Zipping the content of the entire folder as a zip, except the /solution folder
        return gulp .src(['teams/*', '!teams/solution'])
                    .pipe(zip(`${psConfig.solution.name}.zip`))
                    .pipe(gulp.dest('teams/solution'));
    }
    catch (e) { 
        this.logError("No package-solution.json was found. Please use this solution with a SPFx project.");
    }
});

/**
 * Cleans the /solutions folder to be fully empty
 */
let cleanTeamsTask = build.subTask('clean-teams-subtask', function(gulp, buildOptions, done) {
    return gulp .src('teams/solution', {read: false})
                .pipe(clean());
});

module.exports = {
    bundleTeamsTask: bundleTeamsTask,
    cleanTeamsTask: cleanTeamsTask
};