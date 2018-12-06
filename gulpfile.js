const gulp = require('gulp')
const plugins = require('gulp-load-plugins')()
const opn = require('opn')
const ghpages = require('gh-pages')
const path = require('path')
const fs = require('fs')
const pkg = require('./package.json')

const SRC_DIR = path.join(__dirname, 'src')
const TMP_DIR = path.join(__dirname, 'temp')
const DIST_DIR = path.join(__dirname, 'dist')
const USER_DIR = process.cwd()

const deckPkg = require(path.join(USER_DIR, 'package.json'))

const SLIDES_TITLE = deckPkg.slides && deckPkg.slides.title ? deckPkg.slides.title : deckPkg.name
const SLIDES_DESCRIPTION = deckPkg.slides && deckPkg.slides.description ? deckPkg.slides.description : deckPkg.description
const SLIDES_AUTHOR = deckPkg.slides && deckPkg.slides.author ? deckPkg.slides.author : (deckPkg.author && deckPkg.author.name ? deckPkg.author.name : '')
const SLIDES_THEME = deckPkg.slides && deckPkg.slides.theme ? deckPkg.slides.theme : 'bespoke-theme-nebula'
const SLIDES_BULLETS = deckPkg.slides && deckPkg.slides.bullets ? deckPkg.slides.bullets : '.delayed, .bullet'

gulp.task('js', ['clean:js'], () => {
  return gulp.src([
    path.join(SRC_DIR, 'js', 'main.js')
  ])
    .pipe(plugins.template({
      theme: SLIDES_THEME,
      bullets: SLIDES_BULLETS
    }))
    .pipe(plugins.rename('slides.js'))
    .pipe(plugins.achingbrain.sourcemaps.init())
    .pipe(gulp.dest(TMP_DIR))
    .pipe(plugins.webpackSourcemaps({
      resolve: {
        root: path.join(USER_DIR, 'js')
      }
    }))
    .pipe(plugins.babel({
      presets: ['es2015']
    }))
    .pipe(plugins.uglify())
    .pipe(plugins.achingbrain.sourcemaps.write())
    .pipe(gulp.dest(path.join(DIST_DIR, 'js')))
    .pipe(plugins.achingbrain.connect.reload())
})

gulp.task('html', ['clean:html', 'html:template'], () => {
  return gulp.src(path.join(TMP_DIR, 'template.jade'))
    .pipe(plugins.jade({ pretty: true }))
    .pipe(plugins.rename('index.html'))
    .pipe(gulp.dest(DIST_DIR))
    .pipe(plugins.achingbrain.connect.reload())
})

gulp.task('html:template', () => {
  return gulp.src(path.join(SRC_DIR, 'template.jade'))
    .pipe(plugins.template({
      author: SLIDES_AUTHOR,
      description: SLIDES_DESCRIPTION,
      title: SLIDES_TITLE,
      slides: fs.readFileSync(path.join(USER_DIR, 'slides.jade'), 'utf8').replace(/\n/g, '\n    ')
    }))
    .pipe(gulp.dest(TMP_DIR))
})

gulp.task('css', ['clean:css'], () => {
  return gulp.src([
    path.join(SRC_DIR, 'css', 'main.styl'),
    path.join(USER_DIR + 'css', 'main.styl'),
    path.join(USER_DIR, 'css.styl')
  ])
    .pipe(plugins.concat('slides.styl'))
    .pipe(plugins.stylus({
      // Allow CSS to be imported from node_modules and bower_components
      'include css': true,
      'paths': ['./node_modules', './bower_components', './node_modules/' + pkg.name + '/node_modules']
    }))
    .pipe(plugins.autoprefixer('last 2 versions', { map: false }))
    .pipe(plugins.csso())
    .pipe(plugins.rename('slides.css'))
    .pipe(gulp.dest(path.join(DIST_DIR, 'css')))
    .pipe(plugins.achingbrain.connect.reload())
})

gulp.task('images', ['clean:images'], () => {
  return gulp.src(path.join(USER_DIR, 'images', '**', '*'))
    .pipe(gulp.dest(path.join(DIST_DIR, 'images')))
    .pipe(plugins.achingbrain.connect.reload())
})

gulp.task('audio', ['clean:audio'], () => {
  return gulp.src(path.join(USER_DIR, 'audio', '**', '*'))
    .pipe(gulp.dest(path.join(DIST_DIR, 'audio')))
    .pipe(plugins.achingbrain.connect.reload())
})

gulp.task('video', ['clean:video'], () => {
  return gulp.src(path.join(USER_DIR, 'video', '**', '*'))
    .pipe(gulp.dest(path.join(DIST_DIR, 'video')))
    .pipe(plugins.achingbrain.connect.reload())
})

gulp.task('favicon', () => {
  return gulp.src(path.join(USER_DIR, 'favicon.ico'))
    .pipe(gulp.dest(DIST_DIR))
    .pipe(plugins.achingbrain.connect.reload())
})

gulp.task('clean', () => {
  return gulp.src([
    DIST_DIR,
    TMP_DIR
  ])
    .pipe(plugins.rimraf({ force: true }))
})

gulp.task('clean:html', () => {
  return gulp.src(path.join(DIST_DIR, 'index.html'))
    .pipe(plugins.rimraf({ force: true }))
})

gulp.task('clean:js', () => {
  return gulp.src(path.join(DIST_DIR, 'js'))
    .pipe(plugins.rimraf({ force: true }))
})

gulp.task('clean:css', () => {
  return gulp.src(path.join(DIST_DIR, 'css'))
    .pipe(plugins.rimraf({ force: true }))
})

gulp.task('clean:images', () => {
  return gulp.src(path.join(DIST_DIR, 'images'))
    .pipe(plugins.rimraf({ force: true }))
})

gulp.task('clean:audio', () => {
  return gulp.src(path.join(DIST_DIR, 'audio'))
    .pipe(plugins.rimraf({ force: true }))
})

gulp.task('clean:video', () => {
  return gulp.src(path.join(DIST_DIR, 'video'))
    .pipe(plugins.rimraf({ force: true }))
})

gulp.task('connect', ['build'], (done) => {
  var app = plugins.achingbrain.connect.server({
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
  gulp.watch(path.join(USER_DIR, 'slides.jade'), ['html'])
  gulp.watch(path.join(USER_DIR, 'css', '**', '*.styl'), ['css'])
  gulp.watch(path.join(USER_DIR, 'images', '**', '*'), ['images'])
  gulp.watch(path.join(USER_DIR, 'audio', '**', '*'), ['audio'])
  gulp.watch(path.join(USER_DIR, 'video', '**', '*'), ['video'])
  gulp.watch([
    path.join(USER_DIR, 'js', '**', '*.js'),
    path.join(USER_DIR, 'bespoke-theme-*', 'dist', '*.js') // Allow themes to be developed in parallel
  ], ['js'])
})

gulp.task('deploy', ['build'], (done) => {
  ghpages.publish(DIST_DIR, {
    logger: plugins.util.log
  }, done)
})

gulp.task('build', ['js', 'html', 'css', 'images', 'audio', 'video', 'favicon'])
gulp.task('serve', ['connect', 'watch'])
gulp.task('default', ['build'])
