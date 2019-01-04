
var renderTable;
layui.config({
    base: '/public/layui/css/modules/'   //静态文件所在地址
}).extend({
    treetable: 'treetable-lay/treetable'
}).use(['table', 'treetable', 'form'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        treetable = layui.treetable,
        table = layui.table;

    appPackageFn();  //调用应用包数据 option 方法

    renderTable = function () {

        // 渲染表格 
        layer.load(2);
        treetable.render({
            treeColIndex: 1,
            treeSpid: 0,
            treeIdName: 'id',
            treePidName: 'parentPrivilegeId',
            elem: '#auth-table',
            url: pfUrl + '/sysPrivilege/getSysPrivilegeBypage',
            where: { isPage: 0 },
            page: true,
            cols: [[
                { type: 'numbers' },
                { field: 'privilegeName', minWidth: 50, title: '菜单名称' },
                { field: 'parentPrivilegeName', minWidth: 50, title: '父级菜单名称' },
                // { field: 'id', title: 'id' },
                // { field: 'parentPrivilegeId', title: '父级id' },
                { field: 'privilegeSort', width: 80, align: 'center', title: '排序号' },
                { field: 'remark', align: 'center', title: '备注' },
                { templet: '#auth-state', width: 200, align: 'right', title: '操作' }
            ]],
            done: function () {
                layer.closeAll('loading');
            }
        });
    };

    renderTable();

    //添加一级菜单
    $('#btn-add').click(function () {
        layui.layer.open({
            title: "添加一级菜单",
            type: 1,
            resize: false,
            move: false,
            area: ['370px', 'auto'],
            content: $(".addBox"),
            success: function () {

                form.on('submit(formBtn)', function (data) {
                    layer.msg(JSON.stringify(data.field));
                    var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
                    var data = data.field;
                    var url = pfUrl + "/sysPrivilege/saveorupdateSysPrivilege";

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

    //折叠展开树形表格
    $("#btn-fold").click(function () {
        if ($(this).text() == "折叠") {
            $(this).html("<i class='layui-icon layui-icon-down'></i>展开");
            treetable.foldAll('#auth-table');
        } else if ($(this).text() == "展开") {
            $(this).html("<i class='layui-icon layui-icon-right'></i>折叠");
            treetable.expandAll('#auth-table');
        }
    });

    //监听行工具事件
    table.on('tool(auth-table)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;

        if (layEvent === 'add') { //添加子菜单
            layui.layer.open({
                title: "添加子菜单",
                type: 1,
                resize: false,
                move: false,
                area: ['390px', 'auto'],
                content: $(".addMenuBox"),
                success: function () {
                    var pid = data.parentPrivilegeId.length;
                    console.log(pid);
                    // $(".addMenuBox input[name='id']").val(data.id);
                    $(".addMenuBox input[name='applicationPackageName']").val(data.applicationPackageName); //应用包名字
                    $(".addMenuBox input[name='parentPrivilegeName']").val(data.parentPrivilegeName); //父级菜单名
                    $(".addMenuBox input[name='parentPrivilegeId']").val(data.id); //上级id

                    form.on('submit(addmenuBtn)', function (data) {
                        layer.msg(JSON.stringify(data.field));
                        var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });

                        var data = data.field;
                        var url = pfUrl + "/sysPrivilege/saveorupdateSysPrivilege";

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
        } else if (layEvent === 'del') {      //删除
            layer.open({
                content: '确定删除此菜单？',
                icon: 3, resize: false, move: false,
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    var dataId = {};
                    dataId.id = data.id;
                    var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
                    var url = pfUrl + "/sysPrivilege/deleteSysPrivilege";

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
        } else if (layEvent === 'edit') {     //编辑
            layui.layer.open({
                title: "编辑菜单",
                type: 1,
                resize: false,
                move: false,
                area: ['390px', 'auto'],
                content: $(".editBox"),
                success: function () {
                    $(".editBox input[name='id']").val(data.id);
                    $(".editBox input[name='parentPrivilegeName']").val(data.parentPrivilegeName);
                    $(".editBox input[name='privilegeName']").val(data.privilegeName);
                    $(".editBox input[name='parentPrivilegeId']").val(data.parentPrivilegeId);
                    $(".editBox input[name='privilegeSort']").val(data.privilegeSort);
                    $(".editBox input[name='remark']").val(data.remark);
                    $(".editBox input[name='shiroId']").val(data.shiroId);


                    form.on('submit(editBtn)', function (data) {
                        layer.msg(JSON.stringify(data.field));
                        var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });

                        var data = data.field;
                        var url = pfUrl + "/sysPrivilege/saveorupdateSysPrivilege";

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
        }
    });


});


