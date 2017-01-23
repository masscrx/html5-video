var gulp  = require('gulp');
var babel = require('gulp-babel');
var browsersync = require('browser-sync');
var uglify = require('gulp-uglify');

gulp.task('build', function() {
  gulp.src('src/script.js')
      .pipe(babel({
          presets: ['es2015']
      }))
      .pipe(uglify())
      .pipe(gulp.dest('js'));
});

gulp.task('browsersync', ['build'], function() {
  browsersync({
    server: {
      baseDir: ['.']
    },
    port: 8000,
    files: ['./src/script.js']
  });
});

gulp.task('watch', ['browsersync'], function() {
  gulp.watch('./src/script.js', ['build']);
});

gulp.task('default', ['watch'], function () {

});