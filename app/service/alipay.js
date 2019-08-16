'use strict';

const Service = require('egg').Service;

const Alipay = require('alipay-mobile');

class AlipayService extends Service {
  async doPay(orderData) {


    return new Promise((resolve,reject)=>{
     
          //实例化 alipay
          const service = new Alipay(this.config.alipayOptions);        
          
          //获取返回的参数
          // this.config.alipayBasicParams

          service.createPageOrderURL(orderData, this.config.alipayBasicParams)
          .then(result => {
            console.log(result);
            resolve(result.data);
         
          })
    })

      
  }


  //验证异步通知的数据是否正确
  alipayNotify(params){

    //实例化 alipay
    const service = new Alipay(this.config.alipayOptions);        
          
    return service.makeNotifyResponse(params);


  }

}

module.exports = AlipayService;
