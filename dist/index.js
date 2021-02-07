"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inlineSources = inlineSources;
exports.test = exports.lint = exports.docs = exports.build = exports.dev = exports["default"] = void 0;

var _autoprefixer = _interopRequireDefault(require("autoprefixer"));

var _browserSync = _interopRequireDefault(require("browser-sync"));

var _cssnano = _interopRequireDefault(require("cssnano"));

var _del = _interopRequireDefault(require("del"));

var _sassdoc = _interopRequireDefault(require("sassdoc"));

var _gulp = _interopRequireDefault(require("gulp"));

var _gulpIf = _interopRequireDefault(require("gulp-if"));

var _gulpBabel = _interopRequireDefault(require("gulp-babel"));

var _gulpConcat = _interopRequireDefault(require("gulp-concat"));

var _gulpEslint = _interopRequireDefault(require("gulp-eslint"));

var _gulpFilter = _interopRequireDefault(require("gulp-filter"));

var _gulpHtmlmin = _interopRequireDefault(require("gulp-htmlmin"));

var _gulpInlineSource = _interopRequireDefault(require("gulp-inline-source"));

var _gulpJsdoc = _interopRequireDefault(require("gulp-jsdoc3"));

var _gulpPostcss = _interopRequireDefault(require("gulp-postcss"));

var _gulpSass = _interopRequireDefault(require("gulp-sass"));

var _gulpSourcemaps = _interopRequireDefault(require("gulp-sourcemaps"));

var _gulpStylelint = _interopRequireDefault(require("gulp-stylelint"));

var _gulpUglify = _interopRequireDefault(require("gulp-uglify"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var jsdocConfig = {
  opts: {
    destination: 'docs/scripts'
  },
  plugins: ['plugins/markdown'],
  recurseDepth: 10,
  source: {
    includePattern: '.+\\.js(doc|x)?$',
    excludePattern: '(^|\\/|\\\\)_'
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
      outputSourceFiles: true
    },
    linenums: true,
    monospaceLinks: false,
    navType: 'vertical',
    path: 'ink-docstrap',
    theme: 'simplex'
  }
};
var paths = {
  dest: 'build/',
  maps: '.sourcemaps/',
  "public": 'public/**/*',
  scripts: {
    all: ['gulpfile.babel.js', 'src/**/*.js'],
    doc: 'docs/scripts/',
    src: 'src/**/*.js'
  },
  styles: {
    doc: 'docs/styles/',
    src: 'src/**/*.scss'
  }
};

var server = _browserSync["default"].create();

function cleanDest() {
  return (0, _del["default"])(paths.dest);
}

function cleanDocs() {
  return (0, _del["default"])([paths.scripts.doc, paths.styles.doc]);
}

function copy() {
  var filterMarkup = (0, _gulpFilter["default"])('**/*.html', {
    restore: true
  });
  var isProduction = process.env.NODE_ENV === 'production';
  return _gulp["default"].src(paths["public"], {
    dot: true
  }).pipe(filterMarkup).pipe((0, _gulpIf["default"])(isProduction, (0, _gulpHtmlmin["default"])({
    collapseWhitespace: true
  }))).pipe(filterMarkup.restore).pipe(_gulp["default"].dest(paths.dest));
}

function deleteInlinedSource(source) {
  _del["default"].sync(paths.dest + source.sourcepath);
}

function inlineSources() {
  return _gulp["default"].src(paths.dest + '**/*.html').pipe((0, _gulpInlineSource["default"])({
    compress: false,
    handlers: [deleteInlinedSource],
    pretty: true
  })).pipe(_gulp["default"].dest(paths.dest));
}

function scripts() {
  var isProduction = process.env.NODE_ENV === 'production';
  return _gulp["default"].src(paths.scripts.src).pipe((0, _gulpIf["default"])(!isProduction, _gulpSourcemaps["default"].init())).pipe((0, _gulpBabel["default"])()).pipe((0, _gulpConcat["default"])('main.js')).pipe((0, _gulpIf["default"])(isProduction, (0, _gulpUglify["default"])())).pipe((0, _gulpIf["default"])(!isProduction, _gulpSourcemaps["default"].write(paths.maps))).pipe(_gulp["default"].dest(paths.dest));
}

function styles() {
  var isProduction = process.env.NODE_ENV === 'production';
  return _gulp["default"].src(paths.styles.src).pipe((0, _gulpIf["default"])(!isProduction, _gulpSourcemaps["default"].init())).pipe((0, _gulpSass["default"])().on('error', _gulpSass["default"].logError)).pipe((0, _gulpConcat["default"])('main.css')).pipe((0, _gulpIf["default"])(isProduction, (0, _gulpPostcss["default"])([(0, _autoprefixer["default"])(), (0, _cssnano["default"])()]), (0, _gulpPostcss["default"])([(0, _autoprefixer["default"])()]))).pipe((0, _gulpIf["default"])(!isProduction, _gulpSourcemaps["default"].write(paths.maps))).pipe(_gulp["default"].dest(paths.dest));
}

function docScripts(done) {
  _gulp["default"].src(['README.md', paths.scripts.src], {
    read: false
  }).pipe((0, _gulpJsdoc["default"])(jsdocConfig, done));
}

function docStyles() {
  return _gulp["default"].src(paths.styles.src).pipe((0, _sassdoc["default"])({
    dest: paths.styles.doc
  }));
}

function lintScripts() {
  var isProduction = process.env.NODE_ENV === 'production';
  return _gulp["default"].src(paths.scripts.all).pipe((0, _gulpEslint["default"])()).pipe(_gulpEslint["default"].format()).pipe((0, _gulpIf["default"])(isProduction, _gulpEslint["default"].failAfterError()));
}

function lintStyles() {
  var isProduction = process.env.NODE_ENV === 'production';
  return _gulp["default"].src(paths.styles.src).pipe((0, _gulpStylelint["default"])({
    failAfterError: isProduction,
    reporters: [{
      formatter: 'string',
      console: true
    }]
  }));
}

function serve(done) {
  server.init({
    server: {
      baseDir: paths.dest
    }
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
  _gulp["default"].watch(paths["public"], _gulp["default"].series(copy, reload));

  _gulp["default"].watch(paths.scripts.src, _gulp["default"].series(_gulp["default"].parallel(lintScripts, scripts), reload));

  _gulp["default"].watch(paths.styles.src, _gulp["default"].series(_gulp["default"].parallel(lintStyles, styles), reload));

  done();
}

var docs = _gulp["default"].series(cleanDocs, _gulp["default"].parallel(docScripts, docStyles));

exports.docs = docs;

var lint = _gulp["default"].parallel(lintScripts, lintStyles);

exports.lint = lint;

var test = _gulp["default"].series(lint);

exports.test = test;

var build = _gulp["default"].series(setEnvProd, cleanDest, test, _gulp["default"].parallel(copy, scripts, styles));

exports.build = build;

var dev = _gulp["default"].series(setEnvDev, _gulp["default"].parallel(cleanDest, lint), _gulp["default"].parallel(copy, scripts, styles), serve, watch);

exports.dev = exports["default"] = dev;