'use strict';
let gulp = require('gulp');
let $ = require('gulp-load-plugins')({lazy: true});
let args = require('yargs').argv;
let cp = require('child_process');
let del = require('del');
let rollup = require('rollup-stream');
let source = require('vinyl-source-stream');

let path = require("path");

let ngcOutput = './src/';
let jsCopySrc = ['*.js', '*.js.map', '*.d.ts', '*.metadata.json'].map(ext => ngcOutput + ext);
let distDir = './dist/';

gulp.task('default', ['help']);

gulp.task('help', $.taskListing.withFilters(function (taskName) {
    return taskName.substr(0, 1) == "_";
}, function (taskName) {
    return taskName === 'default';
}));

gulp.task('build', ['umd'], function () {
    return gulp
        .src(jsCopySrc)
        .pipe(gulp.dest(distDir));
});

// Uses rollup-stream plugin https://www.npmjs.com/package/rollup-stream
gulp.task('umd', ['ngc'], function (done) {
    return rollup('rollup.config.js')
        .pipe(source('in-memory-web-api.umd.js'))
        .pipe(gulp.dest('./bundles'));
});

gulp.task('ngc', ['clean'], function (done) {
    runNgc('./', done);
});

gulp.task('clean', function (done) {
    clean(['aot/**/*.*']);
    clean(['dist/*.*']);
    clean(['!gulpfile.js', './bundles/in-memory-web-api.umd.js']);
    clean(['*.js', '*.js.map', '*.d.ts', '*.metadata.json'].map(ext => ngcOutput + ext), done);
});

/**
 * Bump the version
 * --type=pre will bump the prerelease version *.*.*-x
 * --type=patch or no flag will bump the patch version *.*.x
 * --type=minor will bump the minor version *.x.*
 * --type=major will bump the major version x.*.*
 * --version=1.2.3 will bump to a specific version and ignore other flags
 */
gulp.task('bump', function () {
    let msg = 'Bumping versions';
    let type = args.type;
    let version = args.ver;
    let options = {};
    if (version) {
        options.version = version;
        msg += ' to ' + version;
    } else {
        options.type = type;
        msg += ' for a ' + type;
    }
    log(msg);

    return gulp
        .src('package.json')
        //        .pipe($.print())
        .pipe($.bump(options))
        .pipe(gulp.dest('./'));
});
//////////

function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, {dryRun: false})
        .then(function (paths) {
            console.log('Deleted files and folders:\n', paths.join('\n'));
        })
        .then(done, done);
}

function log(msg) {
    if (typeof(msg) === 'object') {
        for (let item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
function runNgc(directory, done) {
    directory = directory || './';
    //let ngcjs = path.join(process.cwd(), 'node_modules/typescript/bin/tsc');
    //ngcjs = path.join(process.cwd(), 'node_modules/.bin/ngc');
    let ngcjs = './node_modules/@angular/compiler-cli/src/main.js';
    let childProcess = cp.spawn('node', [ngcjs, '-p', directory], {cwd: process.cwd()});
    childProcess.stdout.on('data', function (data) {
        console.log(data.toString());
    });
    childProcess.stderr.on('data', function (data) {
        console.log(data.toString());
    });
    childProcess.on('close', function (code) {
        if (code !== 0) {
            throw(new Error('ngc compilation exited with an error code'))
        } else {
            done();
        }
    });
}
