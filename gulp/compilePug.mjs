import gulp from 'gulp';
import notify from 'gulp-notify';
import replace from 'gulp-replace';
import gulpif from 'gulp-if';
import plumber from 'gulp-plumber';
import cached from 'gulp-cached';
import pug from 'gulp-pug';
import typograf from 'gulp-typograf';
import imgToPicture from 'gulp-html-php-picture';
import versionNumber from 'gulp-version-number';

const compileHtml = () => {
  return gulp.src(['source/pug/pages/*.pug'])
      .pipe(plumber({
        errorHandler(err) {
          notify.onError({
            title: 'HTML Error',
            message: '<%= error.message %>',
          })(err);
        },
      }))
      .pipe(pug({
        pretty: true,
        verbose: true,
      }))
      .pipe(replace(/@img\//g, 'img/'))
      .pipe(imgToPicture({
        imgFolder: './build/img',
        // loger: false,
        // sortBySize: false
      }))
      .pipe(cached('pug'))
      .pipe(typograf({locale: ['ru', 'en-US']}))
      .pipe(gulpif(app.isProd, versionNumber({
        'value': '%DT%',
        'append': {
          'key': '_v',
          'cover': 0,
          'to': [
            'css',
            'js'
          ],
          'output': {
            'file': 'version.json',
          },
        },
      })))
      .pipe(gulp.dest('build'));
};

export default compileHtml;
