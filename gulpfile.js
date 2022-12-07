import gulp from 'gulp';
import browserSync from 'browser-sync';
import del from 'del';
import html from './gulp/compileHtml.mjs';
import styles from './gulp/compileStyles.mjs';
import js from './gulp/compileScripts.mjs';
import {copy, copyImages, copySvg} from './gulp/copyAssets.mjs';
import {svgo, sprite, createWebp, optimizeImages} from './gulp/optimizeImages.mjs';
import validateHtml from './gulp/validateHtml.mjs';

const server = browserSync.create();
const streamStyles = () => styles().pipe(server.stream());
const clean = () => del('build');
const refresh = (done) => {
  server.reload();
  done();
};

global.app = {
  isProd: process.env.NODE_ENV === 'production',
  isDev: process.env.NODE_ENV === 'development',
};


const syncServer = () => {
  server.init({
    server: 'build/',
    index: 'sitemap.html',
    notify: false,
    cors: true,
    ui: false,
    open: true,
    // port: 3001,
    // ghostMode: { clicks: false },
    // tunnel: 'project-name',
  });

  gulp.watch('source/html/**/*.html', gulp.series(html, refresh));
  gulp.watch('source/sass/**/*.{scss,sass,css}', streamStyles);
  gulp.watch('source/js/**/*.{js,json}', gulp.series(js, refresh));
  gulp.watch('source/img/**/*.svg', gulp.series(copySvg, sprite, html, refresh));
  gulp.watch('source/img/**/*.{png,jpg,webp}', gulp.series(copyImages, html, refresh));

  gulp.watch('source/**/*.php', gulp.series(copy, refresh));
  gulp.watch('source/favicon/**', gulp.series(copy, refresh));
  // gulp.watch('source/data/**/*.{js,json}', gulp.series(copy, refresh));
  // gulp.watch('source/video/**', gulp.series(copy, refresh));
  // gulp.watch('source/downloads/**', gulp.series(copy, refresh));
};

const build = gulp.series(clean, createWebp, copy, sprite, gulp.parallel(styles, js, html, svgo, optimizeImages));
const dev = gulp.series(build, syncServer);
const start = gulp.series(clean, createWebp, copy, sprite, gulp.parallel(styles, js, html), syncServer);

export {optimizeImages as imagemin, createWebp as webp, validateHtml, build, dev, start};
