import gulp from 'gulp';
import replace from 'gulp-replace';
import rename from 'gulp-rename';
import gulpif from 'gulp-if';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'gulp-csso';
import gcmq from 'gulp-group-css-media-queries';
import atImport from 'postcss-import';
import inlineSVG from 'postcss-inline-svg';
import webpBg from 'webp-in-css/plugin.js';

const sass = gulpSass(dartSass);

const compileStyles = () =>
  gulp
      .src('source/sass/entrypoint.scss', {sourcemaps: app.isDev})
      .pipe(sass.sync(
          gulpif(app.isProd, {outputStyle: 'compressed'})
      ).on('error', sass.logError))
      .pipe(replace(/@img\//g, '../img/'))
      .pipe(postcss([
        atImport(),
        inlineSVG(),
        webpBg({
          addNoJs: true,
        }),
        autoprefixer({
        // grid: true,
        })
      ]))
      .pipe(gcmq())
      .pipe(rename('style.css'))
      .pipe(gulpif(app.isProd, gulp.dest('build/css')))
      .pipe(csso())
      .pipe(rename({
        extname: '.min.css',
      }))
      .pipe(gulp.dest('build/css', {sourcemaps: '.'}));

export default compileStyles;
