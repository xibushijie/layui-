//请求应用包 option
function appPackageFn() {
    layui.use(["jquery", 'form'], function () {
        var form = layui.form,
            $ = layui.jquery;

        var url = pfUrl + "/applicationPackage/getApplicationPackageBypage";
        var data1 = "";

        ajax(url, data1, function (res) {
            // console.log(res);
            var data = res.data;
            str = '';
            for (var i = 0; i < data.length; i++) {
                str += '<option value="' + data[i].id + '">' + data[i].applicationPackageName + '</option>';
            }
            $(".appPackageSelect").append(str);
            form.render();
        })
    })
}
