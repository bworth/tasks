import gulp from 'gulp';
import babel from 'gulp-babel';
import concat from 'gulp-concat';

function tasks() {
	return gulp.src('tasks/**/*.js')
		.pipe(babel())
		.pipe(concat('index.js'))
		.pipe(gulp.dest('.'));
}

export { tasks };
export * from './tasks/';
