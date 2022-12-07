import gulp from 'gulp';
import newer from 'gulp-newer';
import rename from 'gulp-rename';
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import svgstore from 'gulp-svgstore';

const svgo = () =>
  gulp
      .src('build/img/**/*.svg')
      .pipe(
          imagemin([
            imagemin.svgo({
              plugins: [
                {removeViewBox: false},
                {removeRasterImages: true},
                {removeUselessStrokeAndFill: false}
              ],
            })
          ])
      )
      .pipe(gulp.dest('build/img'));

const sprite = () =>
  gulp
      .src('source/img/sprite/*.svg')
      .pipe(svgstore({inlineSvg: true}))
      .pipe(rename('sprite.svg'))
      .pipe(gulp.dest('build/img'));

//  Optional tasks
//  ---------------------------------

const createWebp = () => {
  const root = 'bg';
  return gulp
      .src(`source/img/${root}/**/*.{png,jpg}`)
      .pipe(newer(`source/img/${root}/**/*`))
      .pipe(webp({quality: 90}))
      .pipe(gulp.dest(`source/img/${root}`));
};

const optimizeImages = () =>
  gulp
      .src('build/img/**/*.{png,jpg}')
      .pipe(
          imagemin([
            imagemin.optipng({optimizationLevel: 3}),
            imagemin.mozjpeg({quality: 75, progressive: true})
          ])
      )
      .pipe(gulp.dest('build/img'));

export {svgo, sprite, createWebp, optimizeImages};
