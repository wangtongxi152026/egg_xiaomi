'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
  async index() {


  //  this.service.sendmsg.send('15029745801','555555');


    // 轮播图
    let focus = await this.ctx.service.cache.get('index_focus');
    if (!focus) {
      focus = await this.ctx.model.Focus.find({ type: 1 });
      await this.ctx.service.cache.set('index_focus', focus, 60 * 60);

    }

    // 手机

    let shoujiResult = await this.ctx.service.cache.get('index_shoujiResult');
    if (!shoujiResult) {
      shoujiResult = await this.service.goods.get_category_recommend_goods('5bbf058f9079450a903cb77b', 'best', 8);
      await this.ctx.service.cache.set('index_shoujiResult', shoujiResult, 60 * 60);
    }

    // 电视
    const dianshiResult = await this.service.goods.get_category_recommend_goods('5bbf05ac9079450a903cb77c', 'best', 10);

    // console.timeEnd('indextime');

    await this.ctx.render('default/index', {
      focus,
      shoujiResult,
    });

  }
}

module.exports = IndexController;
