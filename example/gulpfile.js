var gulp = require('gulp');
var fs = require('fs');
var rev = require('gulp-rev');
var srcReplace = require('gulp-replace-src');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var postcss = require('gulp-postcss');
var px2rem = require('postcss-px2rem');
var gulpif = require('gulp-if');
var clean = require('gulp-clean');
var autoprefixer = require('gulp-autoprefixer');
var gulpSequence = require('gulp-sequence');

var DEBUG = false;

gulp.task("build:css", function() {
  return gulp.src('src/index.css')
    .pipe(autoprefixer({
          browsers: ['last 2 Chrome versions', 'safari 5', 'ios 7', 'android 4'],
          cascade: false
    }))
    .pipe(postcss([px2rem({remUnit: 75})]))
    .pipe(gulpif(!DEBUG, csso()))
    .pipe(gulp.dest("dist/"));
});

gulp.task("build:js", function() {
  return gulp.src('src/index.js')
    .pipe(gulpif(!DEBUG, uglify()))
    .pipe(gulp.dest('dist/'));
});

gulp.task("version", function() {
  return gulp.src(['dist/*.css','dist/*.js'])
    .pipe(rev())
    .pipe(gulp.dest('dist/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist/'));
});

gulp.task('clean', function(){
  return gulp.src(['dist/*.*',], {read: false})
    .pipe(clean());
})

gulp.task("replace", function() {
  var manifest = JSON.parse(fs.readFileSync('dist/rev-manifest.json').toString("utf-8"));

  gulp.src('src/index.html')
    .pipe(srcReplace({
      manifest: manifest,
      rootPath: 'dist/',
      basePath: 'dist/',
      hash: false,
      inline: !DEBUG
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('default',['clean'],function(done){
  gulpSequence('build:css', 'build:js', 'version', 'replace', done);
})
