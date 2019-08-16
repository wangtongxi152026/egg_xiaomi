'use strict';

const Service = require('egg').Service;
class GoodsService extends Service {
  /*
    根据商品分类获取推荐商品
     @param {String} cate_id - 分类id
     @param {String} type -  hot  best  new
     @param {Number} limit -  数量
  */
  async get_category_recommend_goods(cate_id, type, limit) {

    try {
      let cateIdsResult = await this.ctx.model.GoodsCate.find({ pid: this.app.mongoose.Types.ObjectId(cate_id) }, '_id');
      if (cateIdsResult.length == 0) {
        cateIdsResult = [{ _id: cate_id }];
      }
      // 组装查找数据的条件
      const cateIdsArr = [];
      cateIdsResult.forEach(value => {
        cateIdsArr.push({
          cate_id: value._id,
        });
      });
      // 查找条件
      let findJson = {
        $or: cateIdsArr,
      };

      // 判断类型 合并对象
      switch (type) {
        case 'hot':
          findJson = Object.assign(findJson, { is_hot: 1 });
          break;
        case 'best':
          findJson = Object.assign(findJson, { is_best: 1 });
          break;
        case 'new':
          findJson = Object.assign(findJson, { is_new: 1 });
          break;
        default :
          findJson = Object.assign(findJson, { is_hot: 1 });
          break;
      }

      const limitSize = limit || 10;
      return await this.ctx.model.Goods.find(findJson, 'title shop_price goods_img sub_title').limit(limitSize);


    } catch (e) {
      console.log(e);
      return [];
    }

  }

  /*
    把商品id的字符串转化成数组
     @param {String} str - ids的字符串

      5bc6a8c777dc3d1c849fba47，5be3f1d322f56e2fc8a694f2,5be940719567312f28240bff

      [{_id:5bc6a8c777dc3d1c849fba47},{_id:5be3f1d322f56e2fc8a694f2}]
  */


  strToArray(str) {

    try {
      let tempIds = [];
      if (str) {
        const idsArr = str.replace(/，/g, ',').split(',');
        for (let i = 0; i < idsArr.length; i++) {
          tempIds.push({
            _id: this.app.mongoose.Types.ObjectId(idsArr[i]),
          });
        }

      } else {
        tempIds = [{ 1: -1 }];

      }
      return tempIds;


    } catch (error) {
      return [{ 1: -1 }]; // 返回一个不成立的条件
    }


  }
}

module.exports = GoodsService;
