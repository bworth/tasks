import gulp from 'gulp';
import gulpif from 'gulp-if';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import eslint from 'gulp-eslint';

const paths = {
	dist: 'dist/',
	tasks: 'tasks/**/*.js',
};

function buildDist() {
	return gulp.src(paths.tasks)
		.pipe(babel())
		.pipe(concat('index.js'))
		.pipe(gulp.dest(paths.dist));
}

function lint() {
	const isProduction = process.env.NODE_ENV === 'production';

	return gulp.src(paths.tasks)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(gulpif(isProduction, eslint.failAfterError()));
}

function setEnvProd(done) {
	process.env.NODE_ENV = 'production';
	done();
}

const test = gulp.series(lint);
const build = gulp.series(setEnvProd, test, buildDist);

export { build, lint, test };
