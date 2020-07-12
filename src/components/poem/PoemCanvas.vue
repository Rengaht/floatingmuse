<template>
	<div id="_poem_container"></div>	
</template>


<script type="text/javascript">
import * as THREE from 'three';
import PoemChar from './PoemChar.js';
import {TweenMax} from 'gsap';
 
const TRANSITON_INTERVAL=2500;

export default{
	name:'poem-canvas',
	data(){
		return{
			camera:null,
			scene:null,
			renderer:null,
			width:this.$store.state.screenWidth,
			height:this.$store.state.screenHeight,
			text:[],
			cameraZ:1500,
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
			var container = document.getElementById('_poem_container');
			this.camera = new THREE.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 0.01, this.cameraZ);
			this.camera.position.z = this.cameraZ;

			this.scene = new THREE.Scene();

		
			
			this.renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
			this.renderer.setClearColor(0xffffff,0);
			this.renderer.sortObjects=false;

			this.renderer.setSize(container.clientWidth, container.clientHeight);
			container.appendChild(this.renderer.domElement);
		},
		resize:function(){
			
			this.renderer.setSize(this.width,this.height);
			this.renderer.render(this.scene,this.camera);
		
		},
		animate:function(){

			// if(Math.random()*10<1) this.addChar('A');
			this.renderer.render(this.scene, this.camera);
			requestAnimationFrame(this.animate);
			
		},
		addSentence:function(text){

			for(var i in text){
				this.addChar(text[i],0);
			}
		},
		addChar:function(char_,repeat_=-1){
		
			var pchar=new PoemChar(char_);
			var text=pchar.textObject;
			text.position.x=Math.random()*this.width-this.width/2;
			text.position.y=Math.random()*this.height-this.height/2;
			text.position.z=-Math.random()*100;

			this.text.push(text);

			TweenMax.to(this.text[this.text.length-1].position,TRANSITON_INTERVAL/1000.0,{
					z:this.cameraZ,
					repeat:repeat_,
					delay:Math.random()*TRANSITON_INTERVAL/1000,
				});

			this.scene.add(text);
		},
	},
	created(){
		
	},
	mounted(){
		this.init();
		for(var i=0;i<50;++i) this.addChar('A');
		this.animate();
	}

}
</script>
<style lang="scss" scoped>
#_poem_container{
	position: absolute;
	top:0;
	width:100%;
	height:100%;
}
</style>

