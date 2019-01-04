var $, tab, dataStr, layer;
layui.config({
	base: "/public/js/"
}).extend({
	"bodyTab": "bodyTab"
})
layui.use(['bodyTab', 'form', 'element', 'layer', 'jquery'], function () {
	var form = layui.form,
		element = layui.element,
		layer = layui.layer,
		// layer = parent.layer === undefined ? layui.layer : top.layer,
		$ = layui.$;
	tab = layui.bodyTab({
		openTabNum: "15",  //最大可打开窗口数量
		// url: "/public/json/navs.json" //获取菜单json地址
	});

	//获取 localstorage的名字
	var userNmae = localStorage.getItem("userName");
	$(".adminName").html(userNmae)

	//退出登录
	$(".signOut").click(function () {
		var url = ajaxUrl + "/sysUser/logout";
		var data = {};
		data.token = r_data;
		ajax(url, data, function (res) {
			window.location.href = "login.html"
			window.localStorage.removeItem("r_data");
		})
	})

	//顶部菜单
	var url = pfUrl + "/sysPrivilege/applicationPackageList";
	var data = "";
	ajax(url, data, function (res) {
		// console.log(res);
		var data = res.data.applicationPackage;
		var str = "";
		for (let i = 0; i < data.length; i++) {
			str += "<li class='layui-nav-item'><a id='" + data[i].id + "'><i class='seraph icon-icon10' data-icon='icon-icon10'></i><cite>" + data[i].applicationPackageName + "</cite></a></li>";
		}
		$(".topLevelMenus").append(str);
		$(".topLevelMenus li").eq(0).addClass("layui-this");
		element.render('nav');

		//默认获取第一个菜单的id
		var Id = $(".topLevelMenus li").eq(0).find("a").attr("id");
		sessionStorage.setItem("appId", Id);  //储存应用id

		sessionStorage.setItem("jigouCode", res.data.sysUser.mechanismCode);	//储存机构code

		sessionStorage.setItem("userId", res.data.sysUser.id);	//储存用户id

		toMenuFn();
	});

	//遍历菜单
	function toMenuFn() {
		$(".topLevelMenus li").click(function () {
			$(this).each(function () {
				var thisId = $(this).find("a").attr("id");
				sessionStorage.setItem("appId", thisId);  //更新应用id
				window.location = window.location;

			})
		})
	}


	//获取顶部菜单的id
	var appId = sessionStorage.getItem("appId");


	//左侧菜单
	var url = pfUrl + "/sysPrivilege/menuList";
	var data = {};
	data.applicationPackageId = appId;
	ajax(url, data, function (res) {
		console.log(res)



		var data = res.data;
		str = '';
		for (var i = 0; i < data.length; i++) {
			str += '<li class="layui-nav-item layui-nav-itemed">';
			str += '<a><i class="fa"></i><cite>' + data[i].applicationName + '</cite></a>';
			str += '<dl class="layui-nav-child">';
			var appName = data[i].sysPrivileges;
			for (var j = 0; j < appName.length; j++) {
				if (appName[j].privilegeLevel == 1) {
					str += '<dd>';
					str += '<a href="javascript:;" data-url="" id="iconId' + appName[j].id + '"><i class="fa"></i><cite>' + appName[j].privilegeName + ' </cite></a>';
					str += '</dd>';

				}
			}
			str += '</dl>';
			str += '</li>';
		}
		$(".menuData").append(str);
		element.render('nav');

		urlIcon();
		OneMenuFn();


		// 移除已有的bar，为了重新渲染时重新生成bar
		$(".menuData").find('span.layui-nav-bar').remove();
		// 重新设置导航条的html
		$(".menuData").html($(".menuData").html());
		// 重新渲染导航条
		element.render('nav');

	});


	//处理菜单的url和icon
	function urlIcon() {
		$("#iconId16641363152872494").attr("data-url", "../platForm/organizationManage.html");  //管理机构
		$("#iconId16641363152872494 i").addClass("fa-bank");

		$("#iconId16641363152872495").attr("data-url", "../platForm/menuManage.html");	//菜单管理
		$("#iconId16641363152872495 i").addClass("fa-bars");

		$("#iconId16641363152872492").attr("data-url", "../platForm/roleManage.html");	//角色管理
		$("#iconId16641363152872492 i").addClass("fa-users");

		$("#iconId16641363152872491").attr("data-url", "../platForm/applicationPackageManage.html");	//应用包管理
		$("#iconId16641363152872491 i").addClass("fa-cubes");

		$("#iconId16641363152872493").attr("data-url", "../platForm/userManage.html");	//用户管理
		$("#iconId16641363152872493 i").addClass("fa-user-secret");

		$("#iconId1").attr("data-url", "../platForm/applicationManage.html");	//应用管理
		$("#iconId1 i").addClass("fa fa-cube");
	}
	//处理第一条菜单
	function OneMenuFn() {
		//处理渲染出来的第一条菜单
		//获取第一条的url
		var oneUrl = $("#navBar dl>dd:eq(0) a").attr("data-url");
		$("#navBar dl dd:eq(0) a").attr("data-url", oneUrl);
		//给iframe添加第一条菜单的url
		$(".clildFrame iframe").attr("src", oneUrl);
		//获取第一条菜单的name和icon
		var oneMenuName = $("#navBar dl dd:eq(0) a cite").html();
		$("#top_tabs cite").html(oneMenuName);

		$("#navBar dl dd:eq(0)").addClass("layui-this");
	}


	//esb
	var url = esbUrl + "/sysApplication/getAllSysApplicationByParentId";
	var data = "";
	ajax(url, data, function (res) {
		console.log(res);
		var data = res.data;
		var str = '';
		for (var i = 0; i < data.length; i++) {
			str += '<dd><a href="javascript:;" data-url="" id="appid' + data[i].applicationId + '"><i class="fa fa-recycle"></i> <cite>' + data[i].applicationName + '</cite></a></dd>';
		}
		$(".esb-menu").append(str);

		$("#appid1").attr("data-url", "../platForm/ESB/msgQueue.html");	//消息队列
		$("#appid2").attr("data-url", "../platForm/ESB/timedTask.html");	//定时任务
	});

	//修改密码
	$(".pwdEdit").click(function () {
		parent.layer.open({
			title: "授权",
			type: 1,
			resize: false,
			move: false,
			area: ['390px', 'auto'],
			content: $(".pwdBox"),
			success: function () {
				$(".pwdBox input[name='id']").val(sessionStorage.getItem("userId"));

				form.on("submit(editPwdBtn)", function () {

					var id = $(".pwdBox input[name='id']").val();
					var password = $(".pwdBox input[name='password']").val();
					var newPassword = $(".pwdBox input[name='newPassword']").val();

					var url = pfUrl + "/sysUser/newPassword";
					var data = {};
					data.id = id;
					data.password = password;
					data.newPassword = newPassword;

					var index = layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
					ajax(url, data, function (res) {
						// console.log(res);
						layer.close(index);
						if (newPassword == password) {
							layer.msg("新密码和原密码重复啦");
						} else if (res.status == 1) {
							layer.msg("修改密码" + res.returnMsg + "请重新登录");
							setTimeout(function () {
								window.location.href = "../sso/login.html"
							}, 1200);
						} else if (res.status == 0) {
							layer.msg(res.returnMsg);
						}
					})
				})
			}
		})
	});


	// function hallarr(arr, arr2) {
	// 	for (var i = 0; i < arr2.length; i++) {
	// 		var id = arr2[i].parentPrivilegeId;
	// 		for (var j = 0; j < arr.length; j++) {
	// 			if (id == arr[j].id) {
	// 				if (arr[j].sysPrivileges) {
	// 					arr[j].sysPrivileges.push(arr2[i]);
	// 				} else {
	// 					arr[j].sysPrivileges = [];
	// 					arr[j].sysPrivileges.push(arr2[i]);
	// 				};
	// 			};
	// 		};
	// 	};
	// };


	//底部年份
	var date = new Date;
	var year = date.getFullYear();
	$(".year").html(year);

	//通过顶部菜单获取左侧二三级菜单   注：此处只做演示之用，实际开发中通过接口传参的方式获取导航数据
	function getData(json) {
		$.getJSON(tab.tabConfig.url, function (data) {
			console.log(JSON.stringify(data));
			if (json == "contentManagement") {
				dataStr = data.contentManagement;
				//重新渲染左侧菜单
				tab.render();
			} else if (json == "memberCenter") {
				dataStr = data.memberCenter;
				//重新渲染左侧菜单
				tab.render();
			} else if (json == "systemeSttings") {
				dataStr = data.systemeSttings;
				//重新渲染左侧菜单
				tab.render();
			} else if (json == "seraphApi") {
				dataStr = data.seraphApi;
				//重新渲染左侧菜单
				tab.render();
			} else if (json == "seraphApi2") {
				dataStr = data.seraphApi2;
				//重新渲染左侧菜单
				tab.render();
			}
		})
	}
	//页面加载时判断左侧菜单是否显示
	//通过顶部菜单获取左侧菜单
	$(".topLevelMenus li,.mobileTopLevelMenus dd").click(function () {
		if ($(this).parents(".mobileTopLevelMenus").length != "0") {
			$(".topLevelMenus li").eq($(this).index()).addClass("layui-this").siblings().removeClass("layui-this");
		} else {
			$(".mobileTopLevelMenus dd").eq($(this).index()).addClass("layui-this").siblings().removeClass("layui-this");
		}
		$(".layui-layout-admin").removeClass("showMenu");
		$("body").addClass("site-mobile");
		getData($(this).data("menu"));
		//渲染顶部窗口
		tab.tabMove();
	})

	//隐藏左侧导航
	$(".hideMenu").click(function () {
		if ($(".topLevelMenus li.layui-this a").data("url")) {
			layer.msg("此栏目状态下左侧菜单不可展开");  //主要为了避免左侧显示的内容与顶部菜单不匹配
			return false;
		}
		$(".layui-layout-admin").toggleClass("showMenu");
		//渲染顶部窗口
		tab.tabMove();
	})

	//通过顶部菜单获取左侧二三级菜单   注：此处只做演示之用，实际开发中通过接口传参的方式获取导航数据
	getData("contentManagement");

	//手机设备的简单适配
	$('.site-tree-mobile').on('click', function () {
		$('body').addClass('site-mobile');
	});
	$('.site-mobile-shade').on('click', function () {
		$('body').removeClass('site-mobile');
	});

	// 添加新窗口
	$("body").on("click", ".layui-nav .layui-nav-item a:not('.mobileTopLevelMenus .layui-nav-item a')", function () {
		//如果不存在子级
		if ($(this).siblings().length == 0) {
			addTab($(this));
			$('body').removeClass('site-mobile');  //移动端点击菜单关闭菜单层
		}
		$(this).parent("li").siblings().removeClass("layui-nav-itemed");
	})

	//清除缓存
	$(".clearCache").click(function () {
		window.sessionStorage.clear();
		window.localStorage.clear();
		var index = layer.msg('清除缓存中，请稍候', { icon: 16, time: false, shade: 0.8 });
		setTimeout(function () {
			layer.close(index);
			layer.msg("缓存清除成功！");
		}, 1000);
	})

	//刷新后还原打开的窗口
	if (cacheStr == "true") {
		if (window.sessionStorage.getItem("menu") != null) {
			menu = JSON.parse(window.sessionStorage.getItem("menu"));
			curmenu = window.sessionStorage.getItem("curmenu");
			var openTitle = '';
			for (var i = 0; i < menu.length; i++) {
				openTitle = '';
				if (menu[i].icon) {
					if (menu[i].icon.split("-")[0] == 'icon') {
						openTitle += '<i class="seraph ' + menu[i].icon + '"></i>';
					} else {
						openTitle += '<i class="layui-icon">' + menu[i].icon + '</i>';
					}
				}
				openTitle += '<cite>' + menu[i].title + '</cite>';
				openTitle += '<i class="layui-icon layui-unselect layui-tab-close" data-id="' + menu[i].layId + '">&#x1006;</i>';
				element.tabAdd("bodyTab", {
					title: openTitle,
					content: "<iframe src='" + menu[i].href + "' data-id='" + menu[i].layId + "'></frame>",
					id: menu[i].layId
				})
				//定位到刷新前的窗口
				if (curmenu != "undefined") {
					if (curmenu == '' || curmenu == "null") {  //定位到后台首页
						element.tabChange("bodyTab", '');
					} else if (JSON.parse(curmenu).title == menu[i].title) {  //定位到刷新前的页面
						element.tabChange("bodyTab", menu[i].layId);
					}
				} else {
					element.tabChange("bodyTab", menu[menu.length - 1].layId);
				}
			}
			//渲染顶部窗口
			tab.tabMove();
		}
	} else {
		window.sessionStorage.removeItem("menu");
		window.sessionStorage.removeItem("curmenu");
	}
})

//打开新窗口
function addTab(_this) {
	tab.tabAdd(_this);
}


//图片管理弹窗
function showImg() {
	$.getJSON('json/images.json', function (json) {
		var res = json;
		layer.photos({
			photos: res,
			anim: 5
		});
	});
}