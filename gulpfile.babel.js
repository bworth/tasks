import gulp from 'gulp';
import gulpif from 'gulp-if';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import eslint from 'gulp-eslint';

function build() {
	return gulp.src('tasks/**/*.js')
		.pipe(babel())
		.pipe(concat('index.js'))
		.pipe(gulp.dest('.'));
}

function lintTasks() {
	const isProduction = process.env.NODE_ENV === 'production';

	return gulp.src('tasks/**/*.js')
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(gulpif(isProduction, eslint.failAfterError()));
}

function setEnvProd(done) {
	process.env.NODE_ENV = 'production';
	done();
}

const buildTasks = gulp.series(setEnvProd, lintTasks, build);

export { buildTasks, lintTasks };
export * from './tasks/';
