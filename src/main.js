import Vue from 'vue';
import App from './App.vue';
Vue.config.productionTip = false;

import router from './router';
import store from './store';

var resize_timeout;

new Vue({
  render: h => h(App),
  router,
  store,
  mounted(){
	var _this = this;
	window.onresize=function(){
		clearTimeout(resize_timeout);
		resize_timeout=setTimeout(_this.doResize,500);
	};
  },
  methods:{
	doResize:function(){
		console.log('resize!');
		this.$store.state.screenWidth = document.documentElement.clientWidth;
		this.$store.state.screenHeight = document.documentElement.clientHeight;
	}
  }

}).$mount('#app')

