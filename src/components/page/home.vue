<template>
	<div class="CenterWrapper">
		<div id="_title" @click="startClick">
			<TitleSvg/>
			<div class="HintRegion">
				從台灣沿海氣象預報<br>
				為你寫一首詩
			</div>
		</div>
		<!-- <div>{{date_str}}</div> -->				
	</div>
</template>

<script>
// import gsap from 'gsap';
import TitleSvg from "../../assets/img/title.svg";

export default {
	name:'PageHome',
	components:{
		TitleSvg
	},
	data(){
		return{
		date_str:new Date().toLocaleString()
		}
    },
    methods:{
		startClick:function(){
			this.$router.push('map');
		}
    },
    mounted(){
		// gsap.to('#_title',{y:100,duration:3});
		// this.$parent.setOceanStatus('float');
		this.$parent.$refs['_ocean_canvas'].goFloat();
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