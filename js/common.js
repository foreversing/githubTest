var container3Url = "http://172.26.128.74:8080/cm_bdp/projectProgress/container3";
var container4Url = "http://172.26.128.74:8080/cm_bdp/projectProgress/container4";
var globalUrl = "http://172.26.128.57:8080";
var timerjy = null;
var timer = null;

function tabContent() {
    var controller = true; //控制轮播的暂停与开始
    var arrAttr = [];
    $('#tabs1 li').each(function() {
        var flag = $(this).attr('cmig-data');
        if (flag != undefined) {
            arrAttr.push(flag)
        } else {
            return;
        }
    });
    var _index = 0;
    var timer = null;
    var listLi = $('#tabs1 li');
    var tabDiv = $('.tab-content>div');
    init(0);

    function init(n) {
        $('#tabs1 li:eq(' + n + ')').addClass('active');
        $('#mian-inner').load(arrAttr[n] + '.html', function(a, b, c) {}).show();
        timer = setTimeout(autoPlay, 20000);
        _index = n;
    }

    function autoPlay() {
        clearTimeout(timer);
        _index++;
        if (_index >= listLi.length) {
            _index = 0;
            changeOption(_index);
            timer = setTimeout(autoPlay, 20000);
        } else if (_index == 3) {
            changeOption(_index);
            timer = setTimeout(autoPlay, 30000);
        } else {
            changeOption(_index);
            timer = setTimeout(autoPlay, 20000);
        }
    }

    function changeOption(curIndex) {
        $('.active').removeClass('active');
        $(listLi).eq(curIndex).addClass('active');
        var $class = $(listLi).eq(_index).attr('cmig-data');
        $('#mian-inner').show().load($class + '.html', function(a, b, c) {});
        _index = curIndex;
    }

    function controllers() {
        controller = false;
        $(".controller div").eq(0).addClass("hide");
        $(".controller div").eq(1).removeClass("hide");
    }

   $(".controller").on("click", "div", function () {
controller = !controller;
$(this).addClass("hide");
$(this).siblings().removeClass("hide");
if (controller) {
if (_index >= listLi.length) {
timer = setTimeout(autoPlay, 20000);
} else if (_index == 3) {
timer = setTimeout(autoPlay, 30000);
} else {
timer = setTimeout(autoPlay, 20000);
}
} else {
clearTimeout(timer);
}
});

    $('[cmig-data^=cmigPage]').click(function() {
        clearTimeout(timer);
        $('.active').removeClass('active');
        _index = $(this).index();
        changeOption(_index);
        controllers();
    });

    var timers = null;

    $('.left-btn').click(function() {
        clearTimeout(timers);
        clearTimeout(timer);
        timers = setTimeout(function() {
            $('.active').removeClass('active');
            _index = _index - 1;
            if (_index < 0) {
                _index = listLi.length - 1;
            }
            changeOption(_index);
            controllers();
        }, 250)
    });
     //修改密码
  
    
    $(".psdicon").click(function () {
        //clearTimeout(timer);
        $(".tipmessage").html("");
        $(".psd1").val("");
        $(".psd2").val("");
        $(".newpsd1").hide();
        $(".newpsd2").hide();
        $(".attrPsd").show();
        $(".shade").show();
    })

    $("#close,#NO").click(function () {
$(".attrPsd").hide();
$(".shade").hide();
})

    $(".psd1").blur(function () {
        var result1 = $(".psd1").val().trim();
        if (result1 == "") {
            $(".newpsd1").show().html("密码不能为空");
        } else {
            $(".newpsd1").hide();

        }
    })

    $(".psd2").blur(function () {
        var result1 = $(".psd1").val().trim();
        var result2 = $(".psd2").val().trim();
        if (result1 != result2) {
            $(".newpsd2").show().html("密码不一致");
        } else if(result2 == ""){
            $(".newpsd2").show().html("不能为空");
        }else if (result1 == result2 && result1 != "") {
            $(".newpsd2").hide();
            $(".newpsd1").hide();
            console.log("reslove")
 
        }
    })
    var userName = sessionStorage.getItem("userName");
    $("#YES").click(function () {
        var result1 = $(".psd1").val().trim();
        var result2 = $(".psd2").val().trim();

        if(result1 == "" || result2 == ""){
            $(".tipmessage").html("密码不能为空").show();
        }else if(result1 != result2){
            $(".tipmessage").html("两次输入的密码不一样").show();
        }   else if(result1 && result2 && result1 == result2){
            $.ajax({
				type:"post",
				url: globalUrl + "/screensrv/rest/tableau/update",
				contentType:"application/json;charset=utf-8",
				data:{"username":userName,"password":result1},
				async:true,
				success:function(data){
					if(data.substring(0,1)=='0'){
						 $(".attrPsd").hide();
                         $(".shade").hide();
					}else{
							$(".tipmessage").html(data.substring(2)).show();
						
					}
				}
			});
        }

       
    })




   
    //新加右侧按钮
    $('.right-btn').click(function() {
        clearTimeout(timers);
        clearTimeout(timer);
        timers = setTimeout(function() {
            $('.active').removeClass('active');
            _index = _index + 1;
            if (_index > listLi.length - 1) {
                _index = 0
            }
            changeOption(_index);
            controllers();
        }, 250)
    });
}
//下logo显示
function controlLogo() {
    var $height = $(window).height();
    var $width = $(window).width();
    $("#tabs1 li").height($width * 0.023);
    $("#tabs1 li").width($width * 0.023);
    $("#tabs1 li").css("border-radius", $width * 0.05);
    $("#tabs1 li").each(function(index) {
        $(this).css('left', index * ($width * 0.03));
    })
}

function flagLogin() {
    var flagSign = sessionStorage.getItem('flagLogin');
    if (flagSign == null) {
        window.location.href = 'login.html'
    } else {
        return true;
    }
}
//仪表盘
function initContainer3() {
    var url = container3Url;
    $.getJSON(url, function(data) {
        var projectPrg = Number(data.data.projectPrgsRate) * 100;
        var lastprojectPrg = projectPrg.toFixed();
        $(".progressSlip").html(lastprojectPrg + '%');
        if (data.data.engineerProgress == "N") {
            $('#container31 .engineerspan').text('正常');

        } else if (data.data.engineerProgress == "W") {
            $('#container31 .engineerspan').text('预警');
        } else if (data.data.engineerProgress == "E") {
            $('#container31 .engineerspan').text('警告');
        }
        if (data.data.resourceGuarantee == "N") {
            $('#container32 .resourcespan').text('正常')
        } else if (data.data.resourceGuarantee == "W") {
            $('#container32 .resourcespan').text('预警');
        } else if (data.data.resourceGuarantee == "E") {
            $('#container32 .resourcespan').text('警告');
        }
        if (data.data.constructionSafety == "N") {
            $('#container33 .constructspan').text('正常');
        } else if (data.data.constructionSafety == "W") {
            $('#container33 .constructspan').text('预警');
        } else if (data.data.constructionSafety == "E") {
            $('#container33 .constructspan').text('警告');
        }

    });
}
//董家渡项目
function garden() {
    //项目中小区区域跳动logo定位
    clearInterval(timerjy)
    var baseLocal = {
        "local": [{ //J
                'left': '40%',
                'top': '3%'
            },
            { //L块
                "left": "26%",
                "top": "6%"
            }, { //C块
                'left': '45%',
                'top': '59%'
            },
            { //F块
                "left": "55%",
                "top": "24%"
            }, { //g地块
                'left': '42%',
                'top': '21%'
            },
            { //H块
                "left": "37%",
                "top": "37%"
            }, { //I块
                'left': '33%',
                'top': '48%'
            },
            { //A
                "left": "54%",
                "top": "7%"
            }, {
                'left': '22%',
                'top': '38%'
            },
            { //B块
                "left": "53%",
                "top": "41%"
            }
        ]
    }
    var localNew = baseLocal.local;
    $.ajax({
        type: "get",
        dataType: 'json',
        url: container4Url,
        success: function(res) {
            var data = JSON.stringify(res.data);
            var result = JSON.parse(data);
            var base = {
                "datas": []
            }
            var barX = [];
            var barData = [];
            var barSeriers = [];
            for (var i = 0; i < result.length; i++) {
                function returnLis() {
                    if (result[i].plotStatusName == null) {
                        return '暂无进度！';
                    } else {
                        return result[i].plotStatusName;
                    }
                };
                //右侧显示当前项目阶段
                barSeriers.push(result[i].curStageName)
                //获取数据内容
                var barDataObj = {};
                barDataObj.color = "#567Fcd";
                barDataObj.description = result[i].curStageName;
                var plotPrg = Number(result[i].plotPrgsRate) * 100;
                var lastplotPrg = plotPrg.toFixed(2);
                barDataObj.y = parseFloat(lastplotPrg);
                //						barDataObj.y=result[i].plotPrgsRate;

                barData.push(barDataObj)
                //获取柱状Y轴名称
                barX.push(result[i].plotName);
                for (var temp_result in result) {
                    var new_result = {};
                    var new_resullt_cont = {};
                    var new_result_content = [];
                    new_result.status = true;
                    new_result.id = i;
                    new_resullt_cont.member = result[i].plotName;
                    new_resullt_cont.time = returnLis();
                    new_result_content.push(new_resullt_cont);
                    new_result.content = new_result_content;
                    new_result.left = localNew[i].left;
                    new_result.top = localNew[i].top;
                }
                base.datas.push(new_result);

            }
            //	  数据联动
            $.each(base.datas, function(i, data) {
                if (data.status) {
                    $("#zmwy_map").append("<a href='javascript:void(0)' class='bling' style='left:" + data.left + ";top:" + data.top + ";'  id=" + data.id + "><img src='img/blue.png'></a>")
                } else {
                    $("#zmwy_map").append("<a href='javascript:void(0)' class='nomarl' style='left:" + data.left + ";top:" + data.top + ";' id=" + data.id + "><img src='img/orange.png'></a>")
                }
            });
            $("#documentPanel").css('display', "none");
            $("#documentPanel>li").empty().hide();
            timerjy = setInterval(run, 3000);
            //柱状图初始化
            //封装柱状图方法start
            function containerBar(containerBarData) {
                var height = $("#container4").height();
                $('#container4').highcharts({
                    chart: {
                        backgroundColor: 'rgba(11, 61, 153, 0.2)',
                        type: 'bar',
                        height: height
                    },
                    legend: {
                        enabled: false,
                    },
                    exporting: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    tooltip: {
                        shared: false,
                        formatter: function(parme) {
                            return '<br/><span style="color:' + this.point.color + '">' + this.point.description + ': ' +
                                this.point.y.toFixed(2) + '%' + ' </span>';
                        }
                    },
                    plotOptions: {
                        bar: {
                            grouping: false,
                            shadow: false,
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                formatter: function() {
                                    if (this.point.description) {
                                        return this.point.description;
                                    }
                                }
                            }
                        }
                    },
                    title: {
                        text: '地块进展图',
                        useHTML: true,
                        style: {
                            color: '#fff', //字体颜色
                            "fontSize": "18px", //字体大小
                            fontWeight: 'bolder'
                        }
                    },
                    xAxis: {
                        categories: barX,
                        labels: {
                            style: {
                                color: '#fff',
                                fontSize: '13px',
                                fontFamily: '微软雅黑'
                            }
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: ''
                        },
                        labels: {
                            style: {
                                color: '#fff',
                                fontSize: '13px',
                                fontFamily: '微软雅黑'
                            }
                        }
                    },
                    legend: {
                        reversed: false,
                        enabled: false
                    },
                    series: [{
                        name: '',
                        data: containerBarData,
                        pointPlacement: -0.2,
                        animation: true
                    }]
                });

            }
            //封装柱状图方法end
            //数据关联
            var obj = $("#zmwy_map a");
            var objLen = $("#zmwy_map a").length - 1;
            $(obj).hide();
            var _indexjy = 0;
            //数据关联
            var DailBar = barData;

            function barAndGar() {
                var containerBarData = barData;
                for (var i in containerBarData) {
                    if (i == _indexjy) {
                        containerBarData[i].color = '#F6BD0F'

                    } else {
                        containerBarData[i].color = '#567Fcd'
                    }
                }
                $(obj).hide().eq(_indexjy).show();
                var documentPanelPosition = $(obj).eq(_indexjy).position();
                var documentPanelPositionTop = documentPanelPosition.top + 30;
                var documentPanelPositionLeft = documentPanelPosition.left + 60;
                var plotPrgsR = Number(result[_indexjy].plotPrgsRate) * 100;
                var $windowwidth = $(window).width();
                var $winhight = $(window).height();
                if (documentPanelPositionTop == 30 && documentPanelPositionLeft == 60) {
                    $(obj).hide();
                    $("#documentPanel").hide();
                    containerBar();

                } else {
                    $(obj).hide().eq(_indexjy).show();
                    $("#documentPanel").empty();
                    containerBar(containerBarData);
                    $("#documentPanel").css({
                        top: "" + documentPanelPositionTop + "px",
                        left: "" + documentPanelPositionLeft + "px"
                    }).show();
                    var html = "<ul>";
                    $.each(base.datas[_indexjy].content, function(i, data) {
                        html += "<li><li></li>" + data.member + '<br/>' + '阶段：' + data.time + '<br/>进度：' + plotPrgsR.toFixed() + "%" + "</li>";
                    })
                    html += "</ul>"
                    $("#documentPanel").append(html);


                }
                _indexjy = (_indexjy == objLen) ? 0 : _indexjy + 1;
            }

            function run() {
                barAndGar();
            }
            run()
        },
        error: function(res) {
            console.log(res.statusText);
        }
    });
}
$(function() {
    var $fullScreen = document.querySelector('.fullscrren');
    window.isflsgrn = false;
    window.ieIsfSceen = false;

    function fullscreenEnable() {
        var isFullscreen = document.fullscreenEnabled ||
            window.fullScreen ||
            document.mozFullscreenEnabled ||
            document.webkitIsFullScreen;
        return isFullscreen;
    }
    //全屏
    var fScreen = function() {
        var docElm = document.documentElement;
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
            ieIsfSceen = true;
        } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        } else { //对不支持全屏API浏览器的处理，隐藏不需要显示的元素
            window.parent.hideTopBottom();
            isflsgrn = true;
            fullscrrenTrue();
        }
    }
    //退出全屏
    var cfScreen = function() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else {
            window.parent.showTopBottom();
            isflsgrn = false;
            fullscrrenFalse();
        }
    }
    //全屏按钮点击事件
    $(".fullscrren").click(function() {
        var isfScreen = fullscreenEnable();
        if (!isfScreen && isflsgrn == false) {
            if (ieIsfSceen == true) {
                document.msExitFullscreen();
                ieIsfSceen = false;
                return;
            }
            fScreen();
        } else {
            cfScreen();
        }
    })
    //键盘操作
    $(document).keydown(function(e) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e.keyCode == 27 && ieIsfSceen == true) {
            ieIsfSceen = false;
        }
        if (e.keyCode == 122) {
            e.preventDefault();
            var isfScreen = fullscreenEnable();
            if (!isfScreen && isflsgrn == false) {
                if (ieIsfSceen == true) {
                    document.msExitFullscreen();
                    ieIsfSceen = false;
                    return;
                }
                fScreen();
            } else {
                cfScreen();
            }
        }
    });

    function fullscrrenTrue() {
        $('.fullscrren').addClass('fullFlag');
        $('.fullscrren>img').attr('src', 'img/nofullscrren.png');
        $(".fullscrren_text").text("退出全屏");
    }

    function fullscrrenFalse() {
        $('.fullscrren').removeClass('fullFlag');
        $('.fullscrren>img').attr('src', 'img/fullscreen.png');
        $(".fullscrren_text").text("全屏");
    }
    //监听状态变化
    if (window.addEventListener) {
        document.addEventListener('fullscreenchange', function() {
            if ($(".fullscrren_text").text() == "全屏") {
                fullscrrenTrue();
            } else {
                fullscrrenFalse();
            }
        });
        document.addEventListener('webkitfullscreenchange', function() {
            if ($(".fullscrren_text").text() == "全屏") {
                fullscrrenTrue();
            } else {
                fullscrrenFalse();
            }
        });
        document.addEventListener('mozfullscreenchange', function() {
            if ($(".fullscrren_text").text() == "全屏") {
                fullscrrenTrue();
            } else {
                fullscrrenFalse();
            }
        });
        document.addEventListener('MSFullscreenChange', function() {
            if ($(".fullscrren_text").text() == "全屏") {
                fullscrrenTrue();
            } else {
                fullscrrenFalse();
            }
        });
    }
})