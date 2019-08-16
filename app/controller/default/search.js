'use strict';

const Controller = require('egg').Controller;


var elasticsearch = require('elasticsearch');

class SearchController extends Controller {
  async index() {
    

    //增加数据
  
    // var addResult=await this.app.elasticsearch.bulk({
    //   body: [        
    //     { index:  { _index: 'news', _type: 'doc',_id:'111111111111111111'} },       
    //     { content: 'egg.js视频教程' }              
    //   ]
    // });
  


   //修改数据

  /*   var saveResult=await this.app.elasticsearch.bulk({
        body: [        
          { update: { _index: 'news', _type: 'doc', _id: 'Zb-jE2kBlC_xBU4acMWy' } },  
          { doc: { content: '使用ARM芯片的Mac将可能在2020年推出666' } },      
        ]
      });
  */


  //删除数据

  // var saveResult=await this.app.elasticsearch.bulk({
  //   body: [        
  //     { delete: { _index: 'news', _type: 'doc', _id: 'ZL-hE2kBlC_xBU4abcXB' } },
  //   ]
  // });


  //  var result=await this.app.elasticsearch.bulk({
  //   body: [        
  //     { delete: { _index: 'news', _type: 'doc', _id: '111111111111111111' } },
  //   ]
  // });



  // 搜索 查询数据


  
  // var result=await this.app.elasticsearch.search({
  //   index: 'news',
  //   type: 'doc',
  //   body: {
  //     query: {
  //       match: {
  //         content: '中国'
  //       }
  //     }
  //   }
  // })




  //分页

  // var page=3; 
  // var pageSize=2;  
  // var result=await this.app.elasticsearch.search({
  //   index: 'news',
  //   type: 'doc',
  //   from:(page-1)*pageSize ,           //skip
  //   size:pageSize,
  //   body: {
  //     query: {
  //       match: {
  //         content: '中国'
  //       }
  //     }
  //   }
  // })




  //统计总数量

  
   var result=await this.app.elasticsearch.count({
    index: 'news',
    type: 'doc',
    body: {
      query: {
        match: {
          content: '中国'
        }
      }
    }
  })


  


    this.ctx.body=result;


    // console.log(saveResult);

  }  
}

module.exports = SearchController;
