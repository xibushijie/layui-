layui.config({
    base: '/public/js/',
}).extend({
    authtree: 'extend/authtree',
}).use(['form', 'layer', 'laydate', 'table', 'laytpl', 'authtree'], function () {
    var form = layui.form,
        //layer = parent.layer === undefined ? layui.layer : top.layer,
        layer = layui.layer,
        $ = layui.$,
        laydate = layui.laydate,
        laytpl = layui.laytpl,
        authtree = layui.authtree,
        table = layui.table;

    //角色列表数据
    var url = pfUrl + '/sysRole/getSysRoleBypage';
    dataTable(url);

    //搜索
    $(".search_btn").on("click", function () {
        if ($(".searchVal").val() != '') {
            var url = pfUrl + '/sysRole/getSysRoleBypage';
            var where = {};
            where.q = $(".searchVal").val();
            dataTable(url, where);
        } else {
            // layer.msg("请输入搜索的角色名称");
            location.reload();
        }
    });

    //数据表格封装
    function dataTable(url, where) {
        table.render({
            method: 'post',
            elem: '#roleList',
            url: url,
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
            id: "roleListTable",
            cols: [[
                { type: "checkbox", fixed: "left", width: 50 },
                // { field: 'id', title: 'id', width: 200 },
                { field: 'roleDesc', title: '角色名称', align: 'center' },
                { field: 'isEnabled', title: '是否可用', align: 'center', templet: "#roleStatus" },
                { title: '操作', width: 170, templet: '#roleListBar', fixed: "right", align: "center" }
            ]]
        });
    }

    //添加角色
    $(".addNews_btn").click(function () {
        layui.layer.open({
            title: "添加角色",
            type: 1,
            resize: false,
            move: false,
            area: ['390px', 'auto'],
            content: $(".addBox"),
            success: function () {
                var mechanismId = sessionStorage.getItem("jigouCode");    //获取机构code
                $("input[name='mechanismCode']").val(mechanismId);

                form.on('submit(formBtn)', function (data) {
                    // layer.msg(JSON.stringify(data.field));
                    var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
                    var data = data.field;
                    var url = pfUrl + "/sysRole/saveorupdateSysRole";

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
        var checkStatus = table.checkStatus('roleListTable'),
            data = checkStatus.data,
            newsId = [];
        if (data.length > 0) {
            for (var i in data) {
                newsId.push(data[i].id);
                // console.log(newsId);
            }

            layer.open({
                content: '确定删除选中的角色？',
                icon: 3, resize: false, move: false,
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    var dataIds = {};
                    dataIds.sysRoleIDS = newsId.join(",");
                    var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
                    var url = pfUrl + "/sysRole/deleteSysRoleAll";

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
            layer.msg("请选择需要删除的文章");
        }
    })

    //列表操作
    table.on('tool(roleList)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;

        if (layEvent === 'edit') { //编辑
            layui.layer.open({
                title: "编辑角色",
                type: 1,
                resize: false,
                move: false,
                area: ['390px', 'auto'],
                content: $(".editBox"),
                success: function () {
                    $(".editBox input[name='id']").val(data.id);
                    $(".editBox input[name='roleDesc']").val(data.roleDesc);

                    form.on('submit(editBtn)', function (data) {
                        layer.msg(JSON.stringify(data.field));
                        var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });

                        var data = data.field;
                        var url = pfUrl + "/sysRole/saveorupdateSysRole";

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
                content: '确定删除此角色？',
                icon: 3, resize: false, move: false,
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    var dataId = {};
                    dataId.id = data.id;

                    var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
                    var url = pfUrl + "/sysRole/deleteSysRole";

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
        } else if (layEvent === 'gave') { //授权
            layui.layer.open({
                title: "授权",
                type: 1,
                resize: false,
                move: false,
                area: ['420px', '500px'],
                content: $(".gaveBox"),
                success: function () {

                    var roleDesc = $("input[name='roleDesc']").val(data.roleDesc); //角色名字
                    var roleId = $("#roleId").val(data.id); //角色id
                    console.log(roleId.val())

                    //授权前 请求已授权的 角色
                    var url = pfUrl + "/sysRole/saveorupdateSysRoleBefore";
                    var dataId = {};
                    dataId.id = roleId.val();
                    ajax(url, dataId, function (res) {

                        console.log(res);
                        var data = res.data.sysPrivileges;
                        var checkedMap = {};

                        if (data && data.length > 0) {
                            for (let i = 0; i < data.length; i++) {
                                checkedMap[data[i].id] = true;
                            }
                        }

                        $(".gaveBox").find(":checkbox").each(function (i, ck) {
                            ck.checked = !!checkedMap[ck.getAttribute("value")];
                        })

                        form.render();
                    })

                    //授权提交
                    form.on('submit(gaveBtn)', function (data) {

                        var data = {};
                        data.roleDesc = roleDesc.val(); //角色名字
                        data.id = roleId.val(); //角色id
                        data.sysPrivilegeIds = $("input[name='sysPrivilegeIds']").val(); //菜单ids

                        var url = pfUrl + "/sysRole/saveorupdateSysRole";
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
        }
    });

    //树形菜单
    $.ajax({
        method: 'post',
        url: pfUrl + "/sysPrivilege/getSysPrivilegeBypage",
        // url: 'https://xibushijie.github.io/json/menuJson.json',
        dataType: "json",
        data: { isPage: 0 },
        headers: { token: r_data },
        success: function (res) {
            console.log(res);
            // 支持自定义递归字段、数组权限判断等
            // 深坑注意：如果API返回的数据是字符串，那么 startPid 的数据类型也需要是字符串
            var trees = authtree.listConvert(res.data, {
                primaryKey: 'id',
                startPid: '0',
                parentKey: 'parentPrivilegeId',
                nameKey: 'privilegeName',
                valueKey: 'id'
            });
            // console.log(trees);
            // 如果页面中多个树共存，需要注意 layfilter 需要不一样
            authtree.render('#LAY-auth-tree-convert-index', trees, {
                inputname: 'name',
                layfilter: 'lay-check-convert-auth',
                openall: true,
                autowidth: true,
            });

            authtree.on('change(lay-check-convert-auth)', function (data) {
                // 获取所有已选中节点
                var checked = authtree.getChecked('#LAY-auth-tree-convert-index');
                $("input[name='sysPrivilegeIds']").val(checked);
                console.log('checked', checked);
            });
        }
    });

    //获取菜单的id
    // var url = pfUrl + "/sysPrivilege/getSysPrivilegeBypage";
    // var dataList = {};
    // dataList.isPage = 0;

    // ajax(url, dataList, function (res) {
    //     var data = res.data;
    //     var getTpl = demo.innerHTML,
    //         view = document.getElementById('view');
    //     laytpl(getTpl).render(data, function (html) {
    //         view.innerHTML = html;
    //         form.render();
    //     });
    // })
})