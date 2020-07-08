<template>
	<div :id="id+'_curtain'">
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
			lastPoint:{x:0,y:0}
		}
	},
	props:{
		img_src:String,
		id:String
	},
	mounted:function(){
		// console.log(vs);
		this.curtains=new Curtains({container:this.$props.id+"_canvas"});
		let planeElement=document.getElementById(this.$props.id+"_plane");
		let imgElement=document.getElementById(this.$props.id+"_img");
		console.log(imgElement.naturalWidth+', '+imgElement.naturalHeight);

		let params={
			vertexShader: vs, // our vertex shader ID
			fragmentShader: fs, // our fragment shader ID
			widthSegments: 10,
			heightSegments: 5,
			uniforms: {
				resolution: { // resolution of our plane
					name: "uResolution",
					type: "2f", // notice this is an length 2 array of floats
					value: [planeElement.clientWidth, planeElement.clientHeight],
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
		this.init();
	},
	methods:{
		init:function(){

			this.lastPoint=[Math.random(),Math.random()];
			this.draw();

		},
		draw:function(){
			// if(this.plane) this.plane.uniforms.time.value++;
			if(this.plane){
				this.lastPoint[0]+=Math.sin(this.plane.uniforms.time.value/20.0)*.01;
				this.lastPoint[1]+=Math.sin(this.plane.uniforms.time.value/50.0)*.01;
				this.plane.uniforms.mousePosition.value=this.lastPoint;
				this.plane.uniforms.time.value++;
				this.plane.uniforms.mouseMoveStrength.value=Math.sin(this.plane.uniforms.time.value/100.0)*2+5;
			}
			requestAnimationFrame(this.draw);
		}
	}

}

</script>
<style lang="scss" scoped>
div{
	position: relative;
	width:100%;
	height:1474 / 2282 * 100%;
	// height:100%;
	.canvas{
		// position: absolute;
		width:100%;
		height:100%;
		// padding:5px;
	}
	.plane{
		position: absolute;
		// width: 100%;
		// height: 100%;
		left:5%;
		top:5%;
		bottom: 5%;
		right: 5%;
		// padding:-5px;
		// display: none;
		img{
			width: 80%;
			display:none;
		}
	}
}


</style>