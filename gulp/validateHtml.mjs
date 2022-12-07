import gulp from 'gulp';
import {htmlValidator} from 'gulp-w3c-html-validator';

const validateHtml = () => {
  return gulp.src('build/*.html')
      .pipe(htmlValidator.analyzer({
        url: 'https://validator.w3.org/nu/',
        ignoreLevel: 'info',
      }))
      .pipe(htmlValidator.reporter());
};

export default validateHtml;
