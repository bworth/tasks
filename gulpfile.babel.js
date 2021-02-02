import gulp from 'gulp';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import eslint from 'gulp-eslint';

function buildTasks() {
	return gulp.src('tasks/**/*.js')
		.pipe(babel())
		.pipe(concat('index.js'))
		.pipe(gulp.dest('.'));
}

function lintTasks() {
	return gulp.src('tasks/**/*.js')
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
}

const tasks = gulp.series(lintTasks, buildTasks);

export { tasks };
export * from './tasks/';
