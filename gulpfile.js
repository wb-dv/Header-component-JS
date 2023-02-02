import gulp from 'gulp';

import { path } from './gulp/config/path.js';
import { reset } from './gulp/tasks/reset.js';
import { html } from './gulp/tasks/html.js';
import { plugins } from './gulp/config/plugins.js';
import { server } from './gulp/tasks/server.js';
import { scss } from './gulp/tasks/scss.js';
import { js } from './gulp/tasks/js.js';
import { images, moveBasicSVG } from './gulp/tasks/images.js';
import {
  otfToTtf,
  ttfToWoff,
  moveWoff,
  fontsStyle,
} from './gulp/tasks/fonts.js';
import { svgSprite } from './gulp/tasks/svgSprite.js';
import { zip } from './gulp/tasks/zip.js';
import { ftp } from './gulp/tasks/ftp.js';

global.app = {
  path: path,
  gulp: gulp,
  plugins: plugins,
  isBuild: process.argv.includes('--build'),
  isDev: !process.argv.includes('--build'),
};

function watcher() {
  gulp.watch(path.watch.html, html);
  gulp.watch(path.watch.scss, scss);
  gulp.watch(path.watch.js, js);
  gulp.watch(path.watch.images, images);
  gulp.watch(path.watch.images, moveBasicSVG);
}

export { svgSprite };

const fonts = gulp.series(otfToTtf, ttfToWoff, moveWoff, fontsStyle);

const mainTasks = gulp.series(
  fonts,
  gulp.parallel(html, scss, js, images, moveBasicSVG)
);

const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);
const deployZip = gulp.series(reset, mainTasks, zip);
const deployFTP = gulp.series(reset, mainTasks, ftp);

export { dev };
export { build };
export { deployZip };
export { deployFTP };

gulp.task('default', dev);
