'use strict';

const Controller = require('egg').Controller;

class BuyController extends Controller {

  // 去结算
  async checkout() {

    // 获取购物车选中的商品

    let orderList = [];
    let allPrice = 0;
    let cartList = this.service.cookies.get('cartList');


    //签名防止重复提交订单
    var orderSign=await this.service.tools.md5(await this.service.tools.getRandomNum());
    this.ctx.session.orderSign=orderSign;
      

    if (cartList && cartList.length > 0) {

      for (let i = 0; i < cartList.length; i++) {

        if (cartList[i].checked) {
          orderList.push(cartList[i]);

          allPrice += cartList[i].price * cartList[i].num;
        }

      }

      // 获取当前用户的所有收货地址

      const uid = this.ctx.service.cookies.get('userinfo')._id;
      const addressList = await this.ctx.model.Address.find({ uid }).sort({ default_address: -1 });


      await this.ctx.render('default/checkout.html', {
        orderList,
        allPrice,
        addressList,
        orderSign:orderSign
      });

    } else {
      // 恶意操作
      this.ctx.redirect('/cart');
    }


  }


  //提交订单


  async doOrder(){

    /*
      1、获取收货地址信息

      2、需要获取购买商品的信息

      3、把这些信息  放在订单表  
            
      4、删除购物车里面的数据    
    */

    /*防止提交重复订单*/
    var orderSign=this.ctx.request.body.orderSign;
    if(orderSign!=this.ctx.session.orderSign){
      return false;
    }
    this.ctx.session.orderSign=null;


     const uid = this.ctx.service.cookies.get('userinfo')._id;
     let addressResult = await this.ctx.model.Address.find({ "uid":uid,"default_address":1 });     
     let cartList = this.service.cookies.get('cartList');
     if(addressResult && addressResult.length>0 && cartList && cartList.length>0){

        var all_price=0;

        let orderList=cartList.filter((value)=>{
            if(value.checked){
              
              all_price+=value.price*value.num;
              return value;
            }
        })

        //执行提交订单的操作

        let order_id=await this.service.tools.getOrderId();  
        let name=addressResult[0].name;
        let phone=addressResult[0].phone;
        let address=addressResult[0].address;
        let zipcode =addressResult[0].zipcode;
        let pay_status=0;
        let pay_type='';
        let order_status=0;

       
        let orderModel=new this.ctx.model.Order({order_id,uid,name,phone,address,zipcode,pay_status,pay_type,order_status,all_price});
        let orderResult=await orderModel.save();

        if(orderResult && orderResult._id){


            //增加商品信息

            for(let i=0;i<orderList.length;i++){           

                let json={

                  "uid":uid,
                  "order_id":orderResult._id,   //订单id
                  "product_title":orderList[i].title,
                  "product_id":orderList[i]._id,
                  "product_img":orderList[i].goods_img,
                  "product_price":orderList[i].price,                
                  "product_num":orderList[i].num  
                }           

                let orderItemModel=new this.ctx.model.OrderItem(json);
                await orderItemModel.save();

            }


            //删除购物车中已经购买的商品             
          
            var unCheckedCartList=cartList.filter((value)=>{
                if(!value.checked){
                  return value;
                }
            })

            this.service.cookies.set('cartList', unCheckedCartList);            
            

           this.ctx.redirect('/buy/confirm?id='+orderResult._id);


        }else{
          this.ctx.redirect('/buy/checkout');
        }

    }else{


      this.ctx.redirect('/buy/checkout');
    }
      








      console.log('提交订单');

  }

  // 确认订单  支付
  async confirm() {

    
    var id=this.ctx.request.query.id;


    var orderResult=await this.ctx.model.Order.find({"_id":id});

    if(orderResult && orderResult.length>0){


      //获取商品

      var orderItemResult=await this.ctx.model.OrderItem.find({"order_id":id});      


       await this.ctx.render('default/confirm.html',{
          orderResult:orderResult[0],
          orderItemResult:orderItemResult,
          id:id

       });    

    }else{
      //错误
      this.ctx.redirect('/');
    }

  }


  //执行多次
  async  getOrderPayStatus(){

    /*

     1、获取订单号
    
     2、查询当前订单的支付状态

     3、如果支付 返回成功   如果没有支付返回失败信息


    */

    var id=this.ctx.request.query.id;

    if(id){
       try {

          var orderReuslt=await this.ctx.model.Order.find({"_id":id});
          if(orderReuslt && orderReuslt[0].pay_status==1 && orderReuslt[0].order_status==1 ){
              this.ctx.body={
                success:true,
                message:'已支付'
              }

          }else{
            this.ctx.body={
              success:false,
              message:'未支付'
            }
          }
         
       } catch (error) {
         
          this.ctx.body={
            success:false,
            message:'未支付'
          }
       }

    }else{
      this.ctx.body={
        success:false,
        message:'未支付'
      }

    }

  }
}

module.exports = BuyController;
