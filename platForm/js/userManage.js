layui.use(['form', 'layer', 'laydate', 'table', 'laytpl'], function () {
    var form = layui.form,
        //layer = parent.layer === undefined ? layui.layer : top.layer,
        layer = layui.layer,
        $ = layui.jquery,
        laydate = layui.laydate,
        laytpl = layui.laytpl,
        table = layui.table;

    //机构管理数据展示
    dataTable();

    //搜索
    $(".search_btn").on("click", function () {
        if ($(".searchVal").val() != '') {
            var where = {};
            where.q = $(".searchVal").val();
            dataTable(where);
        } else {
            // layer.msg("请输入搜索的帐号");
            location.reload();
        }
    });

    //数据表格
    function dataTable(where) {
        table.render({
            method: 'post',
            elem: '#userList',
            url: pfUrl + '/sysUser/getSysUserBypage',
            where: where,
            response: {
                statusName: 'status',
                statusCode: 1,
                msgName: 'returnMsg',
                countName: 'total',
                dataName: 'data'
            },
            cellMinWidth: 95,
            page: true,
            limit: 10,
            limits: [10, 15, 20, 25],
            id: "userListTable",
            cols: [[
                { type: "checkbox", fixed: "left", width: 50 },
                { field: 'plaUserDesc', title: '用户名称', width: 150 },
                { field: 'mobile', title: '手机号码', width: 150 },
                { field: 'userCode', title: '帐号', align: 'center' },
                { field: 'sysRoleName', title: '角色名称', align: 'center' }, 
                { field: 'email', title: '邮箱', align: 'center' },
                { field: 'mechanismCode', title: '机构编码', align: 'center' },
                { title: '操作', width: 170, templet: '#userListBar', fixed: "right", align: "center" }
            ]]
        });
    }


    //添加用户
    $(".addNews_btn").click(function () {
        layui.layer.open({
            title: "添加用户",
            type: 1,
            resize: false,
            move: false,
            area: ['370px', 'auto'],
            content: $(".addBox"),
            success: function () {

                //获取机构id和机构code
                $(".code").val($(".jigouSelect option").attr("title"));
                form.on('select(code)', function (data) {
                    var mechanismCode = data.elem[data.elem.selectedIndex].title;
                    $(".code").val(mechanismCode);
                });

                form.on('submit(formBtn)', function (data) {
                    // layer.msg(JSON.stringify(data.field));
                    data = data.field;
                    var url = pfUrl + "/sysUser/saveorupdateSysUser";

                    var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
                    ajax(url, data, function (res) {
                        top.layer.close(index);
                        top.layer.msg(res.returnMsg);
                        setTimeout(function () {
                            //刷新父页面
                            location.reload();
                        }, 500);
                    })
                    return false;
                });
            }
        })
    })



    //批量删除
    $(".delAll_btn").click(function () {
        var checkStatus = table.checkStatus('userListTable'),
            data = checkStatus.data,
            newsId = [];
        if (data.length > 0) {
            for (var i in data) {
                newsId.push(data[i].id);
                console.log(newsId.join(","));
            }
            layer.open({
                content: '确定删除选中的机构？',
                icon: 3, resize: false, move: false,
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    console.log(newsId.join(","))
                    var dataIds = {};
                    dataIds.id = newsId.join(",");
                    var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
                    var url = pfUrl + "/sysUser/deleteSysUser";

                    ajax(url, dataIds, function (res) {
                        top.layer.close(index);
                        top.layer.msg(res.returnMsg);
                        setTimeout(function () {
                            //刷新父页面
                            location.reload();
                        }, 500);
                    })
                    return false;
                }
            })
        } else {
            layer.msg("请选择需要删除的机构");
        }
    })

    //列表操作
    table.on('tool(userList)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;

        if (layEvent === 'edit') { //编辑
            laydate.render({
                elem: '#edit_time',
                type: 'datetime',
                min: -0
            });
            layui.layer.open({
                title: "编辑用户",
                type: 1,
                resize: false,
                move: false,
                area: ['390px', 'auto'],
                content: $(".editBox"),
                success: function () {
                    $(".editBox input[name='id']").val(data.id);
                    $(".editBox input[name='plaUserDesc']").val(data.plaUserDesc);
                    $(".editBox input[name='userCode']").val(data.userCode);
                    $(".editBox input[name='mobile']").val(data.mobile);
                    $(".editBox input[name='email']").val(data.email);


                    form.render('select');
                    form.on('submit(editBtn)', function (data) {
                        // layer.msg(JSON.stringify(data.field));
                        var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });

                        var data = data.field;
                        var url = pfUrl + "/sysUser/saveorupdateSysUser";

                        ajax(url, data, function (res) {
                            top.layer.close(index);
                            top.layer.msg(res.returnMsg);
                            setTimeout(function () {
                                //刷新父页面
                                location.reload();
                            }, 500);
                        })
                        return false;
                    });
                }
            })

        } else if (layEvent === 'del') { //删除
            layer.open({
                content: '确定删除此用户？',
                icon: 3, resize: false, move: false,
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    var dataId = {};
                    dataId.id = data.id;
                    var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
                    var url = pfUrl + "/sysUser/deleteSysUser";

                    ajax(url, dataId, function (res) {
                        top.layer.close(index);
                        top.layer.msg(res.returnMsg);
                        setTimeout(function () {
                            //刷新父页面
                            location.reload();
                        }, 500);
                    })
                    return false;
                }
            })
        }
    });

    //获取机构数据
    var url = pfUrl + "/sysMechanism/getSysMechanismBypage";
    var dataList = "";
    ajax(url, dataList, function (res) {
        var data = res.data;
        str = '';
        for (var i = 0; i < data.length; i++) {
            str += '<option value="' + data[i].id + '" title="' + data[i].mechanismCode + '">' + data[i].mechanismName + '</option>';
        }
        $(".jigouSelect").append(str);
        form.render();
    })

    //获取角色数据
    var url = pfUrl + "/sysRole/getSysRoleBypage";
    var roleList = "";
    ajax(url, roleList, function (res) {
        var data = res.data;
        str = '';
        for (var i = 0; i < data.length; i++) {
            str += '<option value="' + data[i].id + '">' + data[i].roleDesc + '</option>';
        }
        form.render();
        $(".roleSelect").append(str);
    })
})