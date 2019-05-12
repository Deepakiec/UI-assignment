const gulp = require("gulp");
const babel = require("gulp-babel");
const rename = require("gulp-rename");
const styleSRC = "src/scss/style.css";
const sass = require("gulp-sass");
sass.compiler = require("node-sass");
const minify = require("gulp-minify");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const connect = require("gulp-connect");
gulp.task("build", function() {
  return gulp
    .src(["./src/**/*.js"])
    .pipe(
      babel({
        presets: [
          [
            "@babel/env",
            {
              modules: false
            }
          ]
        ]
      })
    )
    .pipe(concat("index.js"))
    .pipe(minify())
    .pipe(rename({ extName: ".min.js" }))
    .pipe(gulp.dest("./dist/js"));
});

gulp.task("sass", function() {
  return gulp
    .src(["./src/scss/*.scss"])
    .pipe(sass.sync({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(gulp.dest("./src/css"))
    .pipe(gulp.dest("./dist/css"));
});
gulp.task("start", function() {
  connect.server();
});

gulp.task("html", function() {
  return gulp
    .src(["index.html"])
    .pipe(gulp.dest("./dist/"))
    .pipe(connect.reload());
});

gulp.task("default", gulp.parallel("build", "sass", "start", "html"));
