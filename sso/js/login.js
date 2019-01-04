layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer
    $ = layui.jquery;

    //获取用户名
    var getName = localStorage.getItem("userName");
    if (getName) {
        $("#userName").val(getName);
        $("#userName").parent().addClass("layui-input-focus");
    } else {
        $("#userName").parent().removeClass("layui-input-focus");
    }

    //登录按钮
    form.on("submit(login)", function (data) {
        //储存用户名
        localStorage.setItem("userName", $("#userName").val());

        var data_arr = {};
        data_arr.userCode = $("#userName").val();
        data_arr.mechanismCode = $("#code").val();
        data_arr.password = $("#password").val();

        $.ajax({
            type: "post",
            url: ajaxUrl + "/sysUser/login",
            data: data_arr,
            dataType: "json",
            success: function (response) {
                console.log(response);
                if (response.status == 0) {
                    layui.use('layer', function () {
                        var layer = layui.layer;
                        layer.msg(response.returnMsg);
                    });
                } else if (response.status == 1) {
                    localStorage.setItem("r_data", response.data);
                    $(".layui-btn").text("登录中...").attr("disabled", "disabled").addClass("layui-disabled");
                    setTimeout(function () {
                        window.location.href = "index.html";
                    }, 1000);
                    return false;
                }
            }
        });
    })


    //表单输入效果
    $(".loginBody .input-item").click(function (e) {
        e.stopPropagation();
        $(this).addClass("layui-input-focus").find(".layui-input").focus();
    })
    $(".loginBody .layui-form-item .layui-input").focus(function () {
        $(this).parent().addClass("layui-input-focus");
    })
    $(".loginBody .layui-form-item .layui-input").blur(function () {
        $(this).parent().removeClass("layui-input-focus");
        if ($(this).val() != '') {
            $(this).parent().addClass("layui-input-active");
        } else {
            $(this).parent().removeClass("layui-input-active");
        }
    })
})
