<template>
    <div id="selectModel"
         style="position:relative;display:block;text-align:center;position:absolute;width:100%">
      <section class="container_mode" @touchstart="touchstart_mode"  @touchmove='touchmove_mode' @touchend="touchend_mode">
        <div ref="carousel_mode" id="carousel_mode" class="panels-backface-invisible">
          
          <figure
            v-for="(item,index) in computedData"
            :key="index"
            :class="{hidden:selectId!=item.id && !isEdit && controlMode == 1}"
            @touchstart="changeMode"
            style="margin: 0 auto">
            <div v-if="showNum" style="font-size: 32px; color: #fff">{{item.content}}</div>
            <img v-if="showImg" :src="item.content" style="height: 2.5rem">
          </figure>

        </div>
      </section>
    </div>
</template>

<script>
// 常量定义
const SLIPMODE = 1;
const CLICKMODE = 2;

//横滚控件
// eslint-disable-next-line
/* eslint-disable */
function Carousel(el) {
  this.element = el;
  this.rotation = 0;
  // 选定的序号
  this.panelCount = 0;
  // 总共有多少序号（子元素个数）
  this.totalPanelCount = this.element.children.length;
  this.theta = 0;
  this.panelWith = 0;
  // true为水平，false为竖直
  this.isHorizontal = false;
}

Carousel.prototype.modify = function() {
  let panel, angle, i;

  this.panelWith = this.panelSize = this.element[
    this.isHorizontal ? 'offsetWidth' : 'offsetHeight'
  ];

  this.rotateFn = this.isHorizontal ? 'rotateY' : 'rotateX';

  this.theta = 360 / this.totalPanelCount;

  // do some trig to figure out how big the carousel
  // is in 3D space
  this.radius = Math.round(this.panelSize / 2 / Math.tan(Math.PI / this.totalPanelCount));

  for (let i = 0; i < this.totalPanelCount; i++) {
    panel = this.element.children[i];
    angle = this.theta * i;
    panel.style.opacity = 1;
    // panel.style.backgroundColor = 'hsla(' + angle + ', 100%, 50%, 0.8)';
    // rotate panel, then push it out in 3D space
    // 在此处配置radius可改变布局密度 , 在此可修改angle来改变排布顺序
    panel.style['transform'] = `${this.rotateFn}(${angle}deg) translateZ(${this.radius*1.5}px)`;
//    this.rotateFn + '(' + angle + 'deg) translateZ(' + this.radius + 'px)';
    panel.id = i;
  }

  // hide other panels
  // for (i=0 ; i < this.totalPanelCount; i++ ) {
  //     panel = this.element.children[i];
  //     panel.style.opacity = 0;
  //     panel.style[ transformProp ] = 'none';
  // }

  // adjust rotation so panels are always flat
  this.rotation = Math.round(this.rotation / this.theta) * this.theta;

  this.transform();
};

Carousel.prototype.transform = function() {
  this.element.style['transform'] = `translateZ(-${this.radius*1.5}px) ${this.rotateFn}(${this.rotation}deg)`;
  // this.element.style['transition'] = `transform .8s`
//    'translateZ(-' +
//    this.radius +
//    'px) ' +
//    this.rotateFn +
//    '(' +
//    this.rotation +
//    'deg)';
};
export default {
  name: 'Carousel',
  props: {
    propData:{
      type: Array,
      default(){
        return [101,102,103,104,105,106,107,108,109,110]
      }
    },
  },
  data() {
    return {
      carousel: '',
      Selectmode: 1, //当前选择值
      identifier: -1, //手指唯一id
      isEditTime: '',
      isEdit: false,
      lastX_mode: 0, // 上一次位置
      lastMoveStart_mode: 0,
      lastMoveTime_mode: 0,
      StartX_mode: 0, // 初始位置
      fadeOutTime: 1000, //滑动后其它选择消失时间
      lastcarouselrotation_mode: 0, //最后温度滚动角度
      CurrentMode: 0,
      modeCarousel: '',
      
      // 所有的状态/数据定义
      //propData: [101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117],
      // propData: ['static/images/index_mode_auto.png','static/images/index_mode_cool.png','static/images/index_mode_dry.png','static/images/index_mode_fan.png'],
      showNum: true,
      showImg: false,
      // 组件状态控制：
      // isEdit: false,
      selectOrderId: 0,
      selectId: 0,
      // 这里设想了2种控制模式：
      // 1.滑动选择控制，是之前使用的方案，只显示当前的选中元素，滑动时出现左右元素
      // 2.滑动+点选控制，以后可能会有这样的需求，显示当前及左右两侧的多个元素，可滑动调节也可点击直接跳至点击元素
      controlMode: 1,
      // 水平显示or竖直显示
      horizontal: true,
      // 还需配置的项：容器大小，元素大小（）
    };
  },
  computed: {
    // 为解决传入值数量可能过少的问题，通过传入值的数据来重新渲染一份用于循环渲染的数据
    // 规则：2个3个时乘5,4个时乘3,5-9个时乘2,10个及以上不处理
    computedData() {
      let tmpPropData = [];
      for(let index in this.propData) {
        let tmpItem = {id:index,content:this.propData[index]}
        tmpPropData.push(tmpItem)
      }
      console.log("所有子项的数据: ")
      console.log(tmpPropData)
      // console.log(this.carousel.isHorizontal)

      const len = tmpPropData.length;
      let result = [];
      switch (len) {
        case 2:
        case 3:
          for(let i=0;i<5;i++){
            result.push(...tmpPropData)
          }
          return result;
          break;
        case 4:
          for(let i=0;i<3;i++){
            result.push(...tmpPropData)
          }
          return result;
          break;
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
          for(let i=0;i<2;i++){
            result.push(...tmpPropData)
          }
          return result;
          break;
        default:
          result.push(...tmpPropData)
          return result;
          break;
      }
    },
    // 给所有子元素的动态绑定样式，用于隐藏显示
    itemStyle() {
      if(this.isEdit) {
        
      } else {
        return {visibility: 'hidden'}
      }
    }
  },
  watch: {
    CurrentMode() {
      //普通的watch监听,CurrentMode变化时触发
    },
  },
  mounted() {
    this.init_Mode();
    // this.setMode(this.CurrentMode);
  },
  methods: {
    init_Mode() {
      this.carousel = new Carousel(document.getElementById('carousel_mode'));
      this.modeCarousel = this.carousel;
      this.carousel.totalPanelCount = this.computedData.length;
      this.carousel.isHorizontal = this.horizontal;
      this.carousel.modify();
      const carousel_mode = document.getElementById('carousel_mode');
      const figures = carousel_mode.getElementsByTagName('figure');
      for (let i = 0; i < figures.length; i += 1) {
        figures[i].style.width = `${this.carousel.panelWith}px`;
      }
    },

    touchstart_mode(event) {
      // 状态监控：
      this.isEdit = true;

      this.identifier = event.changedTouches[0].identifier;
      this.isEdit = true;
      this.isEditTime = event.timeStamp || Date.now();
      if (event.targetTouches.length === 1) {
        event.preventDefault(); // 阻止浏览器默认事件，重要
        const touch = event.targetTouches[0];
        this.lastMoveStart_mode = this.StartX_mode = this.lastX_mode = (this.horizontal)?touch.pageX:touch.pageY;
        this.lastMoveTime_mode = event.timeStamp || Date.now();
        this.initR_mode = this.carousel.rotation;
        const carousel_mode = document.getElementById('carousel_mode');
        const figures = carousel_mode.getElementsByTagName('figure');
        carousel_mode.style.transition = 'transform 0s';
        for (let i = 0; i < figures.length; i += 1) {
          figures[i].style.transition = 'transform 0s';
        }
        //        for (var i = 1; i <= 10; i++) {
        //          var panel = $("#mode_" + i);
        //          panel.stop();
        //          panel.css("opacity", "1");
        //          panel.show();
        //        }
      }
    },
    touchmove_mode(event) {
      this.isEditTime = event.timeStamp || Date.now();
      if (event.targetTouches.length === 1) {
//        const touch = event.targetTouches[0];
        const nowX = (this.horizontal)?event.touches[0].pageX:event.touches[0].pageY;
//        const dir = nowX - this.lastX_mode > 0 ? 1 : -1;
        this.lastX_mode = nowX;
        //根据move移动距离移动数字
        // let  moveX = nowX - this.StartX_mode;
        let moveX = (this.horizontal)?(nowX - this.StartX_mode):(this.StartX_mode - nowX);
        
        let valpresect = (moveX / this.carousel.panelWith) * this.carousel.theta;
        let ChangeRotate = valpresect;
        ChangeRotate = parseInt(ChangeRotate);
        if (this.carousel.rotation !== ChangeRotate) {
          this.carousel.rotation = this.initR_mode + ChangeRotate;
          this.carousel.transform();
        }
        /**
         * 缓动代码
         */
        const nowTime = event.timeStamp || Date.now();
        if (nowTime - this.lastMoveTime_mode > 300) {
          this.lastMoveTime_mode = nowTime;
          this.lastMoveStart_mode = nowX;
        }
      }
    },
    touchend_mode(event) {
      this.identifier = -1;
      this.isEdit = false;
      this.isEditTime = event.timeStamp || Date.now();
      const carousel_mode = document.getElementById('carousel_mode');
      const figures = carousel_mode.getElementsByTagName('figure');
      carousel_mode.style.transition = 'transform 0.2s';
      for (let i = 0; i < figures.length; i += 1) {
        figures[i].style.transition = 'transform 0.2s';
      }
      const moveX = this.lastX_mode - this.lastMoveStart_mode;
      const checkMove = this.lastX_mode - this.StartX_mode;
      const checkDis = Math.abs(checkMove);
      // if (checkDis === 0) {
      //   for (let i = 1; i <= 10; i += 1) {
      //     if (i !== this.Selectmode) {
      //       //              var panel = $("#mode_" + i);
      //       //                            panel.fadeOut(fadeOutTime);
      //     }
      //   }
      //   return;
      // }
      /**
       * 缓动代码
       */
      const nowTime = event.timeStamp || Date.now();
      const v = moveX / (nowTime - this.lastMoveTime_mode); //最后一段时间手指划动速度
      const dir = v > 0 ? -1 : 1; //加速度方向
      const deceleration = dir * 0.0006;
      const duration = v / deceleration; // 速度消减至0所需时间
      const dist = (v * duration) / 2; //最终移动多少
      let val = parseInt(dist / (moveX * 2));
      if (val > 15 || val < -15) {
        val = -1 * 15 * dir;
      }
      if (isNaN(val)) val = 0;
      //根据方向补剩余移动量
      let tmp =
        (this.carousel.theta + (this.carousel.rotation % this.carousel.theta)) %
        this.carousel.theta;
      if (dir === 1) {
        //手左滑
        //不够20%不移动
        if ((tmp * 100) / this.carousel.theta < 80) {
          this.carousel.rotation = this.carousel.rotation - tmp;
          this.carousel.rotation +=
            Math.abs(val) * dir * -1 * this.carousel.theta;
        } else {
          //复原
          this.carousel.rotation =
            this.carousel.rotation + (this.carousel.theta - Math.abs(tmp));
        }
      } else {
        //手右滑
        tmp = this.carousel.theta - Math.abs(tmp);
        if ((tmp * 100) / this.carousel.theta < 80) {
          this.carousel.rotation = this.carousel.rotation + tmp;
          this.carousel.rotation +=
            Math.abs(val) * dir * -1 * this.carousel.theta;
        } else {
          this.carousel.rotation =
            this.carousel.rotation - (this.carousel.theta - Math.abs(tmp));
        }
      }
      this.carousel.transform();
      this.lastcarouselrotation_mode = this.carousel.rotation;
      // 状态监控：
      this.isEdit = false;
      let selectIdTmp = Math.round(this.carousel.rotation/this.carousel.theta)%this.carousel.totalPanelCount;
      this.selectOrderId = (this.carousel.rotation<=0)?-selectIdTmp:this.carousel.totalPanelCount - selectIdTmp;
      this.selectId = this.selectOrderId % this.propData.length;
      // 向父组件传出事件：
      this.$emit('currentChange',this.selectId);

      // 这TM又是什么？
      // const roleval = this.carousel.rotation / this.carousel.theta;
      // //console.log(carousel.rotation);
      // if (roleval > 0) {
      //   this.Selectmode = (1 + 10) - (roleval % 10);
      // } else if (roleval < 0) {
      //   this.Selectmode = 1 + ((roleval % 10) * -1);
      // } else {
      //   this.Selectmode = 1;
      // }
      // if (this.Selectmode > 0) {
      //   this.Selectmode += 0.1;
      // } else if (this.Selectmode < 0) {
      //   this.Selectmode -= 0.1;
      // }
      // const Selectmode = parseInt(this.Selectmode);
      // if (Selectmode <= 0) {
      //   this.Selectmode = 10;
      // }
      // if (Selectmode >= 11) {
      //   this.Selectmode = 1;
      // }
      // //console.log(Selectmode);
      // // 这里被写死了
      // if (Selectmode === 1 || Selectmode === 6) {
      //   this.CurrentMode = this.ACMode.auto;
      // } else if (Selectmode === 2 || Selectmode === 7) {
      //   this.CurrentMode = this.ACMode.cool;
      // } else if (Selectmode === 3 || Selectmode === 8) {
      //   this.CurrentMode = this.ACMode.dry;
      // } else if (Selectmode === 4 || Selectmode === 9) {
      //   this.CurrentMode = this.ACMode.fan;
      // } else if (Selectmode === 5 || Selectmode === 10) {
      //   this.CurrentMode = this.ACMode.heat;
      // }

      // console.log(`this.CurrentMode:${this.CurrentMode}`);

      // for (let i = 1; i <= 10; i += 1) {
      //   if (i !== this.Selectmode) {
      //     //            var panel = $("#mode_" + i);
      //     //                        panel.fadeOut(fadeOutTime);
      //   } else {
      //     //            var panel = $("#mode_" + i);
      //     //                        panel.stop();
      //     //                        panel.fadeIn(200);
      //   }
      // }
      //                if (isIlegalAndTip(CurrentMode)) {
      //                    try {
      //                        ChangeMode(CurrentMode);
      //                    } catch (e) {
      //                    }
      //                    if (g_CurrentMode != CurrentMode) {
      //                        g_CurrentMode = CurrentMode;//改变全局 、风速要使用到这个值
      //                        // DataObject.Mod = CurrentMode;
      //                        DataObject.SwhSlp = 0;
      //                        DataObject.SlpMod = 0;
      //                        //处理发送修改的数据给设备
      //                        // var jsonData = "{\"opt\":[\"Mod\",\"SwhSlp\",\"SlpMod\"],\"p\":[" + CurrentMode + "," + DataObject.SwhSlp + "," + DataObject.SwhSlp + "],\"t\":\"cmd\"}";
      //                        var data = mutexManager.getModeCmd(CurrentMode);
      //                        var obj = JSON.parse(data);
      //                        var jsonData = JSON.stringify(obj.cmd);
      ////                        updateFromCmd(obj.cmd,1);
      //                        // btnManager.setAdvanceValue(DataObject.Air, DataObject.Blo, DataObject.Health, DataObject.Lig,
      //                        //     DataObject.SvSt, DataObject.SwUpDn, DataObject.SwingLfRig, DataObject.StHt, DataObject.SwhSlp, DataObject.Pow);
      //
      //                        var imgSleep = $("#imgSleep");
      //                        imgSleep[0].src = "../../Public/images/ac/advance_n_sleep.png";
      //                        $("#modeSleep").hide();
      //                        //集中控制不回调，直接修改全局DataObject
      //                        if (g_functype == FuncType.Mode_Control) {
      //                            flag=false;
      //                            callback(jsonData, true);
      //
      //                        }
      //
      //                    }
      //                } else {
      //                    setTimeout(function(){
      ////                        CurrentMode = g_CurrentMode;
      ////                        ChangeMode(CurrentMode);
      ////
      ////                        modeManager.setMode(CurrentMode);
      //                    },300);
      //                }
    },
    changeMode(e) {
      if(this.controlMode === 2){
        const changeTo = e.currentTarget.id;
        let index = changeTo;
        // 这里切换时是不过分界线的，如果添加动画效果要注意添加越过边界处理逻辑
        this.carousel.rotation = -(index) * this.carousel.theta;
        // e.style['transitionDuration'] = `.5s`
        // this.carousel.element.style = `transitionDuration: 2s`
        this.carousel.transform();
      }
    },
    setMode(mode) {
      const carousel_mode = document.getElementById('carousel_mode');
      const figures = carousel_mode.getElementsByTagName('figure');
      carousel_mode.style.transition = 'transform 0s';
      for (let i = 0; i < figures.length; i += 1) {
        figures[i].style.transition = 'transform 0s';
      }
      //滚动到对应角度
      this.Selectmode = mode + 1;
      this.modeCarousel.rotation =
        -1 * this.modeCarousel.theta * parseInt(mode);
      this.modeCarousel.transform();

      //      for (var i = 1; i <= 10; i++) {
      //        var panel = $("#mode_" + i);
      //        if (i != Selectmode) {
      ////                    panel.hide();
      //        }
      //        else {
      //          //panel.show();
      //          panel.stop();
      //          panel.css("opacity", "1");
      //          panel.show();
      //        }
      //      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hidden{
    visibility: hidden;
    -webkit-transition: -webkit-transform 2s;
    -moz-transition: -moz-transform 2s;
    -o-transition: -o-transform 2s;
    transition: transform 2s;
    /* transform: .2s */
  }

  .container_mode {
    /* 在此可配置子项密度 */
    width: 30%;
    height: 3rem;
    position: relative;
    margin: 0rem auto;
    -webkit-perspective: 1100px;
    -moz-perspective: 1100px;
    -o-perspective: 1100px;
    perspective: 1100px;
  }


  #carousel_mode {
    width: 100%;
    height: 100%;
    position: absolute;
    -webkit-transform-style: preserve-3d;
    -moz-transform-style: preserve-3d;
    -o-transform-style: preserve-3d;
    transform-style: preserve-3d;
  }

  .ready #carousel_mode {
    -webkit-transition: -webkit-transform 1s;
    -moz-transition: -moz-transform 1s;
    -o-transition: -o-transform 1s;
    transition: transform 1s;
  }

  #carousel_mode.panels-backface-invisible figure {
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
    -o-backface-visibility: hidden;
    backface-visibility: hidden;
  }

  #carousel_mode figure {
    display: block;
    position: absolute;
    height: auto;
    top: 10px;
    color: #404657;
    text-align: center;
  }

  .ready #carousel_mode figure {
    -webkit-transition: opacity 1s, -webkit-transform 1s;
    -moz-transition: opacity 1s, -moz-transform 1s;
    -o-transition: opacity 1s, -o-transform 1s;
    transition: opacity 1s, transform 1s;
  }

  @keyframes modeAnimate {
    0%{
      opacity: 0;
      transform: translateY(-3rem);
    }
    25% {
      transform: translateY(-4rem);
      opacity: .3;
    }
    100% {
      transform: translateY(-5rem);
      opacity: 1;
    }

  }
  @-moz-keyframes modeAnimate {
    0%{
      opacity: 0;
      -moz-transform: translateY(-3rem);
    }
    25% {
      -moz-transform: translateY(-4rem);
      opacity: .3;
    }
    100% {
      -moz-transform: translateY(-5rem);
      opacity: 1;
    }

  }
  @-webkit-keyframes modeAnimate {
    0%{
      opacity: 0;
      -webkit-transform: translateY(-3rem);
    }
    25% {
      -webkit-transform: translateY(-4rem);
      opacity: .3;
    }
    100% {
      -webkit-transform: translateY(-5rem);
      opacity: 1;
    }

  }

  #model-guide{
    display:none;
    position: absolute;
    top: 1.3rem;
    left: 2rem;
    right:2rem;
    letter-spacing: 1px;
    animation: modeAnimate .5s linear;
    -moz-animation: modeAnimate .5s linear;
    -webkit-animation: modeAnimate .5s linear;
    animation-fill-mode : forwards ;
    -moz-animation-fill-mode : forwards ;
    -webkit-animation-fill-mode : forwards ;
  }
  #model-guide>img{
    position: absolute;
    left: 7.5rem;
    bottom: -2.5rem;
    height: 2.2rem;
    transform: rotateZ(-5deg);
    -webkit-transform: rotateZ(-5deg);
    z-index: 99;

  }
  #model-guide .guidetTxt{
    display: inline-block;
    padding: .8rem  1.5rem;
    background: #e5e5e5;
    color: #404657;
    font-size: 1rem;
    border-radius: .3rem;
    box-shadow: 0px 0px 5px #666;
    -moz-box-shadow: 0px 0px 5px #666;
    -webkit-box-shadow: 0px 0px 5px #666;
    z-index: 99;
  }
</style>
