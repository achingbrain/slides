const gulp = require('gulp')
const gutil = require('gulp-util')
const plumber = require('gulp-plumber')
const rimraf = require('gulp-rimraf')
const rename = require('gulp-rename')
const connect = require('gulp-connect')
const browserify = require('gulp-browserify')
const uglify = require('gulp-uglify')
const jade = require('gulp-jade')
const stylus = require('gulp-stylus')
const autoprefixer = require('gulp-autoprefixer')
const csso = require('gulp-csso')
const template = require('gulp-template')
const concat = require('gulp-concat')
const through = require('through')
const opn = require('opn')
const ghpages = require('gh-pages')
const path = require('path')
const fs = require('fs')
const isDist = process.argv.indexOf('serve') === -1
const pkg = require('./package.json')
const deckPkg = require(process.cwd() + '/package.json')

const SRC_DIR = path.join(__dirname, 'src')
const TMP_DIR = path.join(__dirname, 'temp')
const DIST_DIR = path.join(__dirname, 'dist')
const USER_DIR = process.cwd()

gulp.task('js', ['clean:js'], () => {
  return gulp.src(SRC_DIR + '/scripts/main.js')
    .pipe(isDist ? through() : plumber())
    .pipe(browserify({ debug: !isDist }))
    .pipe(isDist ? uglify() : through())
    .pipe(rename('slides.js'))
    .pipe(gulp.dest(DIST_DIR))
    .pipe(connect.reload())
})

gulp.task('html', ['clean:html', 'html:template'], () => {
  return gulp.src(TMP_DIR + '/template.jade')
    .pipe(isDist ? through() : plumber())
    .pipe(jade({ pretty: true }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(DIST_DIR))
    .pipe(connect.reload())
})

gulp.task('html:template', () => {
  return gulp.src(SRC_DIR + '/template.jade')
    .pipe(template({
      author: deckPkg.author,
      description: deckPkg.description,
      title: deckPkg.name,
      slides: fs.readFileSync(path.join(process.cwd(), 'slides.jade'), 'utf8').replace(/\n/g, '\n    ')
    }))
    .pipe(gulp.dest(TMP_DIR))
})

gulp.task('css', ['clean:css'], () => {
  return gulp.src([
    SRC_DIR + '/styles/main.styl',
    USER_DIR + '/styles/main.styl'
  ])
    .pipe(isDist ? through() : plumber())
    .pipe(concat('slides.styl'))
    .pipe(stylus({
      // Allow CSS to be imported from node_modules and bower_components
      'include css': true,
      'paths': ['./node_modules', './bower_components', './node_modules/' + pkg.name + '/node_modules']
    }))
    .pipe(autoprefixer('last 2 versions', { map: false }))
    .pipe(isDist ? csso() : through())
    .pipe(rename('slides.css'))
    .pipe(gulp.dest(DIST_DIR))
    .pipe(connect.reload())
})

gulp.task('images', ['clean:images'], () => {
  return gulp.src(USER_DIR + '/images/**/*')
    .pipe(gulp.dest(DIST_DIR + '/images'))
    .pipe(connect.reload())
})

gulp.task('favicon', () => {
  return gulp.src(USER_DIR + '/favicon.ico')
    .pipe(gulp.dest(DIST_DIR))
    .pipe(connect.reload())
})

gulp.task('clean', () => {
  return gulp.src(DIST_DIR)
    .pipe(rimraf({ force: true }))
})

gulp.task('clean:html', () => {
  return gulp.src(DIST_DIR + '/index.html')
    .pipe(rimraf({ force: true }))
})

gulp.task('clean:js', () => {
  return gulp.src(DIST_DIR + '/slides.js')
    .pipe(rimraf({ force: true }))
})

gulp.task('clean:css', () => {
  return gulp.src(DIST_DIR + '/slides.css')
    .pipe(rimraf({ force: true }))
})

gulp.task('clean:images', () => {
  return gulp.src(DIST_DIR + '/images')
    .pipe(rimraf({ force: true }))
})

gulp.task('connect', ['build'], (done) => {
  var app = connect.server({
    root: DIST_DIR,
    livereload: true
  })

  // for when https://github.com/AveVlad/gulp-connect/pull/92 is released
  app.toString() // shut up, standard!
  /*
  var io = socketio(app.server)
  io.on('connection', (socket) => {
    console.info('made connection!')
  })
  */

  opn('http://localhost:8080', done)
})

gulp.task('watch', () => {
  gulp.watch(USER_DIR + '/slides.jade', ['html'])
  gulp.watch(USER_DIR + '/styles/**/*.styl', ['css'])
  gulp.watch(USER_DIR + '/images/**/*', ['images'])
  gulp.watch([
    USER_DIR + '/scripts/**/*.js',
    USER_DIR + '/bespoke-theme-*/dist/*.js' // Allow themes to be developed in parallel
  ], ['js'])
})

gulp.task('deploy', ['build'], (done) => {
  ghpages.publish(DIST_DIR, {
    logger: gutil.log
  }, done)
})

gulp.task('build', ['js', 'html', 'css', 'images', 'favicon'])
gulp.task('serve', ['connect', 'watch'])
gulp.task('default', ['build'])
