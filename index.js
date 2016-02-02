const gulp = require('gulp')
require('./gulpfile')

const yargs = require('yargs')
  .usage('slides <command>')
  .command('present', 'Compiles your deck, starts a web server and opens your browser')
  .command('publish', 'Pubishes your deck to the gh-pages branch of your repo')
  .demand(1, 'Please specify a command')

const command = yargs.argv._[0]

if (command === 'present') {
  gulp.start('serve')
} else if (command === 'publish') {
  gulp.start('deploy')
} else {
  yargs.showHelp()
  console.info('Please specify a command')
}
