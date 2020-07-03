<template>
	<div class="CenterWrapper">
		<div id="_title" @click="startClick">
			<TitleSvg/>
			<div class="HintRegion">
				從台灣沿海氣象預報<br>
				為你寫一首詩
			</div>
		</div>
		<WaveCanvas ref='_title_canvas'/>
		<!-- <div>{{date_str}}</div> -->				
	</div>
</template>

<script>
// import gsap from 'gsap';
import TitleSvg from "../../assets/img/title.svg";
import WaveCanvas from "../ocean/WaveCanvas.vue";

export default {
	name:'PageHome',
	components:{
		TitleSvg,
		WaveCanvas
	},
	data(){
		return{
			date_str:new Date().toLocaleString(),
			wavetexture:null
		}
    },
    methods:{
		startClick:function(){
			this.$router.push('map');
		},
		update:function(){

			requestAnimationFrame(this.update);
		}
    },
    mounted(){
		// gsap.to('#_title',{y:100,duration:3});
		// this.$parent.setOceanStatus('float');
		this.$parent.$refs['_ocean_canvas'].goFloat();				
		// this.$refs._title_canvas.init();

		// this.update();
    }
}
</script>

<style lang="scss">
@import "../../assets/style/common.scss";

#_title{
	img{
		max-width:45%;
		height:auto;
		max-height: 30%;
	}	
	cursor:pointer;
}

</style>