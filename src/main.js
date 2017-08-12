import Vue from 'vue';
import App from './App.vue';
import Bus from './Bus.vue';

window.app = {};
app.bus = Bus;

new Vue({
  el: '#app',
  render: h => h(App)
});
