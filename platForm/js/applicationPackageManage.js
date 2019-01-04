layui.use(['form', 'layer', 'laydate', 'table', 'laytpl', 'tree'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laydate = layui.laydate,
        laytpl = layui.laytpl,
        tree = layui.tree,
        table = layui.table;

    //应用包管理数据
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
            elem: '#applicationPackageList',
            url: pfUrl + '/applicationPackage/getApplicationPackageBypage',
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
            id: "applicationPackageListTable",
            cols: [[
                { type: "checkbox", fixed: "left", width: 50 },
                { field: 'applicationPackageName', title: '应用包名称', align: 'center' },
                { field: 'createTime', title: '创建时间', align: 'center' },
                { title: '操作', width: 170, templet: '#applicationPackageListBar', fixed: "right", align: "center" }
            ]]
        });
    }

    //添加应用包
    $(".addNews_btn").click(function () {
        layui.layer.open({
            title: "添加应用包",
            type: 1,
            resize: false,
            move: false,
            area: ['390px', 'auto'],
            content: $(".addBox"),
            success: function () {

                //如果没有应用 就隐藏当前行

                selectAppFn();

                form.on('submit(formBtn)', function (data) {

                    var id_array = [];
                    $('.selectApp input[name="applicationIds"]').each(function () {
                        if ($(this).prop("checked") === true) {
                            id_array.push($(this).attr("id"));
                        }
                    });
                    var idstr = id_array.join(',');//将数组元素连接起来以构建一个字符串  
                    // layer.msg(JSON.stringify(data.field));

                    data.field.applicationIds = idstr;

                    var url = pfUrl + "/applicationPackage/saveorupdateApplicationPackage";

                    var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
                    ajax(url, data.field, function (res) {
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




    //列表操作
    table.on('tool(applicationPackageList)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;

        if (layEvent === 'edit') { //编辑
            layui.layer.open({
                title: "编辑应用包",
                type: 1,
                resize: false,
                move: false,
                area: ['390px', 'auto'],
                content: $(".editBox"),
                success: function () {
                    form.render();

                    $(".editBox input[name='id']").val(data.id);
                    $(".editBox input[name='applicationPackageName']").val(data.applicationPackageName);

                    appFn();

                    selectAppFn();

                    form.on('submit(editBtn)', function (data) {

                        //获取应用的所有id
                        var arr = [];
                        $(".app input[type='checkbox']").each(function () {
                            if ($(this).prop("checked") === true) {
                                arr.push($(this).attr("id"));
                            }
                        })
                        var ids = arr.join(',');
                        // console.log(ids);
                        data.field.applicationIds = ids;
                        // layer.msg(JSON.stringify(data.field));

                        var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });

                        var url = pfUrl + "/applicationPackage/saveorupdateApplicationPackage";
                        ajax(url, data.field, function (res) {
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
                content: '确定删除此应用包？',
                icon: 3, resize: false, move: false,
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    var dataId = {};
                    dataId.id = data.id;
                    var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
                    var url = pfUrl + "/applicationPackage/deleteApplicationPackage";

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


    //添加应用包 选择 应用
    function selectAppFn() {

        var url = pfUrl + "/applicationPackage/findByApplication";
        var data = "";
        ajax(url, data, function (res) {
            $(".selectApp").html("");
            var data = res.data;
            var str = '';
            if (res.total == 0) {
                $(".selectApp").html("暂无应用");
            } else {
                for (let i = 0; i < data.length; i++) {
                    if (res.total >= 0) {
                        str += '<input type="checkbox" name="applicationIds" id="' + data[i].id + '" lay-skin="primary" title="' + data[i].applicationName + '">';
                    }
                }
            }
            $(".selectApp").append(str);
            $(".app").append(str);

            form.render();
        });
    }

    //编辑应用包 可选应用
    function appFn() {
        $(".app").html("");
        var url = pfUrl + "/applicationPackage/queryApplicationPackage";
        var data = {};
        data.id = $(".appID").val();
        ajax(url, data, function (res) {



            // console.log(res);
            var dataList = res.data;
            var str = '';
            if (res.total == 0) {
                str += '<div>暂无应用</div>';
            } else {
                for (let i = 0; i < dataList.length; i++) {
                    str += '<input type="checkbox" name="applicationIds" id="' + dataList[i].applicationId + '" lay-skin="primary" title="' + dataList[i].applicationName + '" checked="checked">'
                }
            }

            $(".app").append(str);
            form.render();
        })
    }
})