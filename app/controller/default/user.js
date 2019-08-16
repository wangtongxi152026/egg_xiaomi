'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
 
  async welcome() {   
    await this.ctx.render('default/user/welcome.html');
  }

  async order() {    
    const uid = this.ctx.service.cookies.get('userinfo')._id;
    const page = this.ctx.request.query.page || 1;
    var order_status=this.ctx.request.query.order_status || -1;
    var keywords=this.ctx.request.query.keywords;


    

    var json={"uid":this.app.mongoose.Types.ObjectId(uid)};   //查询当前用户下面的所有订单    
    //筛选
    if(order_status!=-1){        
        json=Object.assign(json,{"order_status":parseInt(order_status)});
    }
    //搜索
    if(keywords){
        var orderItemJson=Object.assign({"uid":this.app.mongoose.Types.ObjectId(uid)},{"product_title":{$regex:new RegExp(keywords)}});
        var orderItemResult=await this.ctx.model.OrderItem.find(orderItemJson);       
        if(orderItemResult.length>0){
            var tempArr=[];
            orderItemResult.forEach(value => {
              tempArr.push({
                _id: value.order_id
              });
            });            
            json=Object.assign(json,{
              $or:tempArr
            })
            /*            
             { uid: 5c10c2dfd702ac47bc58ab45,
              '$or':
              [ { _id: 5c41955b10f6400bb0c850ab },
                { _id: 5c42a48be6389d22a4396833 } ] }

            */

        }else{
          json=Object.assign(json,{
            $or:[{1:-1}]
          })
        }

    }   
    const pageSize = 5;
    // 总数量
    const totalNum = await this.ctx.model.Order.find(json).countDocuments();   
    //聚合管道要注意顺序
    const result = await this.ctx.model.Order.aggregate([
      {
        $lookup: {
          from: 'order_item',
          localField: '_id',
          foreignField: 'order_id',
          as: 'orderItems',
        },
      },
      {
        $sort: {"add_time":-1}
      },
      {
        $match:json    //条件
      },
      {
        $skip: (page - 1) * pageSize,
      },
      {
        $limit: pageSize,
      }     
    ]); 

    await this.ctx.render('default/user/order.html', {
      list: result,
      totalPages: Math.ceil(totalNum / pageSize),
      page,
      order_status:order_status
    });


  }
  
  async orderinfo() {
    // this.ctx.body = '用户订单';



    const uid = this.ctx.service.cookies.get('userinfo')._id;
    const id = this.ctx.request.query.id;
    
    var orderResult=await this.ctx.model.Order.find({"uid":uid,"_id":id});


    //不可扩展对象的解决方法
    orderResult=JSON.parse(JSON.stringify(orderResult));

    orderResult[0].orderItems=await this.ctx.model.OrderItem.find({"order_id":id});

    await this.ctx.render('default/user/order_info.html',{

      orderInfo:orderResult[0]
    });
  }


  async address() {
    this.ctx.body = '收货地址';

  }
}

module.exports = UserController;
