import {TweenMax,Sine} from 'gsap';
import * as THREE from 'three';

export const MOVE_INTERVAL=2000;

export const FONT_SIZE=30;
export const LINE_HEIGHT=FONT_SIZE*1.5;
const TEXT_WIDTH=FONT_SIZE*1.2;

const START_Z=-2200;

export default class PoemChar{
	constructor(text,destx,desty,destz,color,repeat=-1,delay){

		this.color=color;
		this.createObject(text);
		this.tween;
		this.setDest(destx,desty,destz,repeat,delay);
		
		this.repeat=repeat;
		this.stage='floating';

	}
	createObject(text){
		// create canvas
		this.canvas=document.createElement('canvas');
		this.context=this.canvas.getContext('2d');
		this.context.fillStyle='transparant';
		// let metrics=context.measureText(text);
		// console.log(text+' = '+textWidth+' '+textHeight);

		this.canvas.width=TEXT_WIDTH;
		this.canvas.height=TEXT_WIDTH;
		this.context.textAlign="center";
		this.context.textBaseline="middle";
		this.context.font=FONT_SIZE+'px Noto Sans TC';
		
		this.drawText(text);

		this.texture=new THREE.CanvasTexture(this.canvas);
		this.texture.needsUpdate=true;
		this.material=new THREE.SpriteMaterial({map:this.texture,
												color:0xffffff,
												fog:true,
												depthWrite:false,});
		var sprite = new THREE.Sprite(this.material);

		this.textObject = new THREE.Object3D();
		// var sprite = new THREE.Sprite(texture);
		this.textObject.textHeight = TEXT_WIDTH;
		this.textObject.textWidth = TEXT_WIDTH;
		sprite.scale.set(FONT_SIZE, FONT_SIZE, 1);
		
		this.textObject.add(sprite);

	}
	drawText(text){
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
		
		this.context.fillStyle=this.color;
		this.context.fillText(text,TEXT_WIDTH/2,TEXT_WIDTH/2);

		if(this.texture) this.texture.needsUpdate=true;
		

	}
	updateChar(text,destx,desty,destz,color,repeat=-1,delay){
		this.color=color;
		this.drawText(text);
		
		this.setDest(destx,desty,destz,repeat,delay);
	}
	atDest(){
		return !this.tween.isActive();
	}
	setDest(destx,desty,destz,repeat,delay){

		let interval=MOVE_INTERVAL*(Math.random()*1.0+1.0);
		if(delay===undefined) interval*Math.random()*.5;	
	
		var p=Math.random();
		this.textObject.position.x=destx*p;
		this.textObject.position.y=desty*p;
		this.textObject.position.z=START_Z;
		
		if(this.tween) this.tween.kill();
		this.tween=TweenMax.to(this.textObject.position,interval/1000.0,{
			x:destx,
			y:desty,
			z:destz,
			overwrite:'all',
			ease:Sine.easeInOut,
			delay:delay/1000,
			repeat:repeat,
		});
		// this.tween.stop();
		
	}
	reset(){
		if(this.tween) this.tween.pause();
		this.textObject.position.z=START_Z;
	}
	restart(){
		this.tween.restart();
		this.fadeIn();
	}
	setRepeat(set_){
		this.tween.repeat(set_);
	}
	fadeOut(){
		TweenMax.to(this.material,3,{
			opacity:0,
		});
	}
	fadeIn(){
		TweenMax.to(this.material,3,{
			opacity:1,
			delay:1,
		});
	}
}