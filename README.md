## 功能

将页面中css或js的路径，替换成 `gulp-rev` 生成的文件路径，或者将css或js内容嵌入到页面

## Install

```bash
npm install --save-dev gulp-replace-src
```

## Usage

假如初始目录结构如下：
```
.
└── src
    ├── index.css
    ├── index.html
    └── index.js
```
构建后

```
.
├── src
│   ├── index.css
│   ├── index.html
│   └── index.js
├── dist
│   ├── index-2e878f392c.css
│   ├── index-46c50a1b39.js
│   ├── index.css
│   ├── index.js
│   └── rev-manifest.json
├── gulpfile.js
├── index.html
└── package.json
```

部分代码示例，详情看 `example` 目录下的例子

```js
var DEBUG = false;

gulp.task("build:css", function() {
  return gulp.src('src/index.css')
    .pipe(autoprefixer({
          browsers: ['last 2 Chrome versions', 'safari 5', 'ios 7', 'android 4'],
          cascade: false
    }))
    .pipe(postcss([px2rem({remUnit: 75})]))
    .pipe(gulpif(!DEBUG, csso()))
    .pipe(gulp.dest("dist/"));
});

gulp.task("build:js", function() {
  return gulp.src('src/index.js')
    .pipe(gulpif(!DEBUG, uglify()))
    .pipe(gulp.dest('dist/'));
});

gulp.task("version", function() {
  return gulp.src(['dist/*.css','dist/*.js'])
    .pipe(rev())
    .pipe(gulp.dest('dist/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist/'));
});

gulp.task('clean', function(){
  return gulp.src(['dist/*.*',], {read: false})
    .pipe(clean());
})

gulp.task("replace", function() {
  var manifest = JSON.parse(fs.readFileSync('dist/rev-manifest.json').toString("utf-8"));

  gulp.src('src/index.html')
    .pipe(srcReplace({
      manifest: manifest,
      rootPath: 'dist/',
      basePath: 'dist/',
      hash: false,
      inline: !DEBUG
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('default',['clean'],function(done){
  gulpSequence('build:css', 'build:js', 'version', 'replace', done);
})
```

这里如果 `DEBUG=true`, 路径不会被inline，`hash=true` 替换成新的文件名

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>示例</title>
    <link rel="stylesheet" href="dist/index-10017c60ef.css" inline charset="utf-8">
  </head>
  <body>
    <div class="demo">
      示例
    </div>
    <div class="img size60"></div>
    <script src="dist/index-512b43116a.js" charset="utf-8" inline></script>
  </body>
</html>

```

`hash=false`, 添加时间戳参数

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>示例</title>
    <link rel="stylesheet" href="dist/index.css?v=20160826000229" inline="" charset="utf-8">
  </head>
  <body>
    <div class="demo">
      示例
    </div>
    <div class="img size60"></div>
    <script src="dist/index.js?v=20160826000229" charset="utf-8"></script>
  </body>
</html>

```

`DEBUG=false` 时， inline=true，此时直接将构建好的源文件inline到页面中

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>示例</title>
    <style>
body{background:#f4f4f4;color:#333;font-family:"Helvetica Neue",Helvetica,Microsoft YaHei,Arial,sans-serif;font-size:.186667rem;line-height:1.27;-webkit-text-size-adjust:100%!important;-webkit-user-select:none;user-select:none;-webkit-font-smoothing:antialiased}
</style>
  </head>
  <body>
    <div class="demo">
      示例
    </div>
    <div class="img size60"></div>
    <script>
function onDisplay(e){"none"==document.getElementById(e).style.display?$show(e):$hide(e)}function onLabelTxt(e,t,n,o){"none"==document.getElementById(e).style.display?($show(e),document.getElementById(t).value=o):($hide(e),document.getElementById(t).value=n)}
</script>
  </body>
</html>

```

## options

```javascript
{
  manifest:{},
  hash:false, //如果为true,文件名将会替换成添加md5后缀的新文件名，如果不设置，将给地址添加query参数 时间戳?v=20170422112122
  basePath:'', //替换之后文件的根路径，如果设置此项，css与js最终发布的根路径都将使用此配置，如果不设置，将使用原来的路径或下面独立的配置
  basePathCSS:'', //用于生成的css发布路径
  basePathJS:'', //用于生成的js发布路径

  inline:true, //是否要嵌入到页面，些配置为true时，标签必须携带 inline 属性，方便针对个别资源inline
  rootPath:'', //【必填】替换文件的根路径，如果设置此项，那么css与js的替换文件查找将使用此配置
  rootPathCSS:'', //css替换文件的根路径，用于查找css的替换文件
  rootPathJS:'', //js替换文件的根路径，用于查找js的替换文件
}
```
