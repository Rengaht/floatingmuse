<template>
	<div id="_ocean_container"></div>	
</template>


<script type="text/javascript">
import * as THREE from 'three';
import {vs,fs,fs_tw,NUM_METABALLS,NUM_METABALLS_TW} from './OceanShader.js';
import OceanSpot from './OceanSpot.js';
import {TweenMax,Expo} from 'gsap';

const TRANSITON_INTERVAL=3000;
// import OceanShader from './OceanShader';

export default{
	name:'ocean-canvas',
	data(){
		return{
			camera:null,
			scene:null,
			renderer:null,
			mesh_ocean:null,
			mesh_taiwan:null,
			width:this.$store.state.screenWidth,
			height:this.$store.state.screenHeight,
			spots:[],
			material_ocean:null,
			material_taiwan:null,
			stage:'floating',
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



			for(var i=0;i<NUM_METABALLS;++i){
				let spot=new OceanSpot(this.width,this.height);
				if(i<NUM_METABALLS_TW) 
					spot.is_tw=true;
				this.spots.push(spot);

			}
			let mask_region=this.$store.getters.getMaskRegion;
			

			this.material_ocean=new THREE.ShaderMaterial({
				uniforms:{
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
						value:this.width
					},
					height:{
						value:this.height
					},
					layer:{
						value:5.0
					},
					roi_pos_x:{
						value:.5,
					},
					roi_pos_y:{
						value:.5,
					},
					roi_size_x:{
						value:1,	
					},
					roi_size_y:{
						value:1,	
					},
				},
				transparent: true,
				vertexShader:vs,
				fragmentShader:fs
			});


			// console.log(mask_region);

			this.material_taiwan=new THREE.ShaderMaterial({
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
					},
					ISLAND_COLOR:{
						value:new Float32Array([55/256,186/256,184/256,
												43/256,121/256,180/256,
												19/256,160/256,182/256,
												18/256,86/256,142/256]),
					},
					mask_region:{
						value:new Float32Array([mask_region.x/this.width,
												mask_region.y/this.height,
												mask_region.w/this.width,
												mask_region.w/this.height]),
					},
					roi_pos_x:{
						value:.5,
					},
					roi_pos_y:{
						value:.5,
					},
					roi_size_x:{
						value:1,	
					},
					roi_size_y:{
						value:1,	
					},
				},
				transparent: true,
				vertexShader:vs,
				fragmentShader:fs_tw
			});

			// console.log(this.material_taiwan.uniforms.mask_region.value);

			this.mesh_ocean = new THREE.Mesh(geometry, this.material_ocean);
			TweenMax.to(this.material_ocean.uniforms.tt,6,{value:10, yoyo:true, repeat:-1});

			this.mesh_taiwan= new THREE.Mesh(geometry, this.material_taiwan);
			
			this.scene.add(this.mesh_taiwan);
			this.scene.add(this.mesh_ocean);
			
			this.renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
			this.renderer.setClearColor(0xffffff,0);
			this.renderer.sortObjects=false;

			this.renderer.setSize(container.clientWidth, container.clientHeight);
			container.appendChild(this.renderer.domElement);
		},
		animate:function(){
			requestAnimationFrame(this.animate)
			// this.mesh_ocean.rotation.x += 0.01
			// this.mesh_ocean.rotation.y += 0.02


			var i=0;
			for(i=0;i<NUM_METABALLS;++i)
				this.spots[i].step(this.width,this.height);

			// if(this.stage==="floating"){
			// 	let data=this.packSpots(this.spots);
			// 	this.material_ocean.uniforms.metaballs.value=data;
			// 	this.material_taiwan.uniforms.metaballs.value=new Float32Array(3*NUM_METABALLS_TW);
			// 	// this.material_taiwan.uniforms.metaballs.value=data;
			if(this.stage==="island" || this.stage==='poem'){
				var data_ocean=this.packSpots(this.spots.filter(p=>!p.is_tw),NUM_METABALLS);
				var data_tw=this.packSpots(this.spots.filter(p=>p.is_tw));
				
				this.material_ocean.uniforms.metaballs.value=data_ocean;
				// this.material_ocean.uniforms.metaballs.value=new Float32Array(3*NUM_METABALLS);
				
				this.material_taiwan.uniforms.metaballs.value=data_tw;
			}else{
				let data=this.packSpots(this.spots);
				// var data_tw=this.packSpots(this.spots.filter(p=>p.is_tw));
				this.material_ocean.uniforms.metaballs.value=data;
				this.material_taiwan.uniforms.metaballs.value=new Float32Array(3*NUM_METABALLS_TW);
			}
			// }else{
			// 	let data=this.packSpots(this.spots);
			// 	this.material_ocean.uniforms.metaballs.value=data;
			// 	this.material_taiwan.uniforms.metaballs.value=new Float32Array(3*NUM_METABALLS_TW);
				
			// }

			// var dataToSendToGPU = new Float32Array(3 * NUM_METABALLS);
			// for (i = 0; i <NUM_METABALLS; i++) {
			// 	var baseIndex = 3 * i;
			// 	var mb = this.spots[i];
			// 	dataToSendToGPU[baseIndex + 0] = mb.x/this.width;
			// 	dataToSendToGPU[baseIndex + 1] = mb.y/this.height;
			// 	dataToSendToGPU[baseIndex + 2] = mb.r/Math.min(this.width,this.height);
			// }
			// this.material_ocean.uniforms.metaballs.value=dataToSendToGPU;
			// this.material_ocean.uniforms.tt.value++;




			this.renderer.render(this.scene, this.camera);
		},
		packSpots:function(arr,len){
			// console.log(arr);
			if(len==undefined) len=arr.length;

			var dataToSendToGPU = new Float32Array(3 * len);
			for(var i = 0; i <arr.length; i++){
				var baseIndex = 3 * i;
				var mb = arr[i];
				dataToSendToGPU[baseIndex + 0] = mb.x/this.width;
				dataToSendToGPU[baseIndex + 1] = mb.y/this.height;
				dataToSendToGPU[baseIndex + 2] = mb.r/this.height;
			}
			return dataToSendToGPU;
		},
		resize:function(){

			console.log('ocean canvas shader resize!');

			
			this.material_ocean.uniforms.width.value=this.width;
			this.material_ocean.uniforms.height.value=this.height;

			// this.material_taiwan.uniforms.width.value=this.width;
			// this.material_taiwan.uniforms.height.value=this.height;

			let mask_region=this.$store.getters.getMaskRegion;
			this.material_taiwan.uniforms.mask_region.value=new Float32Array([mask_region.x/this.width,
																			mask_region.y/this.height,
																			mask_region.w/this.width,
																			mask_region.w/this.height]);
			// console.log(this.material_taiwan.uniforms.mask_region.value);

			// this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
			// this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
			for(var i=0;i<NUM_METABALLS;++i){
				this.spots[i].width=this.width;
				this.spots[i].height=this.height;

					if(this.stage==='island'){
						if(!this.spots[i].is_tw){
						var index=i-NUM_METABALLS_TW;
						let pos=this.$store.getters.getOceanPositionCanvas(index);
						// console.log(pos);
						this.spots[i].setDest(pos.x,pos.y,TRANSITON_INTERVAL*.1,.25);
					}else{
						// var rad=.4;
						let pos=this.$store.getters.getIslandPositionCanvas(i);
						this.spots[i].setDest(pos.x,pos.y,TRANSITON_INTERVAL*.1,pos.r);	
					}
				}
			}

			
			var aspect = this.width/this.height;
			var vFov = this.camera.fov * Math.PI / 180;
			var planeHeight = 2 * Math.tan(vFov / 2);
			var planeWidth = planeHeight * aspect;
			var geometry =new THREE.PlaneBufferGeometry(planeWidth,planeHeight,1,1);
			
			this.camera.aspect = aspect;
			this.camera.updateProjectionMatrix();

			this.mesh_ocean.geometry=geometry;
			this.mesh_taiwan.geometry=geometry;

			this.renderer.setSize(this.width,this.height);
			this.renderer.render(this.scene,this.camera);
			
		},
		goIsland:function(){


			var i;
			for(i=0;i<NUM_METABALLS;++i){
				this.spots[i].stage='island';
				// console.log(i);
				// if(i<this.$store.state.island.length){
				if(!this.spots[i].is_tw){
					var index=i-NUM_METABALLS_TW;
					let pos=this.$store.getters.getOceanPositionCanvas(index);
					// console.log(pos);
					this.spots[i].setDest(pos.x,pos.y,TRANSITON_INTERVAL,.25);
				}else{
					// var rad=.4;
					let pos=this.$store.getters.getIslandPositionCanvas(i);
					this.spots[i].setDest(pos.x,pos.y,TRANSITON_INTERVAL,pos.r);	
				}
			}
			
			TweenMax.to(this.material_taiwan.uniforms.tt,TRANSITON_INTERVAL/1000.0*.5,{value:1,delay:TRANSITON_INTERVAL/1000*0.5});
			// TweenMax.to(this.material_ocean.uniforms.mask_tt,TRANSITON_INTERVAL/1000.0*.5,{value:1,delay:TRANSITON_INTERVAL/1000*0.5});
			
			TweenMax.to(this.material_ocean.uniforms.layer,TRANSITON_INTERVAL/1000.0,{value:5.0});

			this.setShaderROI(.5,.5,1,1,TRANSITON_INTERVAL*.5,0);

		},
		goFloat:function(){
			var i;
			for(i=0;i<NUM_METABALLS;++i){
				this.spots[i].stage='floating';
				this.spots[i].setDest(undefined,undefined,TRANSITON_INTERVAL);
			}
			
			TweenMax.to(this.material_taiwan.uniforms.tt,TRANSITON_INTERVAL/1000.0,{value:0});
			TweenMax.to(this.material_ocean.uniforms.layer,TRANSITON_INTERVAL/1000.0,{value:1.0});

			this.setShaderROI(.5,.5,1,1,TRANSITON_INTERVAL*2,0);

		},
		goPoem:function(index){
			
			console.log('go poem!');
			index+=NUM_METABALLS_TW;

			// for(var i=0;i<NUM_METABALLS;++i){
			// 	this.spots[i].stage='island';
			// 	if(i==index || Math.random()*3<1){
			// 		var dest_rad=Math.min(this.width,this.height)*.5*(Math.random()*.5+.5);
			// 		this.spots[i].setDest(this.width/2+(Math.random()*2-1)*dest_rad,this.height/2+(Math.random()*2-1)*dest_rad,TRANSITON_INTERVAL,.8);	
			// 	}else{
			// 		var ang=Math.random()*Math.PI*2;
			// 		var rad=(Math.random()*.4+.5);
			// 		this.spots[i].setDest(this.width*(.5+rad*Math.sin(ang)),
			// 							this.height*(.5+rad*Math.cos(ang)),TRANSITON_INTERVAL);	
			// 	} 
			// }	
			// TweenMax.to(this.material_taiwan.uniforms.tt,TRANSITON_INTERVAL/1000.0,{value:1});
			TweenMax.to(this.material_taiwan.uniforms.mask_tt,TRANSITON_INTERVAL/1000.0,{value:1});
			
			TweenMax.to(this.material_ocean.uniforms.layer,TRANSITON_INTERVAL/1000.0,{value:4.0});

			// console.log('dest pos= '+this.spots[index].x+' , '+this.spots[index].y);
			this.setShaderROI(this.spots[index].x/this.width,this.spots[index].y/this.height,.1,.1,TRANSITON_INTERVAL*.5,0);

			
		},
		setShaderROI:function(x,y,w,h,interval,delay){
			TweenMax.to(this.material_ocean.uniforms.roi_pos_x,interval/1000.0,{value:x,delay:delay,ease:Expo.easeOut});
			TweenMax.to(this.material_ocean.uniforms.roi_pos_y,interval/1000.0,{value:y,delay:delay,ease:Expo.easeOut});
			TweenMax.to(this.material_ocean.uniforms.roi_size_x,interval/1000.0,{value:w,delay:delay,ease:Expo.easeOut});
			TweenMax.to(this.material_ocean.uniforms.roi_size_y,interval/1000.0,{value:h,delay:delay,ease:Expo.easeOut});

			TweenMax.to(this.material_taiwan.uniforms.roi_pos_x,interval/1000.0,{value:x,delay:delay,ease:Expo.easeOut});
			TweenMax.to(this.material_taiwan.uniforms.roi_pos_y,interval/1000.0,{value:y,delay:delay,ease:Expo.easeOut});
			TweenMax.to(this.material_taiwan.uniforms.roi_size_x,interval/1000.0,{value:w,delay:delay,ease:Expo.easeOut});
			TweenMax.to(this.material_taiwan.uniforms.roi_size_y,interval/1000.0,{value:h,delay:delay,ease:Expo.easeOut});


		},
		setStage:function(set_,index){
			switch(set_){
				case 'floating': this.goFloat(); break;
				case 'island': this.goIsland(); break;
				case 'poem':this.goPoem(index);break;
			}
			this.stage=set_;
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

