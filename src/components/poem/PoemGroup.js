import * as THREE from 'three';
import PoemChar from './PoemChar.js';
import {FONT_SIZE,LINE_HEIGHT,MOVE_INTERVAL} from './PoemChar.js';

 
// const TRANSITON_INTERVAL=2500;
const NUM_CHAR=50;
const NUM_POEM_MAX=120;
const WEATHER_COLOR="#E8FFD3";
const POEM_COLOR="white";
const POEM_PADDING=60;
const CHAR_STAGGER_INTERVAL=100;

const POEM_DELAY_INTERVAL=5000;

export default class PoemGroup{
	constructor(parent,width,height,fov,cameraZ){
		this.width=width;
		this.height=height;
		

		var vFov=fov*Math.PI/180;
		this.fov=1.0/(2*Math.tan(vFov/2));
		this.cameraZ=cameraZ;

		this.dummy_text=[];
		this.poem_text=[];
		this.cameraZ=100;
		this.stage='floating';
		this.author='漂浮繆斯';

		this.parent=parent;
		this.group=new THREE.Group();

		this.init();
	}
	getTextwidth(){
		return Math.min(this.width,this.height*0.625);
	}
	getDestZ(){
		return this.height*this.fov;
	}
	init(){
		for(var i=0;i<NUM_CHAR;++i) this.insertChar(this.parent.$store.getters.getDummyChar(i));
		for(i=0;i<NUM_POEM_MAX*2;++i) this.insertChar('A',0,0,0,WEATHER_COLOR,0,0);
	}
	resize(width,height){	
		this.width=width;
		this.height=height;
	}
	animate(){
		requestAnimationFrame(this.animate);			
	}
	addWeather(arr,loc,date){

		// TODO: end dummy text
		for(i in this.dummy_text){
			this.dummy_text[i].fadeOut();
		}

		

		let len=0;
		for(i in arr){
			len+=arr[i].poem.length+1;
			if(arr[i].concat) len-=1;
		}
		console.log('#line= '+len);
		let startx=-(this.getTextwidth()/2-POEM_PADDING);//(this.width/this.height)/2;
		let starty=LINE_HEIGHT*(len+5)/2;
		// let t=0;
		let index=0;
		let lastx=0;
			
		let destz=this.cameraZ-this.getDestZ();
		let poem_delay=POEM_DELAY_INTERVAL;
		
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
				}else{
					[index,starty,lastx]=this.addLine(index,poem[k],
												startx,
												starty,
												destz,
												POEM_COLOR,0,poem_delay);
				}
			}
		}
		
		let weather_delay=POEM_DELAY_INTERVAL+MOVE_INTERVAL;
		
		let locx=this.getTextwidth()/2-POEM_PADDING;
		let locy=starty-LINE_HEIGHT;

		[index,locy,lastx]=this.addLine(index,this.author,locx-this.author.length*FONT_SIZE,locy,destz,POEM_COLOR,0,weather_delay);
		
		locy-=LINE_HEIGHT;
		[index,locy,lastx]=this.addLine(index,loc,locx-loc.length*FONT_SIZE,locy,destz,POEM_COLOR,0,weather_delay);

		//locy-=LINE_HEIGHT;
		[index,locy,lastx]=this.addLine(index,date,locx-date.length*FONT_SIZE*.5,locy,destz,POEM_COLOR,0,weather_delay);

		return [poem_delay,weather_delay];
	}
	addLine(index,text,startx,starty,destz,color,repeat,delay){
		var t=0;
		var lastx=0;
		var lasty=starty;
		for(var k in text){
			
			if(lastx+startx>=this.getTextwidth()/2-POEM_PADDING){
				lastx=0;
				startx=-this.getTextwidth()/2+POEM_PADDING;
				lasty-=LINE_HEIGHT;
			}

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
	}
	addChar(index,text,destx,desty,destz,color='white',repeat=-1,delay){
		
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
		
	}
	insertChar(char_,destx,desty,destz,color='white',repeat=-1,delay){
		
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

		
		this.group.add(pchar.textObject);
	}
	isASCII(str){
		return str.charCodeAt(0)<128;
	}
	clear(){
		
		for(var i in this.poem_text){
			// this.scene.remove(this.poem_text[i].textObject);
			this.poem_text[i].reset();
		}
		// this.poem_text=[];

		for(i in this.dummy_text){
			this.dummy_text[i].reset();
		}

		// this.renderer.clear();
		// this.renderer.render(this.scene, this.camera);
	}
	resetChar(){
		
		var tmp=Math.floor(Math.random()*1000);

		for(var i in this.dummy_text){
			// this.dummy_text[i].setRepeat(-1)
			var t=this.parent.$store.getters.getDummyChar(i+tmp);
			// console.log(t);
			this.dummy_text[i].drawText(t);
			this.dummy_text[i].restart();
		}
	}
	setStage(set_){
		
		this.clear();
		if(set_==='poem'){
			this.resetChar();
		}
		this.stage=set_;
	}
}

