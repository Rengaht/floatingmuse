<template>
	<div>
		<!-- <div id="_poem" class="CenterWrapper">		
			<div class="PoemRegion">
				<poem-item 
					v-for="item in poem"
					v-bind:poem="item"
					v-bind:key="item.text"				
				></poem-item>
			</div>			
		</div>
		<div class="TitleRegion">
			<div class="title">{{location}}</div>
			<div class="title">{{date_str}}</div>
		</div>	 -->
		<div class="ButtonRegion">
				<div class="Button" @click="rewriteClick">
					<WaveCanvas id="hint3" img_src="img/hint-3.png" :ratio="0.42" ></WaveCanvas>
				</div>
				<div class="Button" @click="homeClick">
					<WaveCanvas id="hint4" img_src="img/hint-4.png" :ratio="0.42"></WaveCanvas>
				</div>
		</div>
	</div>
</template>

<script>
import WaveCanvas from "../wavecanvas/WaveCurtain.vue";
// import PoemItem from '../poem/PoemItem.vue';
// import gsap from 'gsap';

export default{		
	data:function(){
		return{
			date_str:new Date().toLocaleString()
		}
	},
	components:{
		// PoemItem,
		WaveCanvas,
	},
	watch:{
		'$store.state.generating':function(val){
			if(!val){
				// console.log('finish generating!');
				this.$parent.$refs['_poem_canvas'].addWeather(this.poem,this.location,this.date_str);
			}
		},
	},
	computed:{
		location:function(){
			return this.$store.state.location;
		},
		poem:function(){
			return this.$store.state.poem;			
		},
		generating:function(){
			return this.$store.state.generating;
		}
	},
	methods:{
		rewriteClick:function(){			
			this.date_str=new Date().toLocaleString();
			this.$store.dispatch('generatePoem');			
		},
		homeClick:function(){
			this.$router.push({name:'home'});
		}		
	},
	created:function(){

		// TODO: check autoback!
		
		// if(!this.$store.state.generating){
		// 	this.$router.push({name:'home'});
		// 	return;
		// }
		// this.poem=this.text.join('\n');
		//this.generatePoem();
	},
	activated:function(){
		//this.$parent.$refs['_poem_canvas'].addWeather(this.poem);
	},
	updated(){
		console.log('poem view updated!');
		// gsap.from('.PoemItem',{
		// 	opacity:0,
		// 	stagger:0.1
		// });
	}
}

</script>

<style scoped lang="scss">
@import "../../assets/style/global_var.scss";

#_poem{
	margin-top:$margin-size;
	.PoemRegion{
		
	}	
}
.TitleRegion{
	position: absolute;
	right:$margin-size;
	bottom:$margin-size*5;
	text-align: right;

	color:$poem-color;
	font-size:$poem-title-size;		
}	
.ButtonRegion{
	position: absolute;
	bottom:$margin-size;
	left:$margin-size;
	// right:$margin-size;
	width:50%;
	.Button{
		display:inline-block;
		color:$button-color;
		font-size:$hint-size;

		margin-left:$margin-size/2;
		margin-right:$margin-size/2;

		$all_pad:$margin-size*2;
		width: calc((100% - #{$all_pad})/2);
	}
}



</style>