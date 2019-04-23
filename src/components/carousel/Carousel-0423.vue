<template>
  <div
    ref="wrapper" 
    class="carousel-wrapper" 
    :style="{width:options.width,marginLeft:options.marginLeft}"
    @touchstart="_touchstart"
    @touchmove="_touchmove"
    @touchend="_touchend">
    <section 
      v-if="options.isShow" 
      class="container_mode" 
      :style="{height:options.height}">
      <div 
        ref="itemsWrapper" 
        id="itemsWrapper" 
        class="panels-backface-invisible"
        :style="{width:options.spaceBetween,height:options.spaceBetween}">
        <figure
          v-for="(item,index) in computedData"
          :key="index"

          @touchstart="changeMode"
          style="margin: 0 auto">
          <div
            class="content-wrapper"
            :class="{hidden:selectId!=item.id && !isEdit 
                       && options.controlMode == 1,
                     showThreeItems:index!=showThreeId[0]
                       &&index!=showThreeId[1]
                       &&index!=showThreeId[2]&&!isEdit
            &&options.threeOrAll==1}"          
          >
            <div 
              v-if="options.isShow && options.showNumOrImg" 
              :style="{height:options.height,fontSize:options.fontSize}">{{ item.content }}</div>
            <img 
              v-if="options.isShow && !options.showNumOrImg" 
              :src="item.content" 
              :style="{height:options.height}">
          </div>

        </figure>

      </div>
    </section>
  </div>
</template>

<script>
//  //  常量定义
//  const SLIPMODE = 1;
//  const CLICKMODE = 2;
// setId 方法节流 的延时设置
const SETID_DELAY = 200

//  横滚控件
//  eslint-disable-next-line
//  /* eslint-disable */
function Carousel(el) {
  this.element = el;
  this.rotation = 0;
  //  选定的序号
  this.panelCount = 0;
  //  总共有多少序号（子元素个数）
  this.totalPanelCount = this.element.children.length;
  this.theta = 0;
  this.panelWith = 0;
  //  true为水平，false为竖直
  this.isHorizontal = false;
}

Carousel.prototype.modify = function modify() {
  let panel;
  let angle;
  // let i;

  this.panelSize = this.element[
    this.isHorizontal ? 'offsetWidth' : 'offsetHeight'
  ];
  this.panelWith = this.panelSize;
  this.rotateFn = this.isHorizontal ? 'rotateY' : 'rotateX';
  //  this.rotateFn = 'rotateY';

  this.theta = 360 / this.totalPanelCount;

  //  do some trig to figure out how big the carousel
  //  is in 3D space
  // 这里计算半径（决定滚轮整体的大小，子项间距）
  this.radius = Math.round(
    this.panelSize / 2 / Math.tan(Math.PI / this.totalPanelCount),
  ) * this.radiusMutiply;

  for (let i = 0; i < this.totalPanelCount; i += 1) {
    panel = this.element.children[i];
    angle = this.theta * i;
    panel.style.opacity = 1;
    //  panel.style.backgroundColor = 'hsla(' + angle + ', 100%, 50%, 0.8)';
    //  rotate panel, then push it out in 3D space
    //  在此处配置radius可改变布局密度 , 在此可修改angle来改变排布顺序
    panel.style.transform = `${this.rotateFn}(${angle}deg) translateZ(${this
      .radius * 1.5}px)`;
    //     this.rotateFn + '(' + angle + 'deg) translateZ(' + this.radius + 'px)';
    panel.id = i;
  }

  //  hide other panels
  //  for (i=0 ; i < this.totalPanelCount; i++ ) {
  //      panel = this.element.children[i];
  //      panel.style.opacity = 0;
  //      panel.style[ transformProp ] = 'none';
  //  }

  //  adjust rotation so panels are always flat
  this.rotation = Math.round(this.rotation / this.theta) * this.theta;

  this.transform();
};

Carousel.prototype.transform = function transform() {
  this.element.style.transform = `translateZ(-${this.radius * 1.5}px) ${
    this.rotateFn
  }(${this.rotation}deg)`;
  //  this.element.style['transition'] = `transform .8s`
  //     'translateZ(-' +
  //     this.radius +
  //     'px) ' +
  //     this.rotateFn +
  //     '(' +
  //     this.rotation +
  //     'deg)';
};

// 自带节流函数：使用 Data() 实现
// fn为需要包装的函数，cycle为时间间隔，单位毫秒
function throttle(fn, cycle) {
  console.log(fn)
  let start = +Date.now()
  let now
  let timer
  return function() {
    now = +Date.now()
    clearTimeout(timer)
    if(now - start >= cycle) {
      fn.apply(this, arguments)
      start = now
    } else {
      timer = setTimeout(() => {
        fn.apply(this, arguments)
      }, cycle)
    }
  }
}

export default {
  name: 'Carousel',
  props: {
    propData: {
      type: Array,
      default() {
        return [111, 2, 3, 4, 5, 6, 7, 8, 999];
      },
    },
    options: {
      type: Object,
      default: function defaultInit() {
        return {
          isShow: true,
          controlAble: true,
          showNumOrImg: true,
          controlMode: 1,
          horizontal: true,
          threeOrAll: true,
          clickAble: false,
          width: '50%',
          marginLeft: '30%',
          height: '3.5rem',
          fontSize: '32px',
          spaceBetween: '1rem',
          radiusMutiply: 1,
        };
      },
    },
  },
  data() {
    return {
      // 用于给 setId 方法 设置节流的 包装后方法存储位置
      throttleSetId: undefined,
      //  以下为内部属性
      //  实例出的carousel对象
      carousel: '',
      //  是否处于拖拽状态
      isEdit: false,
      isEditTime: '',
      //  计算移动距离相关
      startPosition: 0,
      lastPosition: 0,
      lastMoveStart: 0,
      lastMoveTime: 0,
      //  与数据对应的id
      selectId: 0,
      //  与子项对应的id
      selectOrderId: 0,

      //  用于渲染子项的数据
      //  propData: [101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117],
      //  propData: ['static/images/index_mode_auto.png','static/images/index_mode_cool.png',
      //  'static/images/index_mode_dry.png','static/images/index_mode_fan.png'],

      //  外部状态/数据定义，通过父组件配置options传入
      //  options: {
      //    isShow: true,
      //    showNumOrImg: false,
      //    //  这里设想了2种控制模式：
      //    //  1.滑动选择控制，是之前使用的方案，只显示当前的选中元素，滑动时出现左右元素
      //    //  2.滑动+点选控制，以后可能会有这样的需求，显示当前及左右两侧的多个元素，可滑动调节也可点击直接跳至点击元素
      //    controlMode: 2,
      //    //  水平显示or竖直显示
      //    horizontal: false,

      //    //  还需配置的项：容器大小，元素大小（）
      //  },
    };
  },
  computed: {
    //  为解决传入值数量可能过少的问题，通过传入值的数据来重新渲染一份用于循环渲染的数据
    //  规则：2个3个时乘5,4个时乘3,5-9个时乘2,10个及以上不处理
    computedData() {
      console.log('感知到了变化-----');
      const tmpPropData = [];
      this.propData.forEach((item, index) => {
        const tmpItem = { id: index, content: item };
        tmpPropData.push(tmpItem);
      });
      //  for (let index in this.propData) {
      //    let tmpItem = { id: index, content: this.propData[index] };
      //    tmpPropData.push(tmpItem);
      //  }
      // console.log('所有子项的数据: ');
      // console.log(tmpPropData);

      const len = tmpPropData.length;
      const result = [];
      switch (len) {
        case 2:
        case 3:
          for (let i = 0; i < 5; i += 1) {
            result.push(...tmpPropData);
          }
          console.log(result);
          return result;
        case 4:
          for (let i = 0; i < 3; i += 1) {
            result.push(...tmpPropData);
          }
          console.log(result);
          return result;
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
          for (let i = 0; i < 2; i += 1) {
            result.push(...tmpPropData);
          }
          console.log(result);
          return result;
        default:
          result.push(...tmpPropData);
          console.log(result);
          return result;
      }
    },
    //  给所有子元素的动态绑定样式，用于隐藏显示
    //  itemStyle() {
    //    if (this.isEdit) {
    //    } else {
    //      return { visibility: 'hidden' };
    //    }
    //  },
    showThreeId() {
      const threeId = [];
      this.selectOrderId - 1 < 0
        ? threeId.push(this.computedData.length - 1)
        : threeId.push(this.selectOrderId - 1);
      threeId.push(this.selectOrderId);
      this.selectOrderId + 1 > this.computedData.length - 1
        ? threeId.push(0)
        : threeId.push(this.selectOrderId + 1);
      return threeId;
    },
  },
  watch: {
    computedData: function computedData() {
      this.$nextTick(() => {
        this.redraw();
      });
    },
  },
  created() {
    this.throttleSetId = throttle(this._setId, SETID_DELAY)
  },
  mounted() {
    this.init_Mode();
  },
  methods: {
    // 重绘函数，用于动态传入数据时使用，根据当前的 computedData 重新计算并绘制
    redraw() {
      const tempSelectId = this.selectId;

      // 先保留当前选中的id，若新传入的值比现在多，则仍使用当前值，若
      // console.log('redraw');
      // console.log(this);
      const itemsWrapper = this.$el.querySelector('#itemsWrapper');
      this.carousel.totalPanelCount = this.computedData.length;
      this.carousel.modify();
      const figures = itemsWrapper.getElementsByTagName('figure');
      for (let i = 0; i < figures.length; i += 1) {
        figures[i].style.width = `${this.carousel.panelWith}px`;
      }

      //  此处单独设置取消了此操作的动画，需要切换动画时屏蔽此段代码
      // const itemsWrapper = this.$el.querySelector('#itemsWrapper');
      // const figures = itemsWrapper.getElementsByTagName('figure');

      // 这一段代码用来给结束动作添加动画，但在调用重绘函数时，是不必要的
      itemsWrapper.style.transition = 'transform 0s';
      for (let i = 0; i < figures.length; i += 1) {
        figures[i].style.transition = 'transform 0s';
      }

      // this.$refs["contentWrapper"].style.transition = 'opacity .2s';
      const contentWrapper = this.$el.querySelectorAll('.content-wrapper');
      contentWrapper[this.selectId].style.transition = 'opacity 0s';

      console.log('--------------------');
      const exceed = (this.propData.length - 1 - tempSelectId < 0);
      // console.log(exceed)
      // 滚动到对应角度，
      this.selectId = (exceed) ? this.propData.length - 1 : tempSelectId;
      this.selectOrderId = this.selectId;
      this.carousel.rotation =
        -1 * this.carousel.theta * parseInt(this.selectId, 10);
      this.carousel.transform();
    },
    // 初始化函数
    init_Mode() {
      //  document.getElementById('itemsWrapper')
      //  this.$el.querySelector("#itemsWrapper")
      this.carousel = new Carousel(this.$el.querySelector('#itemsWrapper'));
      // 把对组件的配置项传入滚轮实例
      this.carousel.totalPanelCount = this.computedData.length;
      this.carousel.isHorizontal = this.options.horizontal;
      this.carousel.radiusMutiply = this.options.radiusMutiply || 1;
      this.carousel.modify();
      const itemsWrapper = this.$el.querySelector('#itemsWrapper');
      const figures = itemsWrapper.getElementsByTagName('figure');
      for (let i = 0; i < figures.length; i += 1) {
        figures[i].style.width = `${this.carousel.panelWith}px`;
      }
    },

    _touchstart(event) {
      if (!this.options.controlAble) return;
      //  状态监控：
      this.isEdit = true;
      this.isEditTime = event.timeStamp || Date.now();
      if (event.targetTouches.length === 1) {
        event.preventDefault(); //  阻止浏览器默认事件，重要
        const touch = event.targetTouches[0];
        //  this.lastMoveStart = this.startPosition =
        this.lastPosition = this.options.horizontal ? touch.pageX : touch.pageY;
        this.startPosition = this.lastPosition;
        this.lastMoveStart = this.startPosition;
        this.lastMoveTime = event.timeStamp || Date.now();
        this.initR_mode = this.carousel.rotation;
        const itemsWrapper = this.$el.querySelector('#itemsWrapper');
        const figures = itemsWrapper.getElementsByTagName('figure');
        itemsWrapper.style.transition = 'transform 0s';
        for (let i = 0; i < figures.length; i += 1) {
          figures[i].style.transition = 'transform 0s';
        }
      }
    },
    _touchmove(event) {
      if (!this.options.controlAble) return;
      this.isEditTime = event.timeStamp || Date.now();
      if (event.targetTouches.length === 1) {
        //         const touch = event.targetTouches[0];
        const nowX = this.options.horizontal
          ? event.touches[0].pageX
          : event.touches[0].pageY;
        //         const dir = nowX - this.lastPosition > 0 ? 1 : -1;
        this.lastPosition = nowX;
        //  根据move移动距离移动数字
        //  let  moveX = nowX - this.startPosition;
        const moveX = this.options.horizontal
          ? nowX - this.startPosition
          : this.startPosition - nowX;

        const valpresect =
          (moveX / this.carousel.panelWith) * this.carousel.theta;
        let ChangeRotate = valpresect;
        ChangeRotate = parseInt(ChangeRotate, 10);
        if (this.carousel.rotation !== ChangeRotate) {
          this.carousel.rotation = this.initR_mode + ChangeRotate;
          this.carousel.transform();
        }
        /**
         * 缓动代码
         */
        const nowTime = event.timeStamp || Date.now();
        if (nowTime - this.lastMoveTime > 300) {
          this.lastMoveTime = nowTime;
          this.lastMoveStart = nowX;
        }
      }
    },
    _touchend(event) {
      if (!this.options.controlAble) return;
      this.isEdit = false;
      this.isEditTime = event.timeStamp || Date.now();
      const itemsWrapper = this.$el.querySelector('#itemsWrapper');
      const figures = itemsWrapper.getElementsByTagName('figure');
      // 这一段代码用来给结束动作添加动画，但在调用重绘函数时，是不必要的
      itemsWrapper.style.transition = 'transform 0.2s';
      for (let i = 0; i < figures.length; i += 1) {
        figures[i].style.transition = 'transform 0.2s';
      }

      const moveX = this.lastPosition - this.lastMoveStart;
      //  const checkMove = this.lastPosition - this.startPosition;
      //  const checkDis = Math.abs(checkMove);

      /**
       * 缓动代码
       */
      const nowTime = event.timeStamp || Date.now();
      const v = moveX / (nowTime - this.lastMoveTime); //  最后一段时间手指划动速度
      const dir = v > 0 ? -1 : 1; //  加速度方向
      const deceleration = dir * 0.0006;
      const duration = v / deceleration; //  速度消减至0所需时间
      const dist = (v * duration) / 2; // 最终移动多少
      let val = parseInt(dist / (moveX * 2), 10);
      if (val > 15 || val < -15) {
        val = -1 * 15 * dir;
      }
      if (isNaN(val)) val = 0;
      // 根据方向补剩余移动量
      let tmp =
        (this.carousel.theta + (this.carousel.rotation % this.carousel.theta)) %
        this.carousel.theta;
      if (dir === 1) {
        // 手左滑
        // 不够20%不移动
        if ((tmp * 100) / this.carousel.theta < 80) {
          this.carousel.rotation = this.carousel.rotation - tmp;
          this.carousel.rotation +=
            Math.abs(val) * dir * -1 * this.carousel.theta;
        } else {
          // 复原
          this.carousel.rotation =
            this.carousel.rotation + (this.carousel.theta - Math.abs(tmp));
        }
      } else {
        // 手右滑
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

      //  状态监控：
      this.isEdit = false;
      const selectIdTmp =
        Math.round(this.carousel.rotation / this.carousel.theta) %
        this.carousel.totalPanelCount;
      this.selectOrderId =
        this.carousel.rotation <= 0
          ? -selectIdTmp
          : this.carousel.totalPanelCount - selectIdTmp;
      this.selectId = this.selectOrderId % this.propData.length;
      //  向父组件传出事件：
      this.$emit('currentChange', this.selectId);
    },
    changeMode(e) {
      if (!this.options.controlAble) return;
      if (this.options.controlMode === 2 && this.options.clickAble) {
        const changeTo = e.currentTarget.id;
        const index = changeTo;
        //  这里切换时是不过分界线的，如果添加动画效果要注意添加越过边界处理逻辑
        this.carousel.rotation = -index * this.carousel.theta;
        //  e.style['transitionDuration'] = `.5s`
        //  this.carousel.element.style = `transitionDuration: 2s`
        this.carousel.transform();
      }
    },
    // 设置组件显示位置 方法
    setId(id) {
      this.throttleSetId(id)
    },
    _setId(id) {
      // 性能优化：由于动画操作消耗性能，加入无需进行改变的判断条件 和 函数节流 机制
      if(this.selectId === id) return;
      console.log('确实执行了改变')
      //  此处单独设置取消了此操作的动画，需要切换动画时屏蔽此段代码
      const itemsWrapper = this.$el.querySelector('#itemsWrapper');
      // const figures = itemsWrapper.getElementsByTagName('figure');
      itemsWrapper.style.transition = 'transform 0s';

      // this.$refs["contentWrapper"].style.transition = 'opacity .2s';
      const contentWrapper = this.$el.querySelectorAll('.content-wrapper');
      contentWrapper[this.selectId].style.transition = 'opacity 0s';

      // 滚动到对应角度
      this.selectId = id;
      this.selectOrderId = this.selectId;
      this.carousel.rotation = -1 * this.carousel.theta * parseInt(id, 10);
      this.carousel.transform();

      contentWrapper[this.selectId].style.transition = 'opacity 0.5s';
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* 在此处设置渐显动画 */
.content-wrapper {
  opacity: 1;
  transition: opacity 0.5s;
  /* background: red; */
}
/* 在此处设置渐隐动画 */
.hidden {
  opacity: 0;
  transition: opacity 0.5s;
}
.showThreeItems {
  opacity: 0;
  transition: opacity 0.5s;
}

.carousel-wrapper {
  /* position: absolute; */
  display: block;
  text-align: center;
  /* 在此可配置水平定位 */
  width: 30%;
  /* margin-left: 10px; */
  display: flex;
  justify-content: center;
}
.carousel-wrapper:after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
}

.container_mode {
  /* 在此可配置子项密度 */
  width: 30%;
  height: 3.5rem;
  /* padding: 50%; */
  position: relative;
  /* margin: 0rem auto; */
  display: flex;
  justify-content: center;
  -webkit-perspective: 1100px;
  -moz-perspective: 1100px;
  -o-perspective: 1100px;
  perspective: 1100px;
}

#itemsWrapper {
  position: relative;
  text-align: center;
  margin: 0 auto;
  /* 目前有兼容格力二代的需求，把这个屏蔽了 */
  /* display: flex;
  justify-content: center; */
  -webkit-transform-style: preserve-3d;
  -moz-transform-style: preserve-3d;
  -o-transform-style: preserve-3d;
  transform-style: preserve-3d;
}

.ready #itemsWrapper {
  -webkit-transition: -webkit-transform 1s;
  -moz-transition: -moz-transform 1s;
  -o-transition: -o-transform 1s;
  transition: transform 1s;
}

#itemsWrapper.panels-backface-invisible figure {
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -o-backface-visibility: hidden;
  backface-visibility: hidden;
}

#itemsWrapper figure {
  display: block;
  position: absolute;
  height: auto;
  top: 10px;
  text-align: center;
}

.ready #itemsWrapper figure {
  -webkit-transition: opacity 1s, -webkit-transform 1s;
  -moz-transition: opacity 1s, -moz-transform 1s;
  -o-transition: opacity 1s, -o-transform 1s;
  transition: opacity 1s, transform 1s;
}

@keyframes modeAnimate {
  0% {
    opacity: 0;
    transform: translateY(-3rem);
  }
  25% {
    transform: translateY(-4rem);
    opacity: 0.3;
  }
  100% {
    transform: translateY(-5rem);
    opacity: 1;
  }
}
@-moz-keyframes modeAnimate {
  0% {
    opacity: 0;
    -moz-transform: translateY(-3rem);
  }
  25% {
    -moz-transform: translateY(-4rem);
    opacity: 0.3;
  }
  100% {
    -moz-transform: translateY(-5rem);
    opacity: 1;
  }
}
@-webkit-keyframes modeAnimate {
  0% {
    opacity: 0;
    -webkit-transform: translateY(-3rem);
  }
  25% {
    -webkit-transform: translateY(-4rem);
    opacity: 0.3;
  }
  100% {
    -webkit-transform: translateY(-5rem);
    opacity: 1;
  }
}

#model-guide {
  display: none;
  position: absolute;
  top: 1.3rem;
  left: 2rem;
  right: 2rem;
  letter-spacing: 1px;
  animation: modeAnimate 0.5s linear;
  -moz-animation: modeAnimate 0.5s linear;
  -webkit-animation: modeAnimate 0.5s linear;
  animation-fill-mode: forwards;
  -moz-animation-fill-mode: forwards;
  -webkit-animation-fill-mode: forwards;
}
#model-guide > img {
  position: absolute;
  left: 7.5rem;
  bottom: -2.5rem;
  height: 2.2rem;
  transform: rotateZ(-5deg);
  -webkit-transform: rotateZ(-5deg);
  z-index: 99;
}
#model-guide .guidetTxt {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background: #e5e5e5;
  color: #404657;
  font-size: 1rem;
  border-radius: 0.3rem;
  box-shadow: 0px 0px 5px #666;
  -moz-box-shadow: 0px 0px 5px #666;
  -webkit-box-shadow: 0px 0px 5px #666;
  z-index: 99;
}
</style>
