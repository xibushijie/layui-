layui.config({
    base: '/public/js/',
}).extend({
    authtree: 'extend/authtree',
}).use(['form', 'layer', 'laydate', 'table', 'laytpl', 'authtree', 'element'], function () {
    var form = layui.form,
        //layer = parent.layer === undefined ? layui.layer : top.layer,
        layer = layui.layer,
        $ = layui.$,
        laydate = layui.laydate,
        laytpl = layui.laytpl,
        authtree = layui.authtree,
        element = layui.element
    table = layui.table;


    //esb应用列表数据
    var url = esbUrl + '/sysApplication/getAllActivemqMsgBypage';
    dataTable(url);

    //搜索
    // $(".search_btn").on("click", function () {
    //     if ($(".searchVal").val() != '') {
    //         var url = esbUrl + '/sysApplication/saveorupdateSysApplicationBefore';
    //         var where = {};
    //         where.sysApplicationID = $(".searchVal").val();
    //         dataTable(url, where);
    //     } else {
    //         // layer.msg("请输入搜索的角色名称");
    //         location.reload();
    //     }
    // });




    //数据表格封装
    function dataTable(url, where) {
        table.render({
            method: 'post',
            elem: '#esbList',
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
            id: "esbListTable",
            cols: [[
                { type: "checkbox", fixed: "left", width: 50 },
                { field: 'msgType', title: '消息类型' },
                { field: 'msgData', title: '消息' },
                { field: 'creatTime', title: '创建时间' },
                { title: '操作', width: 170, templet: '#msgQueueListBar', fixed: "right", align: "center" }
            ]]
        });
    }

    //申请ESB应用
    $(".addNews_btn").click(function () {
        layui.layer.open({
            title: "申请ESB用户",
            type: 1,
            resize: false,
            move: false,
            area: ['390px', 'auto'],
            content: $(".addBox"),
            success: function () {
                form.on('submit(editBtn)', function (data) {

                    // var json = JSON.stringify(data.field);

                    var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });

                    var url = esbUrl + "/esbApply/saveEsbApply";

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
    })


    //列表操作
    // table.on('tool(esbList)', function (obj) {
    //     var layEvent = obj.event,
    //         data = obj.data;

    //     if (layEvent === 'edit') { //编辑
    //         layui.layer.open({
    //             title: "编辑ESB应用",
    //             type: 1,
    //             resize: false,
    //             move: false,
    //             area: ['390px', 'auto'],
    //             content: $(".editBox"),
    //             success: function () {
    //                 $(".editBox input[name='applicationId']").val(data.applicationId);  //应用id
    //                 $(".editBox input[name='applicationParent']").val(data.applicationParent);  //应用父id
    //                 $(".editBox input[name='applicationName']").val(data.applicationName);  //应用名称
    //                 $(".editBox input[name='imgURL']").val(data.imgURL);  //应用图片url

    //                 form.on('submit(editBtn)', function (data) {

    //                     // layer.msg(JSON.stringify(data.field));
    //                     var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });

    //                     var url = esbUrl + "/sysApplication/saveorupdateSysApplication";

    //                     ajax(url, data.field, function (res) {
    //                         top.layer.close(index);
    //                         top.layer.msg(res.returnMsg);
    //                         setTimeout(function () {
    //                             //刷新父页面
    //                             location.reload();
    //                         }, 500);
    //                     })
    //                     return false;
    //                 });
    //             }
    //         })
    //     } else if (layEvent === 'del') { //删除
    //         layer.open({
    //             content: '确定删除此角色？',
    //             icon: 3, resize: false, move: false,
    //             btn: ['确定', '取消'],
    //             yes: function (index, layero) {
    //                 var dataId = {};
    //                 dataId.sysApplicationID = data.applicationId;

    //                 var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
    //                 var url = esbUrl + "/sysApplication/deleteSysApplication";

    //                 ajax(url, dataId, function (res) {
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
    //     }
    // });

})