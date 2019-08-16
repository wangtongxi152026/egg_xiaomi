
const sd = require('silly-datetime');

const path = require('path');

const showdown = require('showdown');


/*
https://www.npmjs.com/package/showdown

1、安装

cnpm  install showdown --save

2、引入

var showdown  = require('showdown');


3、使用


   var converter = new showdown.Converter();
   var  text      = '# hello, markdown!';
   var  html      = converter.makeHtml(text);

*/

module.exports = {


  // parmas  时间戳          13位的时间戳
  formatTime(parmas) {

    return sd.format(new Date(parmas), 'YYYY-MM-DD HH:mm');
  },

  formatImg(dir, width, height) {

    height = height || width;
    return dir + '_' + width + 'x' + height + path.extname(dir);
  },
  formatAttr(str) {
    const converter = new showdown.Converter();
    return converter.makeHtml(str);
  },
};
