<template>
	<div class="CenterWrapper">
		<div id="_title" @click="startClick"  class="CenterWrapper">
			<!-- <TitleSvg/> -->
			<WaveCanvas id="title" img_src="img/title.png" :ratio="0.65"></WaveCanvas>
			<WaveCanvas class="HintRegion" id="hint1" img_src="img/hint-1.png" :ratio="0.32"></WaveCanvas>
			<!-- <div class="HintRegion">
				從台灣沿海氣象預報<br>
				為你寫一首詩
			</div> -->
		</div>
		<!-- <div>{{date_str}}</div> -->				
	</div>
</template>

<script>
// import gsap from 'gsap';
// import TitleSvg from "../../assets/img/title.svg";
import WaveCanvas from "../wavecanvas/WaveCurtain.vue";

export default {
	name:'PageHome',
	components:{
		// TitleSvg,
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
			// this.$parent.$refs['_ocean_canvas'].goIsland();				
		
		},
		update:function(){

			requestAnimationFrame(this.update);
		}
    },
    activated:function(){
		// gsap.to('#_title',{y:100,duration:3});
		// this.$parent.setOceanStatus('float');
		this.$parent.setStage('floating');				
		// this.$refs._title_canvas.init();

		// this.update();
    }
}
</script>

<style lang="scss">

#_title{
	width:100%;
	cursor:pointer;
	flex-direction:column;
}

</style>