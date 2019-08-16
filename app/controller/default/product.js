'use strict'

const Controller = require('egg').Controller

class ProductController extends Controller {
  async list () {

    /*
    1、获取分类id   cid
    2、根据分类id获取当前的分类信息
    3、判断是否是顶级分类
    4、如果是二级分类自己获取二级分类下面的数据          如果是顶级分类 获取顶级分类下面的二级分类  根据二级分类获取下面所有的数据
    */

    const cid = this.ctx.request.query.cid

    // 根据分类id获取当前的分类新
    const curentCate = await this.ctx.model.GoodsCate.find({_id: cid})

    // 判断是否是顶级分类
    if (curentCate[0].pid != 0) {
      // 二级分类
      var goodsList = await this.ctx.model.Goods.find({cate_id: cid},
        '_id title price sub_title goods_img shop_price')
      console.log(goodsList)
    } else {
      // 顶级分类  获取当前顶级分类下面的所有的子分类
      const subCatesIds = await this.ctx.model.GoodsCate.find(
        {pid: this.app.mongoose.Types.ObjectId(cid)}, '_id')

      const tempArr = []
      for (let i = 0; i < subCatesIds.length; i++) {
        tempArr.push({
          cate_id: subCatesIds[i]._id
        })
      }
      var goodsList = await this.ctx.model.Goods.find({
        $or: tempArr
      }, '_id title price sub_title goods_img shop_price')
    }

    const tpl = curentCate[0].template
      ? curentCate[0].template
      : 'default/product_list.html'

    await this.ctx.render(tpl, {

      goodsList
    })

  }

  async info () {

    // 1、获取商品信息

    const id = this.ctx.request.query.id

    const productInfo = await this.ctx.model.Goods.find({_id: id})

    console.log(productInfo)

    // 2、关联商品
    const relationGoodsIds = this.ctx.service.goods.strToArray(
      productInfo[0].relation_goods)
    const relationGoods = await this.ctx.model.Goods.find({
      $or: relationGoodsIds
    }, 'goods_version shop_price')

    // 3、获取关联颜色
    const goodsColorIds = this.ctx.service.goods.strToArray(
      productInfo[0].goods_color)
    const goodsColor = await this.ctx.model.GoodsColor.find({
      $or: goodsColorIds
    })

    // 4、关联赠品
    const goodsGiftIds = this.ctx.service.goods.strToArray(
      productInfo[0].goods_gift)
    const goodsGift = await this.ctx.model.Goods.find({
      $or: goodsGiftIds
    })

    // 5、关联配件

    const goodsFittingIds = this.ctx.service.goods.strToArray(
      productInfo[0].goods_fitting)
    const goodsFitting = await this.ctx.model.Goods.find({
      $or: goodsFittingIds
    })

    // 6、当前商品关联的图片

    const goodsImageResult = await this.ctx.model.GoodsImage.find(
      {goods_id: id}).limit(8)

    // console.log(goodsImageResult);

    // 7、获取规格参数信息

    const goodsAttr = await this.ctx.model.GoodsAttr.find({goods_id: id})

    console.log(goodsAttr)

    // 8、获取更多参数  循环商品属性

    /*

      颜色:红色,白色,黄色 |  尺寸:41,42,43

        [

          { cate: '颜色', list: [ '红色', '白色', '黄色 ' ] },
          { cate: ' 尺寸', list: [ '41', '42', '43' ] }

        ]


      算法：

        var goodsAttr='颜色红色,白色,黄色 | 尺寸a41,42,43';

        if(goodsAttr&& goodsAttr.indexOf(':')!=-1){
            goodsAttr=goodsAttr.replace(/，/g,',');
            goodsAttr=goodsAttr.replace(/：/g,':');
            goodsAttr= goodsAttr.split('|');
            for( var i=0;i<goodsAttr.length;i++){
                if(goodsAttr[i].indexOf(':')!=-1){
                    goodsAttr[i]={
                        cate:goodsAttr[i].split(':')[0],
                        list:goodsAttr[i].split(':')[1].split(',')
                    };
                }else{
                    goodsAttr[i]={}
                }
            }

        }else{
          goodsAttr=[]

        }
        console.log(goodsAttr);

    */

    await this.ctx.render('default/product_info.html', {

      productInfo: productInfo[0],
      relationGoods,
      goodsColor,
      goodsGift,
      goodsFitting,
      goodsImageResult,
      goodsAttr

    })

  }

  // 根据 颜色以及商品id获取商品图片信息
  async getImagelist () {

    try {

      const color_id = this.ctx.request.query.color_id
      const goods_id = this.ctx.request.query.goods_id

      var goodsImages = await this.ctx.model.GoodsImage.find(
        {goods_id, color_id: this.app.mongoose.Types.ObjectId(color_id)})

      if (goodsImages.length == 0) {

        var goodsImages = await this.ctx.model.GoodsImage.find({goods_id}).
          limit(8)
      }

      // console.log(goodsImages);
      this.ctx.body = {success: true, result: goodsImages}

    } catch (error) {

      this.ctx.body = {success: false, result: []}

    }

  }
}

module.exports = ProductController
