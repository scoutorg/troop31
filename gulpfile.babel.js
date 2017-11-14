import gulp from "gulp";
import cp from "child_process";
import gutil from "gulp-util";
import postcss from "gulp-postcss";
import cssImport from "postcss-import";
import cssnext from "postcss-cssnext";
import BrowserSync from "browser-sync";
import webpack from "webpack";
import webpackConfig from "./webpack.conf";
import svgstore from "gulp-svgstore";
import svgmin from "gulp-svgmin";
import inject from "gulp-inject";
import cssnano from "cssnano";
import Assets from "gulp-asset-hash";
import del from "del";
import template from "gulp-template";

// import replace from "gulp-replace";

const browserSync = BrowserSync.create();
const hugoBin = `./bin/hugo.${process.platform === "win32" ? "exe" : process.platform}`;
const defaultArgs = ["-d", "../dist", "-s", "site"];

gulp.task("clean", (cb) => {
  del([
    "dist",
    "site/data/assetManifest.json",
    "site/data/manifest.json"
  ], {
    dot: true
  }, cb);
});

gulp.task("hugo", ["css", "js", "cms-assets"], (cb) => buildSite(cb));
gulp.task("hugo-preview", ["css", "js", "cms-assets"], (cb) => buildSite(cb, ["--buildDrafts", "--buildFuture"]));
gulp.task("build", ["css", "js", "cms-assets", "hugo", "headers"]);
gulp.task("build-preview", ["css", "js", "cms-assets", "hugo-preview", "headers"]);

gulp.task("headers", ["css", "js", "cms-assets"], (cb) => {
  var manifest = require("./site/data/manifest.json");
  var assetManifest = require("./site/data/assetManifest.json");

  return gulp.src("src/_headers")
    .pipe(template({manifest: manifest, assetManifest: assetManifest}))
    .pipe(gulp.dest("dist"));
});

gulp.task("css", () => (
  gulp.src("./src/css/*.css")
    .pipe(postcss([
      cssImport({from: "./src/css/main.css"}),
      cssnext(),
      cssnano(),
    ]))
    .pipe(Assets.hash({
      manifest: "site/data/assetManifest.json",
      hashKey: "7h4e",
      hasher: "md5"
    }))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream())
));

gulp.task("cms-assets", () => (
  gulp.src("./node_modules/netlify-cms/dist/*.{woff,eot,woff2,ttf,svg,png}")
    .pipe(gulp.dest("./dist/css"))
));

gulp.task("js", (cb) => {
  const myConfig = Object.assign({}, webpackConfig);

  webpack(myConfig, (err, stats) => {
    if (err) { throw new gutil.PluginError("webpack", err); }
    gutil.log("[webpack]", stats.toString({colors: true, progress: true}));
    browserSync.reload();
    cb();
  });
});

gulp.task("svg", () => {
  const svgs = gulp
    .src("site/static/img/icons/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({inlineSvg: true}));

  function fileContents(filePath, file) {
    return file.contents.toString();
  }

  return gulp
    .src("site/layouts/partials/svg.html")
    .pipe(inject(svgs, {transform: fileContents}))
    .pipe(gulp.dest("site/layouts/partials/"));
});

gulp.task("server", ["hugo", "css", "cms-assets", "js", "svg"], () => {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  gulp.watch("./src/js/**/*.js", ["js"]);
  gulp.watch("./src/css/**/*.css", ["css"]);
  gulp.watch("./site/static/img/icons/*.svg", ["svg"]);
  gulp.watch("./site/**/*", ["hugo"]);
});

function buildSite(cb, options) {
  const args = options ? defaultArgs.concat(options) : defaultArgs;

  return cp.spawn(hugoBin, args, {stdio: "inherit"}).on("close", (code) => {
    if (code === 0) {
      browserSync.reload("notify:false");
      cb();
    } else {
      browserSync.notify("Hugo build failed :(");
      cb("Hugo build failed");
    }
  });
}
