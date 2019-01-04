layui.use(['form', 'layer', 'laydate', 'table', 'laytpl', 'tree'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laydate = layui.laydate,
        laytpl = layui.laytpl,
        tree = layui.tree,
        table = layui.table;

    //应用管理数据
    dataTable();

    //搜索
    $(".search_btn").on("click", function () {
        if ($(".searchVal").val() != '') {
            var where = {};
            where.q = $(".searchVal").val();
            dataTable(where);
        } else {
            location.reload();
        }
    });

    //数据表格封装
    function dataTable(where) {
        table.render({
            method: 'post',
            elem: '#applicationList',
            url: pfUrl + '/application/getApplicationBypage',
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
            id: "applicationListTable",
            cols: [[
                { type: "checkbox", fixed: "left", width: 50 },
                // { field: 'id', title: '应用id', width: 350 },
                { field: 'applicationName', title: '应用名称', align: 'center' },
                { field: 'createTime', title: '创建时间', align: 'center' },
                { title: '操作', width: 170, templet: '#applicationListBar', fixed: "right", align: "center" }
            ]],
            done: function(res){
                console.log(res);
            }
        });
    }

    //添加应用
    $(".addNews_btn").click(function () {
        layui.layer.open({
            title: "添加应用",
            type: 1,
            resize: false,
            move: false,
            area: ['390px', 'auto'],
            content: $(".addBox"),
            success: function () {
                form.on('submit(formBtn)', function (data) {
                    // layer.msg(JSON.stringify(data.field));
                    var data = data.field;
                    var url = pfUrl + "/application/saveorupdateApplication";

                    var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
                    ajax(url, data, function (res) {
                        top.layer.close();
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
    // $(".delAll_btn").click(function () {
    //     var checkStatus = table.checkStatus('applicationListTable'),
    //         data = checkStatus.data,
    //         newsId = [];
    //     if (data.length > 0) {
    //         for (var i in data) {
    //             newsId.push(data[i].id);
    //             // console.log(newsId);
    //         }
    //         layer.open({
    //             content: '确定删除选中的机构？',
    //             icon: 3, resize: false, move: false,
    //             btn: ['确定', '取消'],
    //             yes: function (index, layero) {
    //                 var dataIds = {};
    //                 dataIds.applicationPackageIDS = newsId.join(",");
    //                 var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
    //                 var url = pfUrl + "/applicationPackage/deleteApplicationPackageAll";

    //                 ajax(url, dataIds, function (res) {
    //                     top.layer.close(index);
    //                     top.layer.msg(res.returnMsg);
    //                     setTimeout(function () {
    //                         //刷新父页面
    //                         location.reload();
    //                     }, 500);
    //                 })
    //                 return false;
    //             }
    //         })
    //     } else {
    //         layer.msg("请选择需要删除的应用");
    //     }
    // })

    //列表操作
    table.on('tool(applicationList)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;

        if (layEvent === 'edit') { //编辑
            layui.layer.open({
                title: "编辑应用",
                type: 1,
                resize: false,
                move: false,
                area: ['390px', 'auto'],
                content: $(".editBox"),
                success: function () {
                    $(".editBox input[name='id']").val(data.id);
                    $(".editBox input[name='applicationName']").val(data.applicationName);

                    form.on('submit(editBtn)', function (data) {
                        layer.msg(JSON.stringify(data.field));
                        var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });

                        var data = data.field;
                        var url = pfUrl + "/application/saveorupdateApplication";

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
                content: '确定删除此应用？',
                icon: 3, resize: false, move: false,
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    var dataId = {};
                    dataId.id = data.id;
                    var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
                    var url = pfUrl + "/application/deleteApplication";

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
})