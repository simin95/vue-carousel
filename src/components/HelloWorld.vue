<template>
  <div class="hello">
    <carousel
      class="carousel-wrapper"
      @currentChange="handleChange"
      :propData="carouselData"
      ></carousel>
    <div class="test"></div>
  </div>
</template>

<script>
import Carousel from './carousel/Carousel';
export default {
  name: 'HelloWorld',
  components: {
    Carousel
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      // carouselData: [1,2,3,4,5,6,7]
    }
  },
  methods: {
    handleChange: function(args) {
      console.log("当前选择到的id：" + args)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.carousel-wrapper{
  /* width: 100px;
  overflow: hidden; */
}
html {
  background-color: #ccc;
}
h1, h2 {
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
