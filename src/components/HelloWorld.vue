<template>
  <div class="hello">
    <button @click="getCarouselId('carousel1')">get方法</button>
    <button @click="setCarouselId('carousel1',0)">set方法：id===0</button>
    
    <div class="content1">
    <carousel
      ref="carousel1"
      class="carousel-wrapper"
      @currentChange="handleChange"
      :propData="carouselData"
      :options="carouselOptions"
      ></carousel>
    </div>

    <div class="content2">
    <carousel
      ref="carousel2"
      class="carousel-wrapper"
      @currentChange="handleChange"
      :propData="carouselDataTwo"
      :options="carouselOptionsTwo"
    ></carousel>
    </div>

    <div class="content3">
    <carousel
      ref="carousel3"
      class="carousel-wrapper"
      @currentChange="handleChange"
      :propData="carouselDataThree"
      :options="carouselOptionsThree"
    ></carousel>
    </div>

    <div class="test"></div>
  </div>
</template>

<script>
import Carousel from './carousel/Carousel';
export default {
  name: 'HelloWorld',
  components: {
    Carousel,
  },
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      // 将data和options分开传入的原因是：在组件使用过程中，样式一般不变，数据可能会变
      carouselData: [1, 2, 3, 4, 5, 6, 7],
      // carouselData: [
      //   'static/images/index_mode_auto.png',
      //   'static/images/index_mode_cool.png',
      //   'static/images/index_mode_dry.png',
      //   'static/images/index_mode_fan.png',
      // ],
      carouselOptions: {
        // 是否显示
        isShow: true,
        // 显示数字还是图片
        showNumOrImg: true,
        // 这里设想了2种控制模式：
        // 1.滑动选择控制，是之前使用的方案，只显示当前的选中元素，滑动时出现左右元素
        // 2.滑动+点选控制，以后可能会有这样的需求，显示当前及左右两侧的多个元素，可滑动调节也可点击直接跳至点击元素
        controlMode: 2,
        // 水平显示or竖直显示
        horizontal: true,
        // 显示3个or全部显示（有时会有只显示当前及左右两边的值(共三个)的需求，在组件内部实现了隐藏效果）
        threeOrAll: true,
        // 打开/关闭点选，某些场景需要这样设置，点选和滑动有冲突，比较鸡肋的点选功能
        clickAble: false,

        // 定位布局配置项：容器的水平位置绝对定位于窗口
        // 组件宽度及水平定位
        width: '50%',
        marginLeft: '30%',
        // 子项间距,值越小越密集
        spaceBetween: '3rem',
        // 子项容器高度 （似乎这两个值之间存在某种联系，需要一起按比例改变）
        height: '3.5rem',
        // 字体大小
        fontSize: '32px'
        
        // 文字颜色及背景颜色在css中设置即可
      },
      carouselDataTwo: [
        'static/images/index_mode_auto.png',
        'static/images/index_mode_cool.png',
        'static/images/index_mode_dry.png',
        'static/images/index_mode_fan.png',
      ],
      carouselOptionsTwo: {
        isShow: true,
        showNumOrImg: false,
        controlMode: 2,
        horizontal: true,
        threeOrAll: false,
        clickAble: false,
        width: '50%',
        marginLeft: '30%',
        // 子项间距,值越小越密集
        spaceBetween: '5rem',
        height: '3.5rem',
        fontSize: '32px'
      },
      carouselDataThree: [
        'static/images/index_mode_auto.png',
        'static/images/index_mode_cool.png',
        'static/images/index_mode_dry.png',
        'static/images/index_mode_fan.png',
      ],
      carouselOptionsThree: {
        isShow: true,
        showNumOrImg: false,
        controlMode: 2,
        horizontal: false,
        threeOrAll: true,
        width: '50%',
        marginLeft: '30%',
        height: '3.5rem',
        // 子项间距,值越小越密集
        spaceBetween: '3rem',
        fontSize: '32px'
      },
    };
  },
  methods: {
    // 手动操作滑动组件改变选择到的id值后会触发此事件
    handleChange: function(args) {
      console.log('当前选择到的id：' + args);
    },
    // get方法，name为区分多个carousel的标志；另一种实现方式：使用vuex来获取carousel组件的selectId属性
    getCarouselId: function(name) {
      let current = this.$refs[name].selectId;
      console.log('当前' + name + '组件被选择的子项id是：' + current);
      return current;
    },
    // set方法，name为区分多个carousel的标志，id为变化到的子项id；实现思路：在父组件中调用子组件自己的setId()方法
    setCarouselId: function(name, id) {
      this.$refs[name].setId(id);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.carousel-wrapper {
  color: #fff;
  background-color: #42b983;
  /* transform: rotate(90deg) */
  
  /* 水平方向可设置容器的属性使得只显示3个 */
  /* overflow: hidden; */
}
.content1{
  margin-top: 1rem
}
.content2{
  margin-top: 8rem
}
.content3{
  margin-top: 20rem;
  background-color: rgb(204, 204, 204);
}
html {
  background-color: #ccc;
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
