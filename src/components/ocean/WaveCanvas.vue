<template>
	<div id="_wave_canvas">
		<canvas ref="_wave_canvas" width="500" height="500"></canvas>
		<!-- <img src="../../assets/img/title-04.png"/> -->
	</div>
</template>

<script type="text/javascript">
import WaveShader from './WaveShader';
import WaveTexture from "./WaveTexture.js";

export default{
	name:'wave-canvas',
	data(){
		return{
			shader:null,
			wave_texture:null,
			text_texture:null,
			gl:null,
			image:null
		}
	},
	mounted:function(){
		this.image=new Image;
		const self=this;
		this.image.onload=function(){
			self.init();
		};
		this.image.onerror=function(err){
			console.log(err);
		};
		this.image.src="./img/title.png";
	},
	methods:{
		init:function(){
			console.log("init wave canvas");
			this.canvas=this.$refs._wave_canvas;
			this.gl=this.canvas.getContext('webgl');	

			this.wave_texture=new WaveTexture(500,500);
			this.wave_texture.init();
			// document.getElementById('_wave_canvas').appendChild(this.wave_texture.getTexture());

			this.shader=new WaveShader(this.gl);
			this.shader.init(this.gl);
			

			// this.canvas=this.wave_texture.canvas;
			this.shader.step(this.gl,
				this.wave_texture.getTexture(),this.image);

			this.draw();
		},
		draw:function(){
			this.wave_texture.update();
			this.shader.draw(this.gl);

			requestAnimationFrame(this.draw);
		}
	}

}

</script>