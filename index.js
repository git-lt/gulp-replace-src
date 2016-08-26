'use strict';

const gutil   = require('gulp-util');
const through = require('through2');
const cheerio = require('cheerio');
const fs = require('fs');
const PLUGIN_NAME = "gulp-replace-src";

var PluginError = gutil.PluginError;

var tools = {
  getTimeStamp:function(){/*生成时间戳*/
    var d = new Date();
    return (d.toISOString().split('T')[0]+d.toTimeString().split(' ')[0]).replace(/[\:\-]/g, '');
  },
  isType:function(type){/*类型判断*/
    return function(o){
        return Object.prototype.toString.call(o) === '[object ' + type + ']';
    }
  }
}

var isString = tools.isType("String"),
    isObject = tools.isType("Object"),
    isArray = tools.isType("Array");

var DEFAULTS = {
  manifest:'',
  hash:true,//如果为true,文件名将会替换成添加md5后缀的新文件名，如果不设置，将给地址添加query参数 时间戳?v=20170422112122
  basePath:'',//替换之后文件的根路径，如果设置此项，css与js最终发布的根路径都将使用此配置，如果不设置，将使用原来的路径或下面独立的配置
  basePathCSS:'', //用于生成的css发布路径
  basePathJS:'', //用于生成的js发布路径

  inline:false, //是否要嵌入到页面，些配置为true时，标签必须携带 inline 属性，方便针对个别资源inline
  rootPath:'', //【必填】替换文件的根路径，如果设置此项，那么css与js的替换文件查找将使用此配置
  rootPathCSS:'', //css替换文件的根路径，用于查找css的替换文件
  rootPathJS:'', //js替换文件的根路径，用于查找js的替换文件
};

var Plugin = function(options){

  if(isObject(options)){
    options = Object.assign(DEFAULTS, options);

    if(!isObject(options.manifest)){
      throw new PluginError(PLUGIN_NAME, 'manifest must be object');
    }
    if(!options.rootPath && (!options.rootPathCSS && !options.rootPathJS)){
      throw new PluginError(PLUGIN_NAME, 'rootPath not be null');
    }
  }else{
    throw new PluginError(PLUGIN_NAME, 'options not be null');
  }

  return through.obj(function(file, enc, done) {

    if (file.isNull()) {
        this.push(file);
        return done();
    }

    if (file.isStream()) {
        this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
        return done();
    }

    // 处理文件
    var content = file.contents.toString();

    var $ = cheerio.load(content, {decodeEntities: false});

    // 获取css与js的标签
    var cssLinks = $('link'), jsLinks = $('script');

    cssLinks.each(function(){
      processURL($(this), 'css', options, fs);
    });

    jsLinks.each(function(){
      processURL($(this), 'js', options, fs);
    });

    file.contents = new Buffer($.html());

    this.push(file);

    done();
  });

  function processURL($el, type, options, fs){
    var manifestKeys = Object.keys(options.manifest);
    let attrType = type === 'css' ? 'href' : 'src';

    var href = $el.attr(attrType);

    var manifestKeyArr = manifestKeys.filter((v)=>{
      if(v.indexOf('.'+type)>-1) return v;
    });

    manifestKeyArr.forEach((v)=>{
      if(new RegExp(v).test(href)){
        // 判断是否需要inline [用于发布上线]
        if(options.inline && $el.attr('inline')===''){
          // 读取源文件 转换成 字符串
          var content = fs.readFileSync(options.rootPath+v).toString("utf-8");
          // 替换
          $el.replaceWith(type === 'css' ? `<style>\n${content}\n</style>` :`<script>\n${content}\n</script>` );
        }else{
          // 是否使用新的发布路径， 是否替换文件名， 是否添加query参数
          // 获取新的路径
          var newPath = '';
          if(options.basePathCSS || options.basePath){
            newPath = (options.basePathCSS || options.basePath)+href.substring(href.indexOf(v));
          }
          // 不使用hash文件名，就添加时间戳参数
          if(!options.hash){
            var timesp = tools.getTimeStamp();
            newPath = newPath.indexOf('?')===-1?(newPath+'?v='+timesp):(newPath+'&v='+timesp);
          }else{
            newPath = newPath.replace(v, options.manifest[v]);
          }
          $el.attr(attrType, newPath);
        }
      }})
  }
}


module.exports = Plugin;
