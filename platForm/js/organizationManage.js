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

    //机构管理数据展示
    dataTable();

    //搜索
    $(".search_btn").on("click", function () {
        if ($(".searchVal").val() != '') {
            var where = {};
            where.mechanismName = $(".searchVal").val();
            dataTable(where);
        } else {
            // layer.msg("请输入搜索的机构名称");
            location.reload();
        }
    });

    //数据表格
    function dataTable(where) {
        table.render({
            method: 'post',
            elem: '#menuList',
            url: pfUrl + '/sysMechanism/getSysMechanismBypage',
            where: where,
            response: {
                statusName: 'status',
                statusCode: 1,
                msgName: 'returnMsg',
                countName: 'total',
                dataName: 'data'
            },
            page: true,
            limit: 10,
            limits: [10, 15, 20, 25],
            id: "menuListTable",
            cols: [[
                { type: "checkbox", fixed: "left", width: 50 },
                { field: 'mechanismName', title: '机构名称' },
                { field: 'network', title: '机构网点名称' },
                { field: 'mechanismCode', title: '机构编码', align: 'center' },
                { title: '操作', width: 170, templet: '#menuListBar', fixed: "right", align: "center" }
            ]]
        });
    }


    //添加机构
    $(".addNews_btn").click(function () {
        laydate.render({
            elem: '#creat_time',
            type: 'datetime',
            min: -0
        });
        layui.layer.open({
            title: "添加机构",
            type: 1,
            resize: false,
            move: false,
            area: ['370px', 'auto'],
            content: $(".addBox"),
            success: function () {
                form.on('submit(formBtn)', function (data) {
                    // layer.msg(JSON.stringify(data.field));
                    var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
                    var data = data.field;
                    var url = pfUrl + "/sysMechanism/saveorupdateSysMechanism";

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

   
    //列表操作机构
    table.on('tool(menuList)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;

        if (layEvent === 'edit') { //编辑
            laydate.render({
                elem: '#edit_time',
                type: 'datetime',
                min: -0
            });
            layui.layer.open({
                title: "编辑机构",
                type: 1,
                resize: false,
                move: false,
                area: ['390px', 'auto'],
                content: $(".editBox"),
                success: function () {
                    $(".editBox input[name='id']").val(data.id);
                    $(".editBox input[name='mechanismName']").val(data.mechanismName);
                    $(".editBox input[name='mechanismCode']").val(data.mechanismCode);
                    $(".editBox select[name='isEnable']").val(data.isEnable);
                    $(".editBox input[name='network']").val(data.network);
                    form.render('select');
                    form.on('submit(editBtn)', function (data) {
                        // layer.msg(JSON.stringify(data.field));
                        var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });

                        var data = data.field;
                        var url = pfUrl + "/sysMechanism/saveorupdateSysMechanism";

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
                content: '确定删除此机构？',
                icon: 3, resize: false, move: false,
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    var dataId = {};
                    dataId.sysMechanismId = data.id;
                    var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
                    var url = pfUrl + "/sysMechanism/deleteSysMechanism";

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
            laydate.render({
                elem: '#end_time',
                type: 'datetime',
                min: -0
            });
            layui.layer.open({
                title: "授权",
                type: 1,
                resize: false,
                move: false,
                area: ['390px', 'auto'],
                content: $(".gaveBox"),
                success: function () {
                    //获取机构id
                    var appId = $("#appId").val(data.id);
                    // console.log(appId.val());

                    //授权前 请求已授权的 应用包
                    var url = pfUrl + "/sysMechanism/findIdByMechanismpplication";
                    var dataId = {};
                    dataId.sysMechanismId = appId.val();

                    ajax(url, dataId, function (res) {
                        // console.log(res);
                        var data = res.data.applications;
                        var checkedMap = {};

                        if (data && data.length > 0) {
                            for (let i = 0; i < data.length; i++) {
                                checkedMap[data[i].id] = true;
                            }
                        }

                        $(".gaveBox").find(":checkbox").each(function (i, ck) {
                            ck.checked = !!checkedMap[ck.getAttribute("ids")];
                        })

                        form.render();
                    })


                    //授权提交
                    form.on('submit(gaveBtn)', function (data) {
                        var arr = [];
                        $("#view input[name='name']").each(function () {
                            if ($(this).prop("checked") === true) {
                                arr.push($(this).attr("ids"));
                            }
                        })

                        if ($("#end_time").val() == "") {
                            layer.msg('请选择到期时间', { icon: 5 });
                            return false;
                        }

                        var date = $("#end_time").val();

                        var data = {};
                        data.id = appId.val();
                        data.ids = arr.join(",");
                        data.endTime = date;
                        var url = pfUrl + "/sysMechanism/saveMechanismApplication";

                        var index = layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
                        ajax(url, data, function (res) {
                            layer.close(index);
                            layer.msg(res.returnMsg);
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
    // $.ajax({
    //     method: 'post',
    //     url: pfUrl + "/applicationPackage/getApplicationPackageBypage",
    //     // url: 'https://xibushijie.github.io/json/menuJson.json',
    //     dataType: "json",
    //     data: { isPage: 0 },
    //     header: { token: r_data },
    //     success: function (res) {
    //         console.log(res);
    //         // 支持自定义递归字段、数组权限判断等
    //         // 深坑注意：如果API返回的数据是字符串，那么 startPid 的数据类型也需要是字符串
    //         // var trees = authtree.listConvert(res.data, {
    //         //     primaryKey: 'id',
    //         //     startPid: '0',
    //         //     parentKey: 'id',
    //         //     nameKey: 'applicationPackageName',
    //         //     valueKey: 'id'
    //         // });
    //         var trees = res.data;
    //         console.log(trees);
    //         // 如果页面中多个树共存，需要注意 layfilter 需要不一样
    //         authtree.render('#LAY-auth-tree-convert-index', trees, {
    //             inputname: 'authids[]',
    //             layfilter: 'lay-check-convert-auth',
    //             openall: true,
    //             autowidth: true,
    //         });

    //         authtree.on('change(lay-check-convert-auth)', function (data) {
    //             // 获取所有已选中节点
    //             var checked = authtree.getChecked('#LAY-auth-tree-convert-index');
    //             $("#roleMenu").val(checked);
    //             console.log('checked', checked);
    //         });

    //     }


    // });

    //获取机构应用数据
    var url = pfUrl + "/application/getApplicationBypage";
    var dataList = {};
    dataList.isPage = 0;

    ajax(url, dataList, function (res) {
        var data = res.data;
        var getTpl = demo.innerHTML,
            view = document.getElementById('view');
        laytpl(getTpl).render(data, function (html) {
            view.innerHTML = html;
            // $("#view input[type='checkbox']").eq(0).attr("checked", true);  
            form.render();
        });
    })

})