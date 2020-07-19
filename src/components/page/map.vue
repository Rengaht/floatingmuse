<template>
<div id="_map" class="CenterWrapper" ref="_map">
      <!-- <div class="HintRegion" id="_map_hint">
		<div>你今天的心情<br>
			想看看哪一片海？</div>
      </div> -->
		<WaveCanvas id="hint2" img_src="img/hint-2.png" :ratio="0.3" class="HintRegion"></WaveCanvas> 
		<!-- <transition-group
			name="ocean-item-list"
			tag="div"
			id="_map_wrapper"
			v-bind:css="false"
			v-on:before-enter="beforeEnter"
			v-on:enter="enter"
			v-on:leave="leave"> -->
			<ocean-item
				v-for="item in ocean"
				v-bind:ocean="item"
				v-bind:key="item.name"
				v-on:click.native="writePoem(item.index,item.name)"
			></ocean-item>
		<!-- </transition-group> -->
</div>
</template>

<script>
import WaveCanvas from "../wavecanvas/WaveCurtain.vue";
import Vue from 'vue';
import OceanItem from '../ocean/OceanItem.vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios,axios);

// import gsap from 'gsap';
// import {MOVE_INTERVAL} from '../ocean/OceanSpot.js';

const CWBDataURL='https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-A0012-001?Authorization=CWB-7021ACD5-3924-4A8B-8C5F-58BF57C9F18B&downloadType=WEB&format=JSON';

const ElementName={ 
  'Wx':'天氣',
  'WindDir':'風向',
  'WindSpeed':'風力',
  'WaveHeight':'浪高',
  'WaveType':'海浪'
};

export default{
	data(){
		return{
			ocean_list:[],
			show:false,		
			sleeptimeout:null,
		}
	},
	computed:{
		ocean(){
			// console.log('get island!');
			return this.$store.state.ocean;
		}
	},
	components:{
		OceanItem,
		WaveCanvas,
	},
	methods:{
		writePoem:function(index,name){
			
			var item;
			for(var k in this.ocean_list){
				if(this.ocean_list[k].locationName===name){
					item=this.ocean_list[k];
					break;
				}
			}

			if(!item){
				console.log('err location: '+name);
				return;
			}

			if(!this.$parent.sound_processing.playing()) this.$parent.sound_processing.play();

			let self=this;
			self.poem='waiting...'

			console.log('write a poem for '+item.locationName);
			this.$store.commit({type:'setLocation',loc:item.locationName});

			var text=[];
			for(var i in item.weatherElement){
				var el=item.weatherElement[i];
				var str_=ElementName[el['elementName']]+el['time'][0]['parameter']['parameterName'];
				text.push(str_);
			}
			console.log(text);
			this.$store.commit('setWeatherText',text);
			this.$store.dispatch('generatePoem');

			self.$router.push({
				name:'poem',
				params:{
					text:text
				}
			});

			this.$parent.setStage('poem',parseInt(index));

			if(!this.$parent.sound_bgm.playing()) this.$parent.sound_bgm.play();
			clearTimeout(this.sleeptimeout);
		},
		beforeEnter: function (el) {
			el.style.opacity = 0
			el.style.height = 0
		},
		enter: function (el, done) {
			// console.log('enter !');
			// var delay = el.dataset.index;
			// gsap.from(el,{
			// 	opacity: 0,
			// 	delay:delay,
			// 	onComplete:done,
			// });
			el;
			done;
		},
		leave: function (el, done) {
			el;
			done;
			// console.log('leave !');
			// var delay = el.dataset.index;
			// gsap.to(el,{
			// 	opacity: 0,
			// 	delay:delay,
			// 	onComplete:done,
			// });
		},
	},
	created:function(){
		console.log('map created');
			
		// if(this.ocean_list.length<1){
			let self=this;
			Vue.axios.get(CWBDataURL).then(response=>{
				var location=response.data.cwbopendata.dataset.location;
				self.ocean_list=location;     
			});   		
		// }
	},
	mounted:function(){
		this.$store.dispatch('computePageSize');
		this.$parent.$refs._ocean_canvas.resize();

		clearTimeout(this.sleeptimeout);
		this.sleeptimeout=setTimeout(()=>{
			this.$router.push({name:'home'});
			console.log('timeout!');
		},this.$store.state.timeoutInterval);
	},
	activated:function(){
		
		console.log('page map activated!');

		this.$parent.setStage('island');		

		clearTimeout(this.sleeptimeout);
		this.sleeptimeout=setTimeout(()=>{
			this.$router.push({name:'home'});
			console.log('timeout!');
		},this.$store.state.timeoutInterval);
		// this.$store.dispatch('computePageSize');	
		// this.$parent.$refs._ocean_canvas.resize();
		// let self=this;
		// setTimeout(function(){
		// 	self.show=true;
		// },1000);

		// gsap.from('#hint2_curtain',{
		// 	opacity:MOVE_INTERVAL/1000,
		// 	repeat:0,
		// });		
		
		// gsap.from('.OceanItem',{
		// 	opacity:0,
		// 	stagger:0.1,
		// 	delay:MOVE_INTERVAL/1000*1.2,
		// 	repeat:0,
		// });		
    },
	deactivated:function(){

		console.log('page map deactivated!');
		clearTimeout(this.sleeptimeout);
		// this.show=false;
	// 	gsap.to('#hint2_curtain',{
	// 		opacity:0,
	// 		delay:0,
	// 		repeat:0,
	// 	});		
		
	// 	gsap.to('.OceanItem',{
	// 		opacity:0,
	// 		stagger:0.1,
	// 		delay:MOVE_INTERVAL/1000*0.2,
	// 		repeat:0,
	// 	});		
    }


}


</script>
<style scoped lang="scss">
@import "../../assets/style/common.scss";
#_map_hint{
	margin-top:$margin-size;
}
#_map{
	align-items:flex-start;
}
#_map_wrapper{
	position: absolute;
	left:0;
	top:0;
	width: 100%;
	height: 100%;
}
</style>