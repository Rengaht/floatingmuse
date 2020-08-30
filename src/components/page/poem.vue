<template>
	<div>
		<keep-alive>
			<!-- <div class="ButtonRegion" :style="show_button?'display:block;':'display:none;'" -->
			<div class="ButtonRegion" :style="show_button?'display:block;':'display:none;'">
				<div class="Button" @click="rewriteClick">
					<img src="img/hint-3.png" id="hint3"/>
					<!-- <WaveCanvas id="hint3" img_src="img/hint-3.png" :ratio="0.42" ></WaveCanvas> -->
				</div>
				<div class="Button" @click="homeClick">
					<img src="img/hint-4.png" id="hint4"/>
					<!-- <WaveCanvas id="hint4" img_src="img/hint-4.png" :ratio="0.42"></WaveCanvas> -->
				</div>
			</div>
		</keep-alive>
	</div>
</template>

<script>
// import WaveCanvas from "../wavecanvas/WaveCurtain.vue";
// import PoemItem from '../poem/PoemItem.vue';
import gsap from 'gsap';

export default{		
	data:function(){
		return{
			show_button:new Date().toLocaleString(),
			sleeptimeout:null,
		}
	},
	components:{
		// PoemItem,
		// WaveCanvas,
	},
	watch:{
		'$store.state.generating':function(val){
			if(!val){
				this.startPoem();
			}
		},
	},
	computed:{
		date_str:function(){
			var today=new Date();
			var m=today.getMonth();
			var d=today.getDate();

			// var hh=today.getHour();
			// var mm=today.getMiniute();
			// var ss=today.getSecond();

			return today.getFullYear()+'/'+this.pad(m+1,2)+'/'+this.pad(d,2);
		},
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

			this.show_button=false;
			
			this.$parent.$refs._poem_canvas.clear();
			this.$parent.$refs._poem_canvas.resetChar();
			
			// if(!this.$parent.sound_processing.playing()) this.$parent.sound_processing.play();
			this.$store.dispatch('generatePoem');			

			if(!this.$parent.sound_bgm.playing()) this.$parent.sound_bgm.play();
			clearTimeout(this.sleeptimeout);
		},
		homeClick:function(){

			if(!this.$parent.sound_bgm.playing()) this.$parent.sound_bgm.play();
			this.$router.push({name:'home'});
		},
		pad:function(n,width,z){
			z = z || '0';
			n = n + '';
			return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
		},
		startPoem:function(){
			
			this.show_button=false;
			var delay1_,delay2_;
			[delay1_,delay2_]=this.$parent.$refs['_poem_canvas'].addWeather(this.poem,this.location,this.date_str);
			//delay1_;
			this.$parent.sound_processing.stop();

			this.$parent.sound_finish.play();

			let sound=this.$parent.sound_fadein;
			setTimeout(function(){
				sound.play();
			},delay1_);

			// let show=this.show_button;
			setTimeout(()=>{
				this.show_button=true;

				gsap.from(".ButtonRegion",{
					opacity:0,
					duration:1,
				});


				clearTimeout(this.sleeptimeout);
				this.sleeptimeout=setTimeout(()=>{

					this.$router.push({name:'home'});
					console.log('timeout!');
				},this.$store.state.timeoutInterval+delay2_);
			},delay2_+3000);


		},
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
	mounted:function(){

		if(!this.generating){
			this.$router.push({name:'home'});
		}
	},
	activated:function(){
		this.show_button=false;

		if(!this.generating){
			this.$router.push({name:'home'});
		}
		//this.$parent.$refs['_poem_canvas'].addWeather(this.poem);
	},
	updated(){
		console.log('poem view updated!');
		// gsap.from('.PoemItem',{
		// 	opacity:0,
		// 	stagger:0.1
		// });
	},
	deactivated:function(){
		clearTimeout(this.sleeptimeout);
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

		img{
			width: 100%;
		}
	}
}



</style>