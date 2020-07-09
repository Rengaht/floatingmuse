<template>
	<div id="_ocean_container"></div>	
</template>


<script type="text/javascript">
import * as THREE from 'three';
import {vs,fs,NUM_METABALLS} from './OceanShader.js';
import OceanSpot from './OceanSpot.js';
// import OceanShader from './OceanShader';

export default{
	name:'ocean-canvas',
	data(){
		return{
			camera:null,
			scene:null,
			renderer:null,
			mesh:null,
			width:this.$store.state.screenWidth,
			height:this.$store.state.screenHeight,
			spots:[],
			material:null
		}
	},
	watch:{
		'$store.state.screenWidth':function(val){
			this.width=val;
			this.resize();
		},
		'$store.state.screenHeight':function(val){
			this.height=val;
			this.resize();
		}
	},
	methods:{
		init:function(){
			var container = document.getElementById('_ocean_container');
			this.camera = new THREE.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 0.01, 10);
			this.camera.position.z = 1;

			this.scene = new THREE.Scene();

			var aspect = container.clientWidth/container.clientHeight;
			var vFov = this.camera.fov * Math.PI / 180;
			var planeHeight = 2 * Math.tan(vFov / 2);
			var planeWidth = planeHeight * aspect;
			var geometry =new THREE.PlaneBufferGeometry(planeWidth,planeHeight,1,1);
			// var material = new THREE.MeshNormalMaterial();



			for(var i=0;i<NUM_METABALLS;++i)
				this.spots.push(new OceanSpot(this.width,this.height));

			this.material=new THREE.ShaderMaterial({
				uniforms:{
					mask:{
						type:"t",
						value:new THREE.TextureLoader().load("img/taiwan_mask.png")
					},
					ocean_color:{
						value:new Float32Array([
									0.0,0.375,0.62,
									0.08,0.375,0.65,
									0.16,0.52,0.68,
									0.25,0.59,0.72])
					},
					metaballs:{
						value:new Float32Array(3*NUM_METABALLS)
					},
					tt:{
						value:0
					},
					width:{
						value:planeWidth
					},
					height:{
						value:planeHeight
					}
				},
				vertexShader:vs,
				fragmentShader:fs
			});


			this.mesh = new THREE.Mesh(geometry, this.material);
			this.scene.add(this.mesh);

			this.renderer = new THREE.WebGLRenderer({ antialias: true });
			this.renderer.setSize(container.clientWidth, container.clientHeight);
			container.appendChild(this.renderer.domElement);
		},
		animate:function(){
			requestAnimationFrame(this.animate)
			// this.mesh.rotation.x += 0.01
			// this.mesh.rotation.y += 0.02


			var i=0;
			for(i=0;i<NUM_METABALLS;++i)
				this.spots[i].step(this.width,this.height);

			var dataToSendToGPU = new Float32Array(3 * NUM_METABALLS);
			for (i = 0; i <NUM_METABALLS; i++) {
				var baseIndex = 3 * i;
				var mb = this.spots[i];
				dataToSendToGPU[baseIndex + 0] = mb.x/this.width;
				dataToSendToGPU[baseIndex + 1] = mb.y/this.height;
				dataToSendToGPU[baseIndex + 2] = mb.r/Math.min(this.width,this.height);
			}
			this.material.uniforms.metaballs.value=dataToSendToGPU;
			this.material.uniforms.tt.value++;

			this.renderer.render(this.scene, this.camera)
		},
		resize:function(){
			
			this.material.uniforms.width.value=this.width;
			this.material.uniforms.height.value=this.height;

			this.renderer.setSize(this.width,this.height);
			this.renderer.render(this.scene,this.camera);
			// this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
			// this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
			for(var i=0;i<NUM_METABALLS;++i){
				this.spots[i].width=this.width;
				this.spots[i].height=this.height;
			}
		},
		goIsland:function(){
			var i;
			for(i=0;i<NUM_METABALLS;++i){
				this.spots[i].stage='island';
				// console.log(i);
				if(i<this.$store.state.island.length){
					let pos=this.$store.getters.getIslandPositionCanvas(i);
					console.log(pos);
					this.spots[i].setDest(pos.x,this.height-pos.y,200,.2);
				}else{
					var ang=Math.random()*Math.PI*2;
					var rad=(Math.random()*.4+.4);
					this.spots[i].setDest(this.width*(.5+rad*Math.sin(ang)),
										this.height*(.5+rad*Math.cos(ang)),200);	
				}
			}
		},
		goFloat:function(){
			var i;
			for(i=0;i<NUM_METABALLS;++i){
				this.spots[i].stage='floating';
				this.spots[i].setDest(undefined,undefined,200);
			}
		},
		goPoem:function(index){
			
			console.log('go poem!');

			for(var i=0;i<NUM_METABALLS;++i){
				this.spots[i].stage='island';
				if(i==index || Math.random()*3<1){
					var dest_rad=Math.min(this.width,this.height)*.5*(Math.random()*.5+.5);
					this.spots[i].setDest(this.width/2+(Math.random()*2-1)*dest_rad,this.height/2+(Math.random()*2-1)*dest_rad,200,.8);	
				}else{
					var ang=Math.random()*Math.PI*2;
					var rad=(Math.random()*.4+.5);
					this.spots[i].setDest(this.width*(.5+rad*Math.sin(ang)),
										this.height*(.5+rad*Math.cos(ang)),200);	
				} 
			}	
		},
	},
	mounted(){
		this.init();
		this.animate();
	}

}
</script>
<style lang="scss" scoped>
#_ocean_container{
	width:100%;
	height:100%;
}
</style>

