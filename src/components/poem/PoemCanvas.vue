<template>
	<div id="_poem_container"></div>	
</template>


<script type="text/javascript">
import * as THREE from 'three';
import PoemChar from './PoemChar.js';
import {FONT_SIZE,LINE_HEIGHT,MOVE_INTERVAL} from './PoemChar.js';
import {gsap,Sine} from 'gsap';
 
// const TRANSITON_INTERVAL=2500;
const NUM_CHAR=40;
const NUM_POEM_MAX=200;
const WEATHER_COLOR="#E8FFD3";
const POEM_COLOR="white";
// const POEM_PADDING=60;
const CHAR_STAGGER_INTERVAL=100;

const POEM_DELAY_INTERVAL=5000;

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
			stage:'floating',
			author:'漂浮繆斯',
			poem_group:new THREE.Group(),
			poem_timeline:null,
			dummy_timeline:null,
			dummy_material:[],
		}
	},
	computed:{
		textwidth:function(){
			// return Math.min(this.width,this.height*0.625);
			return this.$store.state.pageWidth;
		},
		destZ:function(){
			var vFov=this.camera.fov*Math.PI/180;
			return this.height/(2*Math.tan(vFov/2));
		},
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
			this.scene.add(this.poem_group);
		
			
			this.renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
			this.renderer.setClearColor(0xffffff,0);
			this.renderer.sortObjects=false;

			this.renderer.setSize(container.clientWidth, container.clientHeight);
			container.appendChild(this.renderer.domElement);

			this.poem_timeline=new gsap.timeline({
				defaults:{
					duration:1,
					ease:Sine.easeInOut,
				},
				autoRemoveChildren:true,
			});
			this.dummy_timeline=new gsap.timeline({
				defaults:{
					duration:1,
					ease:Sine.easeInOut,
				},
				// repeat:-1,
			});

			this.resetChar();
		},
		resize:function(){
			
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();

			this.renderer.setSize(this.width,this.height);
			if(this.state==='poem') this.renderer.render(this.scene,this.camera);
		
		},
		animate:function(){

			// if(Math.random()*10<1) this.addChar('A');
			if(this.stage==='poem') 
				this.renderer.render(this.scene, this.camera);

			requestAnimationFrame(this.animate);
			
		},
		addWeather:function(arr,loc,date){

			// TODO: end dummy text
			if(this.tween_fade) this.tween_fade.kill();
			let dummy=this.dummy_timeline;
			this.tween_fade=gsap.to(this.dummy_material,3,{
				opacity:0,
				onComplete:function(){
					dummy.pause();
				},
			});

			this.poem_timeline.clear();

			let len=0;
			for(i in arr){
				len+=arr[i].poem.length+1;
				if(arr[i].concat) len-=1;
			}
			console.log('#line= '+len);


			
			let startx=0;//-(this.textwidth/2);//(this.width/this.height)/2;
			let starty=0;//LINE_HEIGHT*(len+5)/2;
			// let t=0;
			let index=0;
			let lastx=0;
			let maxLineWidth=0;
				
			let destz=this.camera.position.z-this.destZ;
			let poem_delay=POEM_DELAY_INTERVAL;
			//poem_delay=0;

			for(var i in arr){
				let text=arr[i].text;
				[index,starty,lastx]=this.addLine(index,text,startx,starty,destz,WEATHER_COLOR,0,0)

				let poem=arr[i].poem;
				for(var k in poem){

					if(k==0 && arr[i].concat){
						// console.log('first line concat!');
						starty+=LINE_HEIGHT;
						[index,starty,lastx]=this.addLine(index,poem[k],
													lastx,
													starty,
													destz,
													POEM_COLOR,0,poem_delay);
						maxLineWidth=Math.max(maxLineWidth,lastx);
					}else{
						[index,starty,lastx]=this.addLine(index,poem[k],
													startx,
													starty,
													destz,
													POEM_COLOR,0,poem_delay);
						maxLineWidth=Math.max(maxLineWidth,lastx);
					}
				}
			}
			
			let weather_delay=POEM_DELAY_INTERVAL+MOVE_INTERVAL;
			//weather_delay=0;

			let locx=maxLineWidth;
			let locy=starty-LINE_HEIGHT;

			[index,locy,lastx]=this.addLine(index,this.author,locx-this.author.length*FONT_SIZE,locy,destz,POEM_COLOR,0,weather_delay);
			maxLineWidth=Math.max(maxLineWidth,lastx);
			
			locy-=LINE_HEIGHT;
			[index,locy,lastx]=this.addLine(index,loc,locx-loc.length*FONT_SIZE,locy,destz,POEM_COLOR,0,weather_delay);
			maxLineWidth=Math.max(maxLineWidth,lastx);

			//locy-=LINE_HEIGHT;
			[index,locy,lastx]=this.addLine(index,date,locx-date.length*FONT_SIZE*.5,locy,destz,POEM_COLOR,0,weather_delay);
			maxLineWidth=Math.max(maxLineWidth,lastx);

			let scale_=Math.min(this.textwidth/(maxLineWidth-startx),this.$store.state.pageHeight*.8/Math.abs(locy));
			// console.log('scale= '+scale_);
			scale_=Math.min(1,scale_);
			
			this.poem_group.scale.set(scale_,scale_,1);
			this.poem_group.position.x=-maxLineWidth/2*scale_;
			this.poem_group.position.y=-locy/2*scale_;

			this.poem_timeline.restart();

			return [poem_delay,weather_delay];
		},
		addLine:function(index,text,startx,starty,destz,color,repeat,delay){
			var t=0;
			var lastx=0;
			var lasty=starty;
			for(var k in text){
				
				// if(lastx+startx>=this.textwidth/2-POEM_PADDING){
				// 	lastx=0;
				// 	startx=-this.textwidth/2+POEM_PADDING;
				// 	lasty-=LINE_HEIGHT;
				// }

				lastx+=FONT_SIZE*(this.isASCII(text[k])?-.25:0);

				this.addChar(index,text[k],
							lastx+startx,
							lasty,
							destz,
							color,0,t+delay);

				lastx+=FONT_SIZE*(this.isASCII(text[k])?.75:1);
				
				t+=CHAR_STAGGER_INTERVAL;
				index++;
			}
			lasty-=LINE_HEIGHT;

			return [index,lasty,lastx+startx];
		},
		addChar:function(index,text,destx,desty,destz,color='white',repeat=-1,delay){
			
			let arr=(repeat==-1)?this.dummy_text:this.poem_text;
			let timeline=(repeat==-1)?this.dummy_timeline:this.poem_timeline;

			if(index<arr.length){ // recycle char
				arr[index].updateChar(text,
									destx,
									desty,
									destz,
									color,repeat,delay,timeline);
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
					
			let timeline=(repeat==-1)?this.dummy_timeline:this.poem_timeline;

			var pchar=new PoemChar(char_,
							(destx!==undefined)?destx:Math.random()*this.width-this.width/2,
							(desty!==undefined)?desty:Math.random()*this.height-this.height/2,
							(destz!==undefined)?destz:0,
							color,
							repeat,
							delay,
							timeline);
			// text.position.x=Math.random()*this.width-this.width/2;
			// text.position.y=Math.random()*this.height-this.height/2;
			// text.position.z=-Math.random()*100;

			if(repeat==-1){
				this.dummy_text.push(pchar);
				this.scene.add(pchar.textObject);
			}else{
				this.poem_text.push(pchar);
				this.poem_group.add(pchar.textObject);
			}
			
		},
		isASCII: function(str){
			// var t=/^\w+$/.test(str);
			// if(t) console.log(str);
			return str.charCodeAt(0)<128;
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

			this.dummy_timeline.pause();
			this.poem_timeline.pause();
			// this.renderer.render(this.scene, this.camera);
		},
		resetChar:function(){
			
			var tmp=Math.floor(Math.random()*1000);

			for(var i in this.dummy_text){
				// this.dummy_text[i].setRepeat(-1)
				var t=this.$store.getters.getDummyChar(i+tmp);
				// console.log(t);
				this.dummy_text[i].drawText(t);
				// this.dummy_text[i].restart();
			}
			if(this.tween_fade) this.tween_fade.kill();
			this.tween_fade=gsap.to(this.dummy_material,3,{
				opacity:1,
				startAt:{opacity:0},
			});
			this.dummy_timeline.resume();

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
		console.log('wave canvas mounted!');

		this.init();
		for(var i=0;i<NUM_CHAR;++i) this.insertChar(this.$store.getters.getDummyChar(i));
		for(i=0;i<NUM_POEM_MAX;++i) this.insertChar('A',0,0,0,WEATHER_COLOR,0,0);

		for(i in this.dummy_text){
			this.dummy_material.push(this.dummy_text[i].material);
		}
			
		this.dummy_timeline.play();

		this.animate();
	},
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

