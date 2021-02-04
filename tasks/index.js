import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
import cssnano from 'cssnano';
import del from 'del';
import sassdoc from 'sassdoc';

import gulp from 'gulp';
import gulpif from 'gulp-if';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import eslint from 'gulp-eslint';
import filter from 'gulp-filter';
import htmlmin from 'gulp-htmlmin';
import inlinesource from 'gulp-inline-source';
import jsdoc from 'gulp-jsdoc3';
import postcss from 'gulp-postcss';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import stylelint from 'gulp-stylelint';
import uglify from 'gulp-uglify';

const jsdocConfig = {
	opts: {
		destination: 'docs/scripts',
	},
	plugins: ['plugins/markdown'],
	recurseDepth: 10,
	source: {
		includePattern: '.+\\.js(doc|x)?$',
		excludePattern: '(^|\\/|\\\\)_',
	},
	sourceType: 'module',
	tags: {
		allowUnknownTags: true,
		dictionaries: ['jsdoc', 'closure']
	},
	templates: {
		cleverLinks: false,
		dateFormat: 'MMMM Do YYYY, h:mm:ss a',
		'default': {
			outputSourceFiles: true,
		},
		linenums: true,
		monospaceLinks: false,
		navType: 'vertical',
		path: 'ink-docstrap',
		theme: 'simplex',
	},
};
const paths = {
	dest: 'build/',
	maps: '.sourcemaps/',
	public: 'public/**/*',
	scripts: {
		all: ['gulpfile.babel.js', 'src/**/*.js'],
		doc: 'docs/scripts/',
		src: 'src/**/*.js',
	},
	styles: {
		doc: 'docs/styles/',
		src: 'src/**/*.scss',
	},
};
const server = browserSync.create();

function cleanDest() {
	return del(paths.dest);
}

function cleanDocs() {
	return del([paths.scripts.doc, paths.styles.doc]);
}

function copy() {
	const filterMarkup = filter('**/*.html', { restore: true });
	const isProduction = process.env.NODE_ENV === 'production';

	return gulp.src(paths.public, { dot: true })
		.pipe(filterMarkup)
		.pipe(gulpif(isProduction, htmlmin({ collapseWhitespace: true })))
		.pipe(filterMarkup.restore)
		.pipe(gulp.dest(paths.dest));
}

function deleteInlinedSource(source) {
	del.sync(paths.dest + source.sourcepath);
}

function inlineSources() {
	return gulp.src(paths.dest + '**/*.html')
		.pipe(inlinesource({ compress: false, handlers: [deleteInlinedSource], pretty: true }))
		.pipe(gulp.dest(paths.dest));
}

function scripts() {
	const isProduction = process.env.NODE_ENV === 'production';

	return gulp.src(paths.scripts.src)
		.pipe(gulpif(!isProduction, sourcemaps.init()))
		.pipe(babel())
		.pipe(concat('main.js'))
		.pipe(gulpif(isProduction, uglify()))
		.pipe(gulpif(!isProduction, sourcemaps.write(paths.maps)))
		.pipe(gulp.dest(paths.dest));
}

function styles() {
	const isProduction = process.env.NODE_ENV === 'production';

	return gulp.src(paths.styles.src)
		.pipe(gulpif(!isProduction, sourcemaps.init()))
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('main.css'))
		.pipe(gulpif(isProduction,
			postcss([autoprefixer(), cssnano()]),
			postcss([autoprefixer()])))
		.pipe(gulpif(!isProduction, sourcemaps.write(paths.maps)))
		.pipe(gulp.dest(paths.dest));
}

function docScripts(done) {
	gulp.src(['README.md', paths.scripts.src], { read: false })
		.pipe(jsdoc(jsdocConfig, done));
}

function docStyles() {
	return gulp.src(paths.styles.src)
		.pipe(sassdoc({ dest: paths.styles.doc }));
}

function lintScripts() {
	const isProduction = process.env.NODE_ENV === 'production';

	return gulp.src(paths.scripts.all)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(gulpif(isProduction, eslint.failAfterError()));
}

function lintStyles() {
	const isProduction = process.env.NODE_ENV === 'production';

	return gulp.src(paths.styles.src)
		.pipe(stylelint({
			failAfterError: isProduction,
			reporters: [
				{ formatter: 'string', console: true },
			],
		}));
}

function serve(done) {
	server.init({
		server: {
			baseDir: paths.dest,
		},
	});
	done();
}

function reload(done) {
	server.reload();
	done();
}

function setEnvDev(done) {
	process.env.NODE_ENV = 'development';
	done();
}

function setEnvProd(done) {
	process.env.NODE_ENV = 'production';
	done();
}

function watch(done) {
	gulp.watch(paths.public, gulp.series(copy, reload));
	gulp.watch(paths.scripts.src, gulp.series(gulp.parallel(lintScripts, scripts), reload));
	gulp.watch(paths.styles.src, gulp.series(gulp.parallel(lintStyles, styles), reload));
	done();
}

const docs = gulp.series(cleanDocs, gulp.parallel(docScripts, docStyles));
const lint = gulp.parallel(lintScripts, lintStyles);
const test = gulp.series(lint);

const build = gulp.series(setEnvProd, cleanDest, test, gulp.parallel(copy, scripts, styles));
const dev = gulp.series(setEnvDev, gulp.parallel(cleanDest, lint), gulp.parallel(copy, scripts, styles), serve, watch);

export { dev as default, build, dev, docs, inlineSources, lint, test };
