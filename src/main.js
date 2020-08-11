import Vue from 'vue';

import VueMeta from 'vue-meta';
Vue.use(VueMeta);

import VueAnalytics from 'vue-analytics'
Vue.use(VueAnalytics, {
  id: 'UA-80306203-11'
})

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
		resize_timeout=setTimeout(_this.doResize,10);
	};
	this.doResize();
  },
  created(){
	// this.doResize();
  },
  methods:{
	doResize:function(){
		console.log('resize!');
		
		// this.$store.state.screenWidth = document.documentElement.clientWidth;
		// this.$store.state.screenHeight = document.documentElement.clientHeight;
		// this.$store.state.pageWidth=this.$refs._map.clientWidth;
		// this.$store.state.pageHeight=this.$refs._map.clientHeight;

		this.$store.dispatch('computePageSize');


	}
  },
  // metaInfo:{
  //   title:'Floating Muse 漂浮繆斯',
  //   meta:[
  //     {name:'description',content:'從台灣沿海氣象預報 為你寫一首詩'},
  //     {property:'og:type',content:'website'},
  //     {property:'og:url',content:'https://mmlab.tw/project/floatingmuse'},
  //     {property:'og:title',content:'Floating Muse 漂浮繆斯'},
  //     {property:'og:description',content:'從台灣沿海氣象預報 為你寫一首詩'},
  //     {property:'og:image',content:'https://mmlab.tw/project/floatingmuse/img/meta.png'},

  //     {property:'twitter:title',content:'Floating Muse 漂浮繆斯'},
  //     {property:'twitter:description',content:'從台灣沿海氣象預報 為你寫一首詩'},
  //     {property:'twitter:url',content:'https://mmlab.tw/project/floatingmuse'},
  //     {property:'twitter:image',content:'https://mmlab.tw/project/floatingmuse/img/meta.png'},
  //   ],
  // },

}).$mount('#app')

