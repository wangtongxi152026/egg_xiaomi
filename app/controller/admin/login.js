'use strict';


const BaseController = require('./base.js');

class LoginController extends BaseController {
  async index() {

    await this.ctx.render('admin/login');
  }

  // 执行登录的方法  post
  async doLogin() {

    console.log(this.ctx.request.body);


    const username = this.ctx.request.body.username;
    const password = await this.service.tools.md5(this.ctx.request.body.password);
    const code = this.ctx.request.body.code;


    // console.log(username,password,code);

    if (code.toUpperCase() == this.ctx.session.code.toUpperCase()) {

      const result = await this.ctx.model.Admin.find({ username, password });

      if (result.length > 0) {

        // 登录成功

        // 1、保存用户信息
        this.ctx.session.userinfo = result[0];

        // 2、跳转到用户中心
        this.ctx.redirect('/admin');
      } else {
        await this.error('/admin/login', '用户名或者密码不对');
      }


    } else {

      // 注意：异步和  await
      await this.error('/admin/login', '验证码错误');

    }


    /*

      注意：1、需要在前端页面用js验证用户输入的信息是否正确     2、后台获取数据以后判断数据格式是否正确


      1、获取表单提交的数据

      2、判断验证码是否正确

      验证码正确

          1、要对表单里面的密码进行md5加密               md5模块  https://www.npmjs.com/package/md5

                                                            1、安装 cnpm install md5 --save

                                                            2、引入md5 var md5 = require('md5');

                                                            3、使用  md5(str)


          2、在用户表（集合）中查询当前用户是否存在                 （mongoose操作mongodb数据库）https://www.npmjs.com/package/egg-mongoose

                                                                  1、配置mongoose

                                                                  2、创建操作数据库的model


          3、如果数据库有此用户（登录成功） ：保存用户信息     跳转到后台管理系统

          4、如果数据库有此用户（登录失败）： 跳转到登录页面


       验证码错误： 跳转到登录页面   提示验证码不正确


      */


  }


  async loginOut() {
    this.ctx.session.userinfo = null;
    this.ctx.redirect('/admin/login');
  }

}

module.exports = LoginController;
