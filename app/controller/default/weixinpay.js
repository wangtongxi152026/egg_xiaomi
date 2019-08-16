'use strict';

const Controller = require('egg').Controller;


const xml2js = require('xml2js').parseString;


class WeixinpayController extends Controller {
  async pay() {
    
   

    var d=new Date();
    const data = {
        title: '辣条111',             
        out_trade_no: d.getTime().toString(),
        price: '0.1'     
    }

    var code_url=await this.service.weixinpay.doPay(data);  

    //调用方法生成二维码

    var qrImage=await this.service.weixinpay.qrImage(code_url);

    this.ctx.type = 'image/png';
    this.ctx.body=qrImage;



  }

//异步通知
  async weixinpayNotify(){
    


        let that = this;     
        let data = '';               
        this.ctx.req.on('data',function(chunk){
          data += chunk;
        });
        
        this.ctx.req.on('end',function(){
            xml2js(data,{explicitArray:false}, function (err, json) {
                console.log(json);//这里的json便是xml转为json的内容

                var mySign=that.service.weixinpay.weixinpayNotify(json.xml);



                console.log(mySign);

                console.log('-------------');


                console.log(json.xml.sign);

               
            });
            
        });


  }
}

module.exports = WeixinpayController;
