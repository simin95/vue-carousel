# vue-carousel

> 一个滑轮组件，通过一个数组配置出子项，考虑两种使用场景：显示数字或图片，数组内元素未数字或图片url，
  设计了两种控制模式，以及水平垂直的显示；在滑动完成后会向父组件派发事件附带当前选中项的index值，父组件监听使用

## 怎么用？

...

* 配置项：
``` javascript
      // 所有的状态/数据定义，考虑两种使用场景：显示数字或图片
      propData: [101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117],
      // propData: ['static/images/index_mode_auto.png','static/images/index_mode_cool.png','static/images/index_mode_dry.png','static/images/index_mode_fan.png'],
      showNum: true,
      showImg: false,
      // 这里设想了2种控制模式：
      // 1.滑动选择控制，是之前使用的方案，只显示当前的选中元素，滑动时出现左右元素
      // 2.滑动+点选控制，以后可能会有这样的需求，显示当前及左右两侧的多个元素，可滑动调节也可点击直接跳至点击元素
      controlMode: 2,
      // 水平显示or竖直显示
      horizontal: true,
      // 还需配置的项：容器大小，元素大小（）
```


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```


> 已知bug：
1. 组件在进行挂载渲染时竟然有动画，但没有任何代码写了动画