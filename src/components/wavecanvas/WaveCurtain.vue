<template>
	<div :id="id+'_curtain'" ref="_curtain" class="WaveCanvas">
		<div class="canvas" :id="id+'_canvas'"></div>
		<div class="plane" :id="id+'_plane'">
			<!-- <img src="../../assets/img/title-04.png"/> -->
			<img :src="img_src" :id="id+'_img'"/>
		</div>
	</div>
</template>

<script type="text/javascript">
import {Curtains} from 'curtainsjs';
import {vs,fs} from './WaveShader.js';

export default{
	name:'wave-canvas',
	data(){
		return{
			curtains:null,
			plane:null,
			lastPoint:{x:0,y:0},
			phi:Math.random()*Math.PI*2,
			amp:1
		}
	},
	watch:{
		'$store.state.screenWidth':function(val){
			this.resize(val);
		},
		'$store.state.screenHeight':function(val){
			this.resize(val);
		}
	},
	props:{
		img_src:String,
		id:String,
		ratio:Number
	},
	mounted:function(){
		this.init(this.$props.ratio);
	},
	methods:{
		init:function(ratio){
			// console.log('init curtain');

			let planeElement=document.getElementById(this.$props.id+"_plane");
			let curtainElement=document.getElementById(this.$props.id+"_curtain");
			curtainElement.style.height=ratio*curtainElement.clientWidth+'px';
			// console.log(curtainElement.style.height);

			this.curtains=new Curtains({container:this.$props.id+"_canvas",
										production:true,
										autoResize:false});
			
			let params={
				vertexShader: vs, // our vertex shader ID
				fragmentShader: fs, // our fragment shader ID
				widthSegments: 10,
				heightSegments: 5,
				uniforms: {
					resolution: { // resolution of our plane
						name: "uResolution",
						type: "2f", // notice this is an length 2 array of floats
						value: [1,ratio],
					},
					time: { // time uniform that will be updated at each draw call
						name: "uTime",
						type: "1f",
						value: 0,
					},
					mousePosition: { // our mouse position
						name: "uMousePosition",
						type: "2f", // again an array of floats
						value: [this.lastPoint.x, this.lastPoint.y],
					},
					mouseMoveStrength: { // the mouse move strength
						name: "uMouseMoveStrength",
						type: "1f",
						value: 0,
					}
				}
			};
			this.plane=this.curtains.addPlane(planeElement,params);
			// if(this.plane){
			// 	this.plane.onRender(function(){
			// 		this.plane.uniforms.time.value++;
			// 	});
			// }
			curtainElement.getElementsByTagName('canvas')[0].style.width='100%';
			curtainElement.getElementsByTagName('canvas')[0].style.height='unset';

			this.lastPoint=[Math.random(),Math.random()];
			this.draw();

		},
		resize:function(){
			this.$refs._curtain.style.height=this.$refs._curtain.clientWidth*this.$props.ratio+'px';
		},
		draw:function(){
			// if(this.plane) this.plane.uniforms.time.value++;
			if(this.plane){
				this.lastPoint[0]+=Math.sin(this.plane.uniforms.time.value/20.0+this.phi)*.1;
				this.lastPoint[1]+=Math.sin(this.plane.uniforms.time.value/50.0+this.phi)*.1;
				this.plane.uniforms.mousePosition.value=this.lastPoint;
				this.plane.uniforms.time.value++;
				this.plane.uniforms.mouseMoveStrength.value=Math.abs(Math.sin(this.plane.uniforms.time.value/100.0)*this.amp)+0.2;
			}
			requestAnimationFrame(this.draw);
		}
	}

}

</script>
<style lang="scss">
.WaveCanvas{
	position: relative;
	width:100%;
	opacity: 1;
	// height:1474 / 2282 * 100%;
	// height:100%;
	.canvas{
		position: absolute;
		width:100%;
		height:100%;
	}
	.plane{
		position: absolute;
		width: 100%;
		height: 100%;
		left:0;
		top:0;
		// bottom:0;
		// right: 0;
		// padding:-5px;
		// display: none;
		img{
			display:none;
		}
	}
}


</style>