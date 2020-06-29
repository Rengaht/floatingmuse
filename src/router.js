import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/components/page/home';
import Map from '@/components/page/map';
import Poem from '@/components/page/poem';
// import OceanCanvas from './components/OceanCanvas.vue';
Vue.use(VueRouter);

const router=new VueRouter({
  routes:[
    {
		name:'home',
		path:'/',
		component:Home
    },
    {
		name:'map',
		path:'/map',
		component:Map
    },
    {
		name:'poem',
		path:'/poem',
		component:Poem,
		props:true
    }
  ]
});
export default router;