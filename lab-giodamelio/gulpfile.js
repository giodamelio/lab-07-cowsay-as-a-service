const fs = require('fs');

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');

const linterRules = JSON.parse(fs.readFileSync('./.eslintrc'));

const srcFiles = 'lib/**/*.js';
const testFiles = 'test/**/*.js';

// Linter tasks -------------------------------------------
gulp.task('lint:src', () =>
  gulp.src(srcFiles)
    .pipe(eslint(linterRules))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('lint:test', () =>
  gulp.src(testFiles)
    .pipe(eslint(Object.assign(linterRules, {
      envs: ['node', 'es6', 'mocha'],
    })))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('lint', ['lint:src', 'lint:test']);

gulp.task('lint:watch', () => {
  gulp.watch(srcFiles, ['lint:src'])
    .on('change', (event) => {
      console.log(`File ${event.path} was ${event.type}, running tasks...`);
    });

  gulp.watch(testFiles, ['lint:test'])
    .on('change', (event) => {
      console.log(`File ${event.path} was ${event.type}, running tasks...`);
    });
});

// Test tasks ---------------------------------------------
gulp.task('test', () =>
  gulp.src(testFiles, { read: false })
    .pipe(mocha({
      reporter: 'spec',
    }))
);

gulp.task('test:watch', ['test'], () => {
  gulp.watch([srcFiles, testFiles], ['test'])
    .on('change', (event) => {
      console.log(`File ${event.path} was ${event.type}, running tasks...`);
    });
});

gulp.task('default', ['lint', 'test']);
gulp.task('watch', ['lint:watch', 'test:watch']);
