import Vue from 'vue';
import App from './app.vue';
import Carousel from '../components/carousel/Carousel.vue';

Vue.use(Carousel);

new Vue({
  el: '#app',
  render: h => h(App),
});
