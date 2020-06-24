<template>
	<div class="CenterWrapper">
		<div id="_title" @click="startClick">
			<img src="../../assets/img/title-04.png"/>
			<div>從台灣沿海氣象預報<br>
			為你寫一首詩</div>
		</div>
		<!-- <div>{{date_str}}</div> -->				
	</div>
</template>

<script>
// import gsap from 'gsap';

export default {
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
    }
}
</script>

<style lang="scss">
@import "../../assets/style/global_var.scss";
@import "../../assets/style/common.scss";

#_title{
	img{
		max-width:45%;
		height:auto;
		max-height: 30%;
	}
	div{
		color:white;
		font-size: $header-size;
	}
	cursor:pointer;
}

</style>