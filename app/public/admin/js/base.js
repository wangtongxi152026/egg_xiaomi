$(function() {

  app.init();
});


var app = {


  init() {
    this.toggleAside();

    this.deleteConfirm();


    // this.resizeIframe();

  },

  deleteConfirm() {
    $('.delete').click(function() {

      const flag = confirm('您确定要删除吗?');

      return flag;

    });

  },

  resizeIframe() {

    const heights = document.documentElement.clientHeight - 100;

    document.getElementById('rightMain').height = heights;
  },

  toggleAside() {


    $('.aside>li:nth-child(1) ul,.aside>li:nth-child(2) ul,.aside>li:nth-child(3) ul').hide();

    $('.aside h4').click(function() {


      if ($(this).find('span').hasClass('nav_close')) {

        $(this).find('span').removeClass('nav_close')
          .addClass('nav_open');
      } else {

        $(this).find('span').removeClass('nav_open')
          .addClass('nav_close');
      }

      $(this).siblings('ul').slideToggle();
    });
  },

  changeStatus(el, model, attr, id) {


    $.get('/admin/changeStatus', { model, attr, id }, function(data) {


      if (data.success) {
        if (el.src.indexOf('yes') != -1) {
          el.src = '/public/admin/images/no.gif';
        } else {
          el.src = '/public/admin/images/yes.gif';
        }

      }

    });
  },
  editNum(el, model, attr, id) {

    const val = $(el).html();

    const input = $("<input value='' />");


    // 把input放在sapn里面
    $(el).html(input);

    // 让input获取焦点  给input赋值
    $(input).trigger('focus').val(val);


    // 点击input的时候阻止冒泡
    $(input).click(function() {

      return false;
    });
    // 鼠标离开的时候给sapn赋值
    $(input).blur(function() {

      const num = $(this).val();

      $(el).html(num);

      // console.log(model,attr,id)


      $.get('/admin/editNum', { model, attr, id, num }, function(data) {

        console.log(data);
      });

    });


  },
};

