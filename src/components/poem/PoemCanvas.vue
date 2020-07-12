<template>
	<div id="_poem_container"></div>	
</template>


<script type="text/javascript">
import * as THREE from 'three';
import PoemChar from './PoemChar.js';
import {FONT_SIZE,LINE_HEIGHT,MOVE_INTERVAL} from './PoemChar.js';

 
// const TRANSITON_INTERVAL=2500;
const NUM_CHAR=50;
const WEATHER_COLOR="#E8FFD3";
const POEM_COLOR="white";
const POEM_PADDING=60;
const CHAR_STAGGER_INTERVAL=100;

export default{
	name:'poem-canvas',
	data(){
		return{
			camera:null,
			scene:null,
			renderer:null,
			width:this.$store.state.screenWidth,
			height:this.$store.state.screenHeight,
			dummy_text:[],
			poem_text:[],
			cameraZ:2000,
			stage:'floating'
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
			this.camera = new THREE.PerspectiveCamera(60, container.clientWidth/container.clientHeight, 0.01, this.cameraZ);
			this.camera.position.z = 0;

			this.scene = new THREE.Scene();

		
			
			this.renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
			this.renderer.setClearColor(0xffffff,0);
			this.renderer.sortObjects=false;

			this.renderer.setSize(container.clientWidth, container.clientHeight);
			container.appendChild(this.renderer.domElement);

			this.resetChar();
		},
		resize:function(){
			
			this.renderer.setSize(this.width,this.height);
			this.renderer.render(this.scene,this.camera);
		
		},
		animate:function(){

			// if(Math.random()*10<1) this.addChar('A');
			if(this.stage==='poem') 
				this.renderer.render(this.scene, this.camera);

			requestAnimationFrame(this.animate);
			
		},
		addWeather:function(arr,loc,date){
			var vFov = this.camera.fov * Math.PI / 180;
			let destZ=this.height/(2*Math.tan(vFov/2));
			

			let len=arr.length;
			let startx=-(this.height*0.625-POEM_PADDING)/(this.width/this.height)/2;
			let starty=LINE_HEIGHT*len;
			let t=0;
			let index=0;
			let line=0;

			
			for(var i in arr){
				let text=arr[i].text;
				for(var j in text){

					// if(index<this.poem_text.length){ // recycle char
					// 	this.poem_text[index].updateChar(text[j],
					// 									startx+j*FONT_SIZE,
					// 									starty-line*LINE_HEIGHT,
					// 									1-destZ,
					// 									WEATHER_COLOR,0,t);
					// 	// console.log('update char '+index);

					// }else{
					// 	this.addChar(text[j],
					// 				startx+j*FONT_SIZE,
					// 				starty-line*LINE_HEIGHT,
					// 				1-destZ,
					// 				WEATHER_COLOR,0,t);
					// }

					this.addChar(index,text[j],
								startx+j*FONT_SIZE,
								starty-line*LINE_HEIGHT,
								1-destZ,
								WEATHER_COLOR,0,t);

					t+=CHAR_STAGGER_INTERVAL;
					index++;
				}
				line+=2;
			}

			let poem_delay=index*CHAR_STAGGER_INTERVAL+MOVE_INTERVAL;
			line=0;
			starty-=LINE_HEIGHT;
			for(i in arr){
				let poem=arr[i].poem;
				for(var k in poem){

					// if(index<this.poem_text.length){ // recycle char
					// 	this.poem_text[index].updateChar(poem[k],
					// 									startx+k*FONT_SIZE,
					// 									starty-line*LINE_HEIGHT,
					// 									1-destZ,
					// 									POEM_COLOR,0,t+poem_delay);
					// 	// console.log('update char '+index);

					// }else{
					// 	this.addChar(poem[k],
					// 				startx+k*FONT_SIZE,
					// 				starty-line*LINE_HEIGHT,
					// 				1-destZ,
					// 				POEM_COLOR,0,t+poem_delay);
					// }
					this.addChar(index,poem[k],
							startx+k*FONT_SIZE,
							starty-line*LINE_HEIGHT,
							1-destZ,
							POEM_COLOR,0,t+poem_delay);

					t+=CHAR_STAGGER_INTERVAL;
					index++;
				}
				line+=2;
			}
			// loc;
			// date;
			let weather_delay=index*CHAR_STAGGER_INTERVAL+MOVE_INTERVAL;
			
			let locx=-startx;
			let locy=-starty;

			for(i in loc){
				this.addChar(index,loc[i],locx+i*FONT_SIZE,locy,1-destZ,POEM_COLOR,0,weather_delay+t);
				t+=CHAR_STAGGER_INTERVAL;
				index++;
			}

			for(i in date){
				this.addChar(index,date[i],locx+i*FONT_SIZE*.5,locy-LINE_HEIGHT,1-destZ,POEM_COLOR,0,weather_delay+t);
				t+=CHAR_STAGGER_INTERVAL;
				index++;
			}
			console.log(weather_delay);

		},
		addChar:function(index,text,destx,desty,destz,color='white',repeat=-1,delay){
			
			let arr=(repeat==-1)?this.dummy_text:this.poem_text;
			if(index<arr.length){ // recycle char
				arr[index].updateChar(text,
									destx,
									desty,
									destz,
									color,repeat,delay);
				// console.log('update char '+index);

			}else{
				this.insertChar(text,
							destx,
							desty,
							destz,
							color,repeat,delay);
			}
			
		},
		insertChar:function(char_,destx,desty,destz,color='white',repeat=-1,delay){
		
			var pchar=new PoemChar(char_,
							(destx!==undefined)?destx:Math.random()*this.width-this.width/2,
							(desty!==undefined)?desty:Math.random()*this.height-this.height/2,
							(destz!==undefined)?destz:0,
							color,
							repeat,
							delay);
			// text.position.x=Math.random()*this.width-this.width/2;
			// text.position.y=Math.random()*this.height-this.height/2;
			// text.position.z=-Math.random()*100;

			if(repeat==-1) this.dummy_text.push(pchar);
			else this.poem_text.push(pchar);

			
			this.scene.add(pchar.textObject);
		},
		clear:function(){
			
			for(var i in this.poem_text){
				// this.scene.remove(this.poem_text[i].textObject);
				this.poem_text[i].reset();
			}
			// this.poem_text=[];

			for(i in this.dummy_text){
				this.dummy_text[i].reset();
			}

			this.renderer.clear();
			// this.renderer.render(this.scene, this.camera);
		},
		resetChar:function(){
			for(var i in this.dummy_text){
				this.dummy_text[i].restart();
			}
		},
		setStage:function(set_){
			
			this.clear();
			if(set_==='poem'){
				this.resetChar();
			}
			this.stage=set_;
		}
	},
	created(){
		
	},
	mounted(){
		this.init();
		for(var i=0;i<NUM_CHAR;++i) this.insertChar('A');

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

