/**
 * Created by XianJunHe  on 2016/12/12.
 * 滚动控件
 * version:2.0  fixed by menglianghu
 * 修改为可以动态修改数据，不需要默认提供值
 */
var rollWidget = (function (arg) {
        arg.loop = false;
        var fadeOutTime = 350;
        /**
         * 滑动后其它选择消失时间
         * */
        var carousel;
        var selectVal = 0;
        /**
         *选择值，初始0
         */
        var obj = $("#" + arg.renderTo);
        var identifier = -1;
        /**
         * 手指唯一id
         * */
        var isEdit = false;
        /**
         * 手是否正在操作
         * */
        var isEditTime;
        /**
         * 手是最后操作时间
         * */
        var defalutCount = 0;
        /**
         * 用于缓动的变量
         */
        var StartX = 0;
        /**
         * 初始位置
         * */
        var lastX = 0;
        /**
         * 上一次位置
         * */
        var lastMoveStart = 0;
        var lastMoveTime = 0;
        /**
         * 点击时的初始角度
         * */
        var initR = 0;
        /**
         * 补偿后的item数量
         * */
        var completCount = 0;
        /**最大角度*/
        var maxRoation;
        /**
         *默认显示图片
         * */
        var defaultImg = [];
        /**用户点击替换图片*/
        var tapData;
        /**角度补偿值 roation读取都是整数 计算roation时必须从theta获取补偿*/
        var roationffset;
        /*最后选择*/
        var lastIDX = -1;

        /**点击用停止变量
         * isRolling：是否还在滚动
         * rollTime滚动记录的时间
         * targetRotation：目标滚动角度
         * startRotation：开始滚动角度
         * sysTime：记录滚动时系统时间
         * _time：定时器
         * diretion：滑动方向
         * */
        var cons = {
            isRolling: false,
            rollTime: 0,
            targetRotation: 0,
            startRotation: 0,
            sysTime: 0,
            _time: 0,
            diretion: 0
        };

        var objDOM = document.getElementById(arg.containerID);
        /**
         * 点击
         * */
        objDOM.addEventListener('touchstart', function (event) {
            if(isFinishedOption()){
                return;
            }
            if (identifier != -1) {
                return;
            }
            if (event.targetTouches.length > 1) {
                return;
            }
            $("#" + arg.renderTo + " figure span").css("color", arg.focusColor);
            identifier = event.changedTouches[0].identifier;
            isEdit = true;
            if (event.targetTouches.length == 1) {
                event.preventDefault();
                $("#" + arg.renderTo).css("transition", "transform 0s");
                $("#" + arg.renderTo + " figure").css("transition", "transform 0s");
                /*点击立即停止*/
                if (cons.isRolling) {
                    cons.isRolling = false;
                    if (cons._time != 0) {
                        clearTimeout(cons._time);
                    }
                    InitScale();
                }
                //initR = carousel.rotation;
                initR = calRoationOffset();

                var touch = event.targetTouches[0];
                lastMoveStart = StartX = lastX = touch.pageX;
                lastMoveTime = new Date().getTime();
                /*点击全部显示*/
                showAllItem();

                replaceImgsrc();
            }
        }, false);

        /**
         * 移动
         * */
        objDOM.addEventListener('touchmove', function (event) {
            if (event.changedTouches[0].identifier != identifier) {
                return;
            }
            if (event.targetTouches.length == 1) {
                var touch = event.targetTouches[0];
                var tindex=0;
                for(var i=0;i<event.touches.length;i++)
                {
                    if(event.touches[i].target.parentNode.id==arg.containerID)
                    {
                        tindex=i;
                        break;
                    }
                }

                var nowX = event.touches[tindex].pageX;
                var dir = (nowX - lastX) > 0 ? 1 : -1;
                var len = lastX - nowX;
                /*根据move移动距离移动数字*/
                var moveX = nowX - StartX;
                var tag = 0;
                var dirition = moveX >= 0 ? -1 : 1;
                /*加速度方向*/
                for (var i = 0; i < Math.abs(len); i++) {
                    if (dir == 1) {
                        /*鼠标拖右*/
                        valpresect = ((lastX - StartX + tag) / carousel.panelWith) * carousel.theta;
                        tag++;
                    }
                    else {
                        /*鼠标拖右*/
                        valpresect = ((lastX - StartX + tag) / carousel.panelWith) * carousel.theta;
                        tag--;
                    }
                    if (calRoationOffset() != valpresect) {
                        carousel.rotation = initR + valpresect;
                        carousel.transform();
                    }
                    var valpresect, prec;
                    //var roleval = carousel.rotation / carousel.theta;
                    var roleval = calRoationOffset() / carousel.theta;
                    if (roleval > 0) {
                        tmpVal = completCount - roleval % completCount;
                    }
                    else if (roleval < 0) {
                        tmpVal = roleval % completCount * -1;
                    }
                    else {
                        tmpVal = 0;
                    }

                    if (dirition == 1) {
                        tmpVal = Math.floor(tmpVal);
                    } else {
                        tmpVal = Math.ceil(tmpVal);
                    }
                    //console.log(tmpVal);
                    tmpVal = tmpVal % completCount;

                    prec = Math.abs((valpresect % carousel.theta) / carousel.theta);
                    //  console.log("valpresect:" + valpresect + " prec:" + prec);
                    setVal(tmpVal);
                }
                /*移动跟随放大缩小*/
                calScale(-1 * dirition, prec);
                lastX = nowX;
                /**
                 * 缓动代码
                 */
                var nowTime = new Date().getTime();
                if (nowTime - lastMoveTime > 300) {
                    lastMoveTime = nowTime;
                    lastMoveStart = nowX;
                }
            }
        }, false);

        /**
         * 选择离开
         * */
        objDOM.addEventListener('touchend', function (event) {
            ca_end(event);
        }, false);
		
		/**意外退出*/
		objDOM.addEventListener('touchcancel',function(event){
			 ca_end(event);
		},false);
		
		function ca_end(event){
			if (event.changedTouches[0].identifier != identifier) {
                return;
            }
            identifier = -1;
            isEdit = false;
            isEditTime = new Date().getTime();
            // if (rollBack()) {
            //     return;
            // }
            var moveX = lastX - lastMoveStart;
            var checkMove = lastX - StartX;
            var dirition = checkMove >= 0 ? -1 : 1;
            var checkDis = Math.abs(checkMove);
            var nowTime = new Date().getTime();
            var v = moveX / (nowTime - lastMoveTime);
            /*最后一段时间手指划动速度*/
            var dir = v > 0 ? -1 : 1;
            /*加速度方向*/
            /*没有移动,消失其它*/
            if (checkDis == 0) {
                $("#" + arg.renderTo + " figure").css("transition", "color 1s ");
                $("#" + arg.renderTo).css("transition", "transform 0.2s ease-out");
                carousel.rotation = autoComplete(dir, calRoationOffset(), 0);
                carousel.transform();
                /**算出selectVal*/
                var va = -1 * (calRoationOffset() / carousel.theta) % completCount;
                if (va < 0) {
                    va = completCount + va;
                }
                setVal(va);
                showSelectItem();
                InitScale();
                replaceImgsrc_Defalut();
                return;
            }
            cons.startRotation = calRoationOffset();
            /*记录准备滚动前的角度用于再次点击立即停止滚动*/
            /**
             * 缓动代码
             */
            var deceleration = dir * 0.0006;
            var duration = v / deceleration;
            /*速度消减至0所需时间*/
            var dist = v * duration / 2;
            /*最终移动多少*/
            var val = parseInt(dist / (carousel.panelSize));
            var t = Math.abs(duration) / 1000;
            if (t > 1) {
                t = t - parseInt(t) + 1;
            }
            /*t = t > 2 ? 0.2 : t;
             t = t > 1 ? 0.2 : t;*/
            // if (t < 1) {
                t = 0.35;
            // }
            $("#" + arg.renderTo).css("transition", "transform " + t + "s ");
            $("#" + arg.renderTo + " figure").css("transition", "color .35s ");
            if (isNaN(val))
                val = 0;
            /*根据方向补剩余移动量*/
            val = 0;
            /*hardcode 此版本不缓动*/
            carousel.rotation = autoComplete(dir, calRoationOffset(), val);
            if (rollBack()) {
                var idx = Math.abs(calRoationOffset() / carousel.theta) % completCount;
                if (idx != lastIDX) {
                    lastIDX=idx;
                    setTimeout(function () {
                        arg.onChange(idx);
                    },350);
                }
                replaceImgsrc_Defalut();
                return;
            }
            carousel.transform();

            var va2 = -1 * (calRoationOffset() / carousel.theta) % completCount;
            var va = -1 * (calRoationOffset() / carousel.theta) % completCount;
            // console.log("carousel.rotation:"+carousel.rotation+  "  calRoationOffset:"+calRoationOffset());

            if (va < 0) {
                va = completCount + va;
            }
            setVal(va);
            cons.diretion = dir;
            cons.isRolling = true;
            cons.rollTime = t * 1000;
            cons.targetRotation = calRoationOffset();
            cons.sysTime = new Date().getTime();
            cons._time = setTimeout(function () {
                if (cons.isRolling) {
                    cons.isRolling = false;
                    showSelectItem();
                    cons._time = 0;
                }
            }, t * 1000);

            if (lastIDX != selectVal) {
                lastIDX = selectVal;
                setTimeout(function () {
                    arg.onChange(selectVal);
                },350);
            }
            InitScale();
            replaceImgsrc_Defalut();
		}

        /**回弹*/
        function rollBack() {
            if (arg.loop) {
                return false;
            }
            if (carousel.rotation > 0) {
                $("#" + arg.renderTo).css("transition", "transform 0.2s ease-out");
                carousel.rotation = 0;
                carousel.transform();
                setVal(0);
                showSelectItem();
                InitScale();
                return true;
            }
            else if (carousel.rotation < maxRoation) {
                $("#" + arg.renderTo).css("transition", "transform 0.2s ease-out");
                carousel.rotation = maxRoation;
                carousel.transform();
                setVal(defalutCount - 1);
                showSelectItem();
                InitScale();
                return true;
            }
            else
                return false;
        }

        /**
         * 自动补偿
         * */
        function autoComplete(dir, currentRotation, val) {
            var result = currentRotation;
            /*根据方向补剩余移动量*/
            var tmp = (carousel.theta + calRoationOffset() % carousel.theta) % carousel.theta;
            if (dir == 1) {
                /*手左滑*/
                /*不够20%不移动*/
                if ((tmp * 100 / carousel.theta) < 80) {
                    result = result - tmp;
                    result += Math.abs(val) * dir * -1 * carousel.theta;
                } else {
                    /*复原*/
                    result = result + (carousel.theta - Math.abs(tmp));
                    result += Math.abs(val) * dir * -1 * carousel.theta;
                }
            }
            else {/*手右滑*/
                tmp = carousel.theta - Math.abs(tmp);
                if ((tmp * 100 / carousel.theta) < 80) {
                    result = result + tmp;
                    result += Math.abs(val) * dir * -1 * carousel.theta;
                } else {
                    result = result - (carousel.theta - Math.abs(tmp));
                    result += Math.abs(val) * dir * -1 * carousel.theta;
                }
            }
            return Math.round(result);
        }

        var setVal = function (val) {
            var val = Math.round(val) % completCount;
            if (val != selectVal) {
                selectVal = val;
                //console.warn(selectVal)
            }
        }

        /**
         * 初始化时候的item数量
         * */
        var getDefaultCount = function () {
            return defalutCount;
        }

        /**
         * 初始化温度指大小（选中值放大）
         * */
        function InitScale() {
            obj.children().each(function (i, n) {
                var panel = $(n);
                if (i == selectVal) {
                    var angle = carousel.theta * (i - completCount);
                    var tra = 'rotateY(' + angle + 'deg) translateZ(' + carousel.radius + 'px) scaleX(1) scaleY(1)';
                    panel.css('transform', tra);
                    panel.css('margin-top', 0);
                } else {
                    var angle = carousel.theta * (i - completCount);
                    var tra = 'rotateY(' + angle + 'deg) translateZ(' + carousel.radius + 'px) scaleX(' + arg.scale + ') scaleY(' + arg.scale + ')';
                    panel.css('transform', tra);
                    panel.css('margin-top', panel.height() * (1 - arg.scale) / 2);
                }
            });
        }

        /**
         * dir:现在方向
         * precent:移动百分比
         * */
        function calScale(dir, precent) {
            var leftIDX, rightIDX;
            var s_scale, s_margin, s_attr;
            leftIDX = selectVal - 1;
            rightIDX = selectVal + 1;
            if (selectVal == 0) {
                leftIDX = completCount - 1;
            } else if (selectVal == (completCount - 1)) {
                rightIDX = 0;
            }
            obj.children().each(function (idx, n) {
                var panel = $(n);
                if (idx == leftIDX) {
                    if (dir == -1) {
                        s_scale = arg.scale;
                        s_margin = (panel.height() * (1 - arg.scale) / 2);
                        s_attr = 'rotateY(' + carousel.theta * idx + 'deg) translateZ(' + carousel.radius + 'px) scaleX(' + s_scale.toFixed(2) + ') scaleY(' + s_scale.toFixed(2) + ')';
                    } else {
                        s_scale = arg.scale + (1 - arg.scale) * precent;
                        s_margin = (panel.height() * (1 - arg.scale) / 2) * (1 - precent);
                        s_attr = 'rotateY(' + carousel.theta * idx + 'deg) translateZ(' + carousel.radius + 'px) scaleX(' + s_scale.toFixed(2) + ') scaleY(' + s_scale.toFixed(2) + ')';
                    }
                    panel.css('transform', s_attr);
                    panel.css('margin-top', s_margin);
                } else if (idx == selectVal) {
                    s_scale = 1 - (1 - arg.scale) * precent;
                    s_margin = (panel.height() * (1 - arg.scale) / 2) * precent;
                    s_attr = 'rotateY(' + carousel.theta * idx + 'deg) translateZ(' + carousel.radius + 'px) scaleX(' + s_scale.toFixed(2) + ') scaleY(' + s_scale.toFixed(2) + ')';
                    panel.css('transform', s_attr);
                    panel.css('margin-top', s_margin);
                    //console.log("idx:"+idx+" s_scale:"+s_scale+" precent:"+precent+ "  ___s_attr:"+s_attr);
                } else if (idx == rightIDX) {
                    if (dir == -1) {
                        s_scale = arg.scale + (1 - arg.scale) * precent;
                        s_margin = (panel.height() * (1 - arg.scale) / 2) * (1 - precent);
                        s_attr = 'rotateY(' + carousel.theta * idx + 'deg) translateZ(' + carousel.radius + 'px) scaleX(' + s_scale.toFixed(2) + ') scaleY(' + s_scale.toFixed(2) + ')';
                    } else {
                        s_scale = arg.scale;
                        s_margin = (panel.height() * (1 - arg.scale) / 2);
                        s_attr = 'rotateY(' + carousel.theta * idx + 'deg) translateZ(' + carousel.radius + 'px) scaleX(' + s_scale.toFixed(2) + ') scaleY(' + s_scale.toFixed(2) + ')';
                    }
                    panel.css('transform', s_attr);
                    panel.css('margin-top', s_margin);
                }
            });
        }

        /**只显示选择值*/
        function showSelectItem() {
            obj.children().each(function (i, n) {
                    var panel = $(n);
                    if (!arg.loop) {
                        if (i >= 0 && i < defalutCount) {
                            if (i != selectVal) {
                                panel.stop();
                                panel.fadeOut(fadeOutTime);
                            } else {
                                panel.stop();
                                panel.css("opacity", "1");
                                panel.show();
                            }
                        } else {
                            panel.stop();
                            panel.css("opacity", "0.01");
                            panel.show();
                        }
                    }
                    else {
                        if (i != selectVal) {
                            panel.stop();
                            panel.fadeOut(fadeOutTime);
                        } else {
                            panel.stop();
                            panel.css("opacity", "1");
                            panel.show();
                        }
                    }
                }
            );
            // $("#" + arg.renderTo + " figure").css("color", arg.fontColor || '#444659');
            $("#" + arg.renderTo + " figure span").attr("style",arg.dataStyle);
        }

        /**只显示选择值*/
        function showSelectItem_NoFade() {
            obj.children().each(function (i, n) {
                    var panel = $(n);
                    if (i != selectVal) {
                        panel.stop();
                        panel.hide();
                    } else {
                        panel.stop();
                        panel.css("opacity", "1");
                        panel.show();
                    }
                }
            );
            // $("#" + arg.renderTo + " figure").css("color", arg.fontColor);
            $("#" + arg.renderTo + " figure span").attr("style",arg.dataStyle);
        }

        /**显示全部选择值*/
        function showAllItem() {
            obj.children().each(function (i, n) {
                var panel = $(n);
                if (!arg.loop) {
                    if (i >= 0 && i < defalutCount) {
                        panel.stop();
                        panel.css("opacity", "1");
                        panel.show();
                    } else {
                        panel.stop();
                        panel.css("opacity", "0.01");
                        panel.show();
                    }
                } else {
                    panel.stop();
                    panel.css("opacity", "1");
                    panel.show();
                }
            });
        }

        function replaceImgsrc() {
            if (tapData != undefined && tapData != "") {
                obj.find("img").each(function () {
                    var img = $(this);
                    var dataVal = img.data(tapData);
                    if (dataVal != undefined) {
                        img.attr("src", dataVal);
                    }
                });
            }
        }

        function replaceImgsrc_Defalut() {
            obj.find("img").each(function (i, n) {
                if (selectVal == i) {
                    if (defaultImg.length != 0) {
                        $(n)[0].src = defaultImg[i];
                    }
                }
            });
        }

        function calRoationOffset() {
            var ret = 0;
            var va1 = carousel.rotation + roationffset;
            var va2 = carousel.rotation - roationffset;
            if ((va1 % carousel.theta ) == 0) {
                ret = va1;
            } else if ((va2 % carousel.theta) == 0) {
                ret = va2;
            } else {
                ret = carousel.rotation;
            }
            return ret;
        }


        var init = function init() {
            $("#" + arg.renderTo).css("transition", "transform 0s");
            $("#" + arg.renderTo + " figure").css("transition", "transform 0s");
            var el = document.getElementById(arg.renderTo);
            carousel = new Carousel(el);
            obj.html("");
            var figureData = arg.data;//滚轮内容
            setFigure(figureData);
        };

        //设置滚轮内容
        function setFigure(data) {
            //[{key:'key',value:[]},{key:'key',value:[]},{key:'key',value:[]}] 组装后数据格式
            var curData = paramsArr(data);
            var curCount = defalutCount = curData[0].value.length;
            var figureHtml='';
            completCount = getFiguCount(curCount);

            if (data.hasOwnProperty('html')) {
                figureHtml = setHtmlFigure(data,completCount);
            } else {
                figureHtml = setImgFigure(curData,completCount);
            }

            // console.debug('【组装完 HTML】：\n' +figureHtml);

            obj.html(figureHtml);
            carousel.panelCount = completCount;
            if ( !$(carousel.element).hasClass('panels-backface-invisible') ) {
                $(carousel.element).addClass('panels-backface-invisible')
            }
            // carousel.element.toggleClassName('panels-backface-invisible');
            carousel.modify();
            setValue(0);
            InitScale();
            maxRoation = -1 * carousel.theta * (defalutCount - 1);
            roationffset = carousel.theta % (parseInt(carousel.theta));

            //  组装输入 html 字符串
            function setHtmlFigure(data,nCount) {
                var tmpHtml='',index,
                    items = data.html,
                    len = items.length;
                for (var i=0; i<nCount; i++) {
                    index = i % len;
                    tmpHtml += '<figure style="'+arg.dataStyle+'">'+'<span>'+items[index]+'</span></figure>';
                }
                return tmpHtml;
            }

            //  组装图片 html 字符串
            function setImgFigure(data,count) {
                var tmpHtml='',imgHtml='',curItem='',index=0;
                var dataName='';
                var firData = data[0];
                var firSrc = defaultImg = firData.value;

                for (var m=0; m<count; m++) {
                    imgHtml = '';
                    index = m % firSrc.length;
                    for (var n=0; n<data.length; n++) {
                        curItem = data[n];
                        dataName = n ? ' data-' + curItem.key : ' src';
                        imgHtml += dataName + '=' + curItem.value[index];
                    }
                    tmpHtml += '<figure><img style="'+arg.dataStyle+'" '+imgHtml+'/></figure>';
                }
                return tmpHtml;
            }

            //  组装数据
            function paramsArr(data) {
                if (typeof data !== 'undefined') {
                    var tmpArr = [];
                    for (var key in data) {
                        tmpArr.push ({
                            key: key,
                            value: arg.reverse ? data[key].reverse() : data[key]
                        });
                    }
                    return tmpArr;
                }
            }

            //  计算当前滚轮item总数
            function getFiguCount(count) {
                if (typeof count === 'number') {
                    var tmpCount;
                    if (count <= 45) {
                        tmpCount = 45;
                    } else if (count > 45 && count <= 60) {
                        tmpCount = 60;
                    } else if (count > 60 && count <= 90) {
                        tmpCount = 90;
                    } else if (count > 90 && count <= 120) {
                        tmpCount = 120;
                    } else if (count > 120 && count <= 150) {
                        tmpCount = 150;
                    } else if (count > 150 && count <= 180) {
                        tmpCount = 180;
                    } else if (count > 180 && count <= 240) {
                        tmpCount = 240;
                    } else if (count > 240 && count <= 300) {
                        tmpCount = 300;
                    } else if (count > 300 && count <= 360) {
                        tmpCount = 360;
                    } else {
                        tmpCount = Math.ceil(count/360) * 360;
                    }
                    return tmpCount;
                }
            }
        }

        /**
         * 外部调用方法
         * */
        var setValue = function (i) {
            isEdit=false;
            identifier=-1;
            if (!arg.loop) {
                if (i < 0 || i >= defalutCount) {
                    return;
                }
            }
            $("#" + arg.renderTo).css("transition", "transform 0s");
            $("#" + arg.renderTo + " figure").css("transition", "transform 0s");
            lastIDX = selectVal = i;
            carousel.rotation = -1 * carousel.theta * selectVal;
            carousel.transform();
            InitScale();
            replaceImgsrc_Defalut();
            showSelectItem_NoFade();
        }
        var getValue = function () {

        }
        var data = function (val) {
            tapData = val;
        }

        var isEditing = function () {
            var ret = false;
            if (isEdit) {
                ret = true;
            } else {
                var nowTime = new Date().getTime();
                if ((nowTime - isEditTime) < 5000) {
                    ret = true;
                }
            }
            return ret;
        }
        
        var isFinishedOption=function () {
            var ret = false;
            var nowTime = new Date().getTime();
            if ((nowTime - isEditTime) < 300) {
                ret = true;
            }
            return ret;
        }
        
        init();
        return {
            setValue: setValue,
            getValue: getValue,
            data: data,
            isEditing: isEditing,
            setFigure: setFigure,
            hide: function () {
                var curId =arg.containerID;
                $("#"+curId).css({"position":"absolute", "left":"-9999px"});
            },
            show: function () {
                var curId =arg.containerID;
                $("#"+curId).css({"position":"relative", "left":"0"});
            }
        };
    }

)

//横滚控件
function Carousel(el) {
    this.element = el;

    this.rotation = 0;
    this.panelCount = 0;
    this.totalPanelCount = this.element.children.length;
    this.theta = 0;
    this.panelWith = 0;
    this.isHorizontal = true;
}

Carousel.prototype.modify = function (isReset) {
    var panel, angle, i;

    this.panelWith = this.panelSize = this.element[this.isHorizontal ? 'offsetWidth' : 'offsetHeight'];

    this.rotateFn = this.isHorizontal ? 'rotateY' : 'rotateX';
    this.theta = 360 / this.panelCount;

    // do some trig to figure out how big the carousel
    // is in 3D space
    this.radius = Math.round(( this.panelSize / 2) / Math.tan(Math.PI / this.panelCount));

    for (i = 0; i < this.panelCount; i++) {
        panel = this.element.children[i];
        angle = this.theta * i;
        panel.style.opacity = 1;
        // panel.style.backgroundColor = 'hsla(' + angle + ', 100%, 50%, 0.8)';
        // rotate panel, then push it out in 3D space
        panel.style[transformProp] = this.rotateFn + '(' + angle + 'deg) translateZ(' + this.radius + 'px)';
    }

    // hide other panels
    // for (  ; i < this.totalPanelCount; i++ ) {
    //     panel = this.element.children[i];
    //     panel.style.opacity = 0;
    //     panel.style[ transformProp ] = 'none';
    // }

    // adjust rotation so panels are always flat
    this.rotation = Math.round(this.rotation / this.theta) * this.theta;

    this.transform();
};

Carousel.prototype.transform = function () {
    this.element.style[transformProp] = 'translateZ(-' + this.radius + 'px) ' + this.rotateFn + '(' + this.rotation + 'deg)';
};


// ======================= DOM Utility Functions from PastryKit =============================== //

// Sure, we could use jQuery or XUI for these, 
// but these are concise and will work with plain vanilla JS

Element.prototype.hasClassName = function (a) {
    return new RegExp("(?:^|\\s+)" + a + "(?:\\s+|$)").test(this.className);
};

Element.prototype.addClassName = function (a) {
    if (!this.hasClassName(a)) {
        this.className = [this.className, a].join(" ");
    }
};

Element.prototype.removeClassName = function (b) {
    if (this.hasClassName(b)) {
        var a = this.className;
        this.className = a.replace(new RegExp("(?:^|\\s+)" + b + "(?:\\s+|$)", "g"), " ");
    }
};

Element.prototype.toggleClassName = function (a) {
    this["addClassName"](a);
    //this[this.hasClassName(a) ? "removeClassName" : "addClassName"](a);
};


// ======================= Modernizr =============================== //

/* Modernizr 2.0.6 (Custom Build) | MIT & BSD
 * Build: http://www.modernizr.com/download/#-csstransforms3d-iepp-cssclasses-prefixed-teststyles-testprop-testallprops-prefixes-domprefixes-load
 */
;window.Modernizr = function (a, b, c) {
    function C(a, b) {
        var c = a.charAt(0).toUpperCase() + a.substr(1), d = (a + " " + o.join(c + " ") + c).split(" ");
        return B(d, b)
    }

    function B(a, b) {
        for (var d in a)if (k[a[d]] !== c)return b == "pfx" ? a[d] : !0;
        return !1
    }

    function A(a, b) {
        return !!~("" + a).indexOf(b)
    }

    function z(a, b) {
        return typeof a === b
    }

    function y(a, b) {
        return x(n.join(a + ";") + (b || ""))
    }

    function x(a) {
        k.cssText = a
    }

    var d = "2.0.6", e = {}, f = !0, g = b.documentElement, h = b.head || b.getElementsByTagName("head")[0], i = "modernizr", j = b.createElement(i), k = j.style, l, m = Object.prototype.toString, n = " -webkit- -moz- -o- -ms- -khtml- ".split(" "), o = "Webkit Moz O ms Khtml".split(" "), p = {}, q = {}, r = {}, s = [], t = function (a, c, d, e) {
        var f, h, j, k = b.createElement("div");
        if (parseInt(d, 10))while (d--)j = b.createElement("div"), j.id = e ? e[d] : i + (d + 1), k.appendChild(j);
        f = ["&shy;", "<style>", a, "</style>"].join(""), k.id = i, k.innerHTML += f, g.appendChild(k), h = c(k, a), k.parentNode.removeChild(k);
        return !!h
    }, u, v = {}.hasOwnProperty, w;
    !z(v, c) && !z(v.call, c) ? w = function (a, b) {
        return v.call(a, b)
    } : w = function (a, b) {
        return b in a && z(a.constructor.prototype[b], c)
    };
    var D = function (a, c) {
        var d = a.join(""), f = c.length;
        t(d, function (a, c) {
            var d = b.styleSheets[b.styleSheets.length - 1], g = d.cssRules && d.cssRules[0] ? d.cssRules[0].cssText : d.cssText || "", h = a.childNodes, i = {};
            while (f--)i[h[f].id] = h[f];
            e.csstransforms3d = i.csstransforms3d.offsetLeft === 9
        }, f, c)
    }([, ["@media (", n.join("transform-3d),("), i, ")", "{#csstransforms3d{left:9px;position:absolute}}"].join("")], [, "csstransforms3d"]);
    p.csstransforms3d = function () {
        var a = !!B(["perspectiveProperty", "WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"]);
        a && "webkitPerspective" in g.style && (a = e.csstransforms3d);
        return a
    };
    for (var E in p)w(p, E) && (u = E.toLowerCase(), e[u] = p[E](), s.push((e[u] ? "" : "no-") + u));
    x(""), j = l = null, a.attachEvent && function () {
        var a = b.createElement("div");
        a.innerHTML = "<elem></elem>";
        return a.childNodes.length !== 1
    }() && function (a, b) {
        function s(a) {
            var b = -1;
            while (++b < g)a.createElement(f[b])
        }

        a.iepp = a.iepp || {};
        var d = a.iepp, e = d.html5elements || "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", f = e.split("|"), g = f.length, h = new RegExp("(^|\\s)(" + e + ")", "gi"), i = new RegExp("<(/*)(" + e + ")", "gi"), j = /^\s*[\{\}]\s*$/, k = new RegExp("(^|[^\\n]*?\\s)(" + e + ")([^\\n]*)({[\\n\\w\\W]*?})", "gi"), l = b.createDocumentFragment(), m = b.documentElement, n = m.firstChild, o = b.createElement("body"), p = b.createElement("style"), q = /print|all/, r;
        d.getCSS = function (a, b) {
            if (a + "" === c)return "";
            var e = -1, f = a.length, g, h = [];
            while (++e < f) {
                g = a[e];
                if (g.disabled)continue;
                b = g.media || b, q.test(b) && h.push(d.getCSS(g.imports, b), g.cssText), b = "all"
            }
            return h.join("")
        }, d.parseCSS = function (a) {
            var b = [], c;
            while ((c = k.exec(a)) != null)b.push(((j.exec(c[1]) ? "\n" : c[1]) + c[2] + c[3]).replace(h, "$1.iepp_$2") + c[4]);
            return b.join("\n")
        }, d.writeHTML = function () {
            var a = -1;
            r = r || b.body;
            while (++a < g) {
                var c = b.getElementsByTagName(f[a]), d = c.length, e = -1;
                while (++e < d)c[e].className.indexOf("iepp_") < 0 && (c[e].className += " iepp_" + f[a])
            }
            l.appendChild(r), m.appendChild(o), o.className = r.className, o.id = r.id, o.innerHTML = r.innerHTML.replace(i, "<$1font")
        }, d._beforePrint = function () {
            p.styleSheet.cssText = d.parseCSS(d.getCSS(b.styleSheets, "all")), d.writeHTML()
        }, d.restoreHTML = function () {
            o.innerHTML = "", m.removeChild(o), m.appendChild(r)
        }, d._afterPrint = function () {
            d.restoreHTML(), p.styleSheet.cssText = ""
        }, s(b), s(l);
        d.disablePP || (n.insertBefore(p, n.firstChild), p.media = "print", p.className = "iepp-printshim", a.attachEvent("onbeforeprint", d._beforePrint), a.attachEvent("onafterprint", d._afterPrint))
    }(a, b), e._version = d, e._prefixes = n, e._domPrefixes = o, e.testProp = function (a) {
        return B([a])
    }, e.testAllProps = C, e.testStyles = t, e.prefixed = function (a) {
        return C(a, "pfx")
    }, g.className = g.className.replace(/\bno-js\b/, "") + (f ? " js " + s.join(" ") : "");
    return e
}(this, this.document), function (a, b, c) {
    function k(a) {
        return !a || a == "loaded" || a == "complete"
    }

    function j() {
        var a = 1, b = -1;
        while (p.length - ++b)if (p[b].s && !(a = p[b].r))break;
        a && g()
    }

    function i(a) {
        var c = b.createElement("script"), d;
        c.src = a.s, c.onreadystatechange = c.onload = function () {
            !d && k(c.readyState) && (d = 1, j(), c.onload = c.onreadystatechange = null)
        }, m(function () {
            d || (d = 1, j())
        }, H.errorTimeout), a.e ? c.onload() : n.parentNode.insertBefore(c, n)
    }

    function h(a) {
        var c = b.createElement("link"), d;
        c.href = a.s, c.rel = "stylesheet", c.type = "text/css";
        if (!a.e && (w || r)) {
            var e = function (a) {
                m(function () {
                    if (!d)try {
                        a.sheet.cssRules.length ? (d = 1, j()) : e(a)
                    } catch (b) {
                        b.code == 1e3 || b.message == "security" || b.message == "denied" ? (d = 1, m(function () {
                            j()
                        }, 0)) : e(a)
                    }
                }, 0)
            };
            e(c)
        } else c.onload = function () {
            d || (d = 1, m(function () {
                j()
            }, 0))
        }, a.e && c.onload();
        m(function () {
            d || (d = 1, j())
        }, H.errorTimeout), !a.e && n.parentNode.insertBefore(c, n)
    }

    function g() {
        var a = p.shift();
        q = 1, a ? a.t ? m(function () {
            a.t == "c" ? h(a) : i(a)
        }, 0) : (a(), j()) : q = 0
    }

    function f(a, c, d, e, f, h) {
        function i() {
            !o && k(l.readyState) && (r.r = o = 1, !q && j(), l.onload = l.onreadystatechange = null, m(function () {
                u.removeChild(l)
            }, 0))
        }

        var l = b.createElement(a), o = 0, r = {t: d, s: c, e: h};
        l.src = l.data = c, !s && (l.style.display = "none"), l.width = l.height = "0", a != "object" && (l.type = d), l.onload = l.onreadystatechange = i, a == "img" ? l.onerror = i : a == "script" && (l.onerror = function () {
            r.e = r.r = 1, g()
        }), p.splice(e, 0, r), u.insertBefore(l, s ? null : n), m(function () {
            o || (u.removeChild(l), r.r = r.e = o = 1, j())
        }, H.errorTimeout)
    }

    function e(a, b, c) {
        var d = b == "c" ? z : y;
        q = 0, b = b || "j", C(a) ? f(d, a, b, this.i++, l, c) : (p.splice(this.i++, 0, a), p.length == 1 && g());
        return this
    }

    function d() {
        var a = H;
        a.loader = {load: e, i: 0};
        return a
    }

    var l = b.documentElement, m = a.setTimeout, n = b.getElementsByTagName("script")[0], o = {}.toString, p = [], q = 0, r = "MozAppearance" in l.style, s = r && !!b.createRange().compareNode, t = r && !s, u = s ? l : n.parentNode, v = a.opera && o.call(a.opera) == "[object Opera]", w = "webkitAppearance" in l.style, x = w && "async" in b.createElement("script"), y = r ? "object" : v || x ? "img" : "script", z = w ? "img" : y, A = Array.isArray || function (a) {
            return o.call(a) == "[object Array]"
        }, B = function (a) {
        return Object(a) === a
    }, C = function (a) {
        return typeof a == "string"
    }, D = function (a) {
        return o.call(a) == "[object Function]"
    }, E = [], F = {}, G, H;
    H = function (a) {
        function f(a) {
            var b = a.split("!"), c = E.length, d = b.pop(), e = b.length, f = {url: d, origUrl: d, prefixes: b}, g, h;
            for (h = 0; h < e; h++)g = F[b[h]], g && (f = g(f));
            for (h = 0; h < c; h++)f = E[h](f);
            return f
        }

        function e(a, b, e, g, h) {
            var i = f(a), j = i.autoCallback;
            if (!i.bypass) {
                b && (b = D(b) ? b : b[a] || b[g] || b[a.split("/").pop().split("?")[0]]);
                if (i.instead)return i.instead(a, b, e, g, h);
                e.load(i.url, i.forceCSS || !i.forceJS && /css$/.test(i.url) ? "c" : c, i.noexec), (D(b) || D(j)) && e.load(function () {
                    d(), b && b(i.origUrl, h, g), j && j(i.origUrl, h, g)
                })
            }
        }

        function b(a, b) {
            function c(a) {
                if (C(a))e(a, h, b, 0, d); else if (B(a))for (i in a)a.hasOwnProperty(i) && e(a[i], h, b, i, d)
            }

            var d = !!a.test, f = d ? a.yep : a.nope, g = a.load || a.both, h = a.callback, i;
            c(f), c(g), a.complete && b.load(a.complete)
        }

        var g, h, i = this.yepnope.loader;
        if (C(a))e(a, 0, i, 0); else if (A(a))for (g = 0; g < a.length; g++)h = a[g], C(h) ? e(h, 0, i, 0) : A(h) ? H(h) : B(h) && b(h, i); else B(a) && b(a, i)
    }, H.addPrefix = function (a, b) {
        F[a] = b
    }, H.addFilter = function (a) {
        E.push(a)
    }, H.errorTimeout = 1e4, b.readyState == null && b.addEventListener && (b.readyState = "loading", b.addEventListener("DOMContentLoaded", G = function () {
        b.removeEventListener("DOMContentLoaded", G, 0), b.readyState = "complete"
    }, 0)), a.yepnope = d()
}(this, this.document), Modernizr.load = function () {
    yepnope.apply(window, [].slice.call(arguments, 0))
};
var transformProp = Modernizr.prefixed('transform');
// ======================= DDD mini framework =============================== //

(function () {


    var DDD = {};
// again, borrowed from PastryKit
    DDD.isTangible = !!('createTouch' in document);
    DDD.CursorStartEvent = DDD.isTangible ? 'touchstart' : 'mousedown';
    DDD.CursorMoveEvent = DDD.isTangible ? 'touchmove' : 'mousemove';
    DDD.CursorEndEvent = DDD.isTangible ? 'touchend' : 'mouseup';

// get i.e. 'WebkitTransform'
    var transformProp = Modernizr.prefixed('transform');

    /* ==================== EventHandler ==================== */

    DDD.EventHandler = function () {
    };

    DDD.EventHandler.prototype.handleEvent = function (event) {
        if (this[event.type]) {
            this[event.type](event);
        }
    };


    /* ==================== RangeDisplay ==================== */

// displays the value of a range input
// why isn't this in the HTML5 spec?

    DDD.RangeDisplay = function (range) {
        this.range = range;
        this.output = document.createElement('span');
        this.output.addClassName('range-display');


        this.units = this.range.getAttribute('data-units') || '';

        // this.output.textContent = this.range.value;
        this.change();


        this.range.parentNode.appendChild(this.output);

        this.range.addEventListener('change', this, false);
    };

    DDD.RangeDisplay.prototype = new DDD.EventHandler();

    DDD.RangeDisplay.prototype.change = function (event) {
        this.output.textContent = this.range.value + this.units;
    };


    /* ==================== ProxyRange ==================== */

// polyfill for range inputs
// by no means a production-ready solution, but it'll do for these demos

    DDD.ProxyRange = function (input) {
        this.input = input;

        this.slider = document.createElement('div');
        this.slider.addClassName('proxy-range');

        this.handle = document.createElement('div');
        this.handle.addClassName('handle');
        this.slider.appendChild(this.handle);


        this.width = parseInt(getComputedStyle(this.input).width, 10);
        this.slider.style.width = this.width + 'px';

        this.min = parseInt(this.input.getAttribute('min') || 0, 10);
        this.max = parseInt(this.input.getAttribute('max') || 100, 10);

        this.normalizeRatio = ( this.max - this.min ) / ( this.width - DDD.ProxyRange.lineCap * 2 );

        this.value = this.input.value;

        this.resetHandlePosition();

        this.slider.addEventListener(DDD.CursorStartEvent, this, false);
        this.handle.addEventListener(DDD.CursorStartEvent, this, false);

        this.input.parentNode.insertBefore(this.slider, this.input.nextSibling);
        this.input.style.display = 'none';

        this.x = this.slider.offsetLeft;

    };

// constant for position the handle inside the slider
    DDD.ProxyRange.lineCap = 15;

    DDD.ProxyRange.prototype = new DDD.EventHandler();

    DDD.ProxyRange.prototype.moveHandle = function (event) {
        var cursor = DDD.isTangible ? event.touches[0] : event,
            x = cursor.pageX - this.x;
        x = Math.max(DDD.ProxyRange.lineCap, Math.min(this.width - DDD.ProxyRange.lineCap, x));

        this.positionHandle(x);

        this.value = Math.round(( x - DDD.ProxyRange.lineCap ) * this.normalizeRatio + this.min);

        if (this.input.value != this.value) {
            this.input.value = this.value;

            // trigger change event
            var evt = document.createEvent("Event");
            evt.initEvent("change", true, true);
            this.input.dispatchEvent(evt);
        }

    };

    DDD.ProxyRange.prototype.positionHandle = function (x) {
        this.handle.style[transformProp] = DDD.translate(x, 0);
    };

    DDD.ProxyRange.prototype.resetHandlePosition = function () {
        var x = ( this.value - this.min ) / this.normalizeRatio + DDD.ProxyRange.lineCap;
        this.positionHandle(x);
    };


    DDD.ProxyRange.prototype[DDD.CursorStartEvent] = function (event) {
        this.slider.addClassName('highlighted');

        this.moveHandle(event);

        window.addEventListener(DDD.CursorMoveEvent, this, false);
        window.addEventListener(DDD.CursorEndEvent, this, false);

        event.preventDefault();
    };

    DDD.ProxyRange.prototype[DDD.CursorMoveEvent] = function (event) {

        this.moveHandle(event);

        event.preventDefault();
    };

    DDD.ProxyRange.prototype[DDD.CursorEndEvent] = function (event) {

        this.slider.removeClassName('highlighted');

        window.removeEventListener(DDD.CursorMoveEvent, this, false);
        window.removeEventListener(DDD.CursorEndEvent, this, false);
    };


    /* ==================== Test 3D transform support ==================== */

    DDD.translate = Modernizr.csstransforms3d ?
        function (x, y) {
            return 'translate3d(' + x + 'px, ' + y + 'px, 0 )';
        } :
        function (x, y) {
            return 'translate(' + x + 'px, ' + y + 'px)';
        };


    /* ==================== Start Up ==================== */


    DDD.init = function () {

        var ranges = document.querySelectorAll('input[type="range"]'),
            rangesLen = ranges.length,
            i;

        if (rangesLen) {

            // create range output display
            for (i = 0; i < rangesLen; i++) {
                new DDD.RangeDisplay(ranges[i]);
            }

            // check browser support for range input
            // this has been hacked together from Modernizr range input test
            // -> Thanks Faruk Ates, Paul Irish, and Mike Taylor http://modernizr.com
            var isRangeSupported = (function () {
                var isSupported = ranges[0].type !== 'text';
                if (isSupported) {
                    var appearanceProp = Modernizr.prefixed('appearance');
                    isSupported = getComputedStyle(ranges[0])[appearanceProp] !== 'textfield';
                }
                return isSupported;
            })();

            // create range inputs for iOS
            if (!isRangeSupported) {
                for (i = 0; i < rangesLen; i++) {
                    new DDD.ProxyRange(ranges[i]);
                }
            }

        }


    };


    window.addEventListener('DOMContentLoaded', DDD.init, false);


// put in global namespace
    window.DDD = DDD;

})();