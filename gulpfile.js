var gulp = require("gulp");
var coffee = require("gulp-coffee");
var rm = require("del");

var BUILD_DIR = 'build/';
var COFFEE_SRC_DIR = ['./**/*.coffee', '!./node_modules/**', 'index.coffee'];

gulp.task("default", ['build']);

gulp.task("build", ['clean'], function() {

   gulp
   .src(COFFEE_SRC_DIR)
   .pipe(coffee().on('error', console.log.bind(console)))
   .pipe(gulp.dest(BUILD_DIR));

   gulp
   .src(['package.json', 'public', 'views'])
   .pipe(gulp.dest(BUILD_DIR));

});

gulp.task("clean", function() {
   rm(BUILD_DIR);
});

gulp.task("w", ['build'], function() {
   gulp.watch(COFFEE_SRC_DIR, ['build']);
});
