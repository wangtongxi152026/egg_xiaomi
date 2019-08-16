'use strict';


/*

cnpm install request crypto xml2js --save


cnpm install qr-image --save


*/


var wechatPay = require('../lib/wechatPay.js');

const qr = require('qr-image');

const Service = require('egg').Service;

class WeixinpayService extends Service {
  async doPay(orderData) {
    
       return new Promise((resove)=>{

            var pay=new wechatPay(this.config.weixinPayConfig);

            var notify_url=this.config.weixinpayBasicParams.notify_url;

            var out_trade_no=orderData.out_trade_no;

            var title=orderData.title;

            var price=orderData.price*100;

            var ip=this.ctx.request.ip.replace(/::ffff:/, '');       
            
                
            pay.createOrder({
                    openid:'',
                    notify_url : notify_url, //微信支付完成后的回调
                    out_trade_no : out_trade_no, //订单号
                    attach : title,
                    body : title,
                    total_fee : price.toString(), // 此处的额度为分
                    spbill_create_ip :ip
            }, function (error, responseData) {
                    console.log(responseData);
                    if(error){
                            console.log(error);
                    }
                    resove(responseData.code_url)
                   
            });

       })

  }

  async qrImage(url){

    var qrimg = qr.image(url, { type: 'png'});

    return qrimg;

  }


  /*params微信官方post的数据*/
  weixinpayNotify(params){
    
     
        var pay=new wechatPay(this.config.weixinPayConfig);

        var notifyObj=params;
        var signObj={};
        for(var attr in notifyObj){
                if(attr !='sign'){
                      signObj[attr]=notifyObj[attr]
                }
        }
        var sign= pay.getSign(signObj);
        return sign;

  }
}

module.exports = WeixinpayService;
