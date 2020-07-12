import {TweenMax,Sine} from 'gsap';
import * as THREE from 'three';

const MOVE_INTERVAL=5000;
const FONT_SIZE=100;

export default class PoemChar{
	constructor(text,x,y){

		this.text=text;

		// create canvas
		this.canvas=document.createElement('canvas');
		let context=this.canvas.getContext('2d');
		context.fillStyle='transparant';
		// let metrics=context.measureText(text);
		let textWidth=100;
		let textHeight=100;
		// console.log(text+' = '+textWidth+' '+textHeight);

		this.canvas.width=textWidth;
		this.canvas.height=textHeight;
		context.textAlign="center";
		context.textBaseline="middle";
		context.font=FONT_SIZE+'px Arial';
		context.fillStyle="#ffffff";
		context.fillText(text,textWidth/2,textHeight/2);

		var texture=new THREE.CanvasTexture(this.canvas);
		// texture.needsUpdate=true;
		var material=new THREE.SpriteMaterial({
												map:texture,
												color:0xffffff,
												fog:true,
												depthWrite:false,});
		var sprite = new THREE.Sprite( material );

		this.textObject = new THREE.Object3D();
		// var sprite = new THREE.Sprite(texture);
		this.textObject.textHeight = FONT_SIZE;
		this.textObject.textWidth = (textWidth / textHeight) * this.textObject.textHeight;
		sprite.scale.set(textWidth / textHeight * FONT_SIZE, FONT_SIZE, 1);
		//  sprite.position.set(10,10,0);
		this.textObject.add(sprite);

		// document.getElementsByTagName("body")[0].appendChild(this.canvas);

		this.x=0;
		this.y=0;
		this.z=-1000;

		this.tween;
		this.setDest(x,y,0);

		this.stage='floating'; // floating, island, poem
		this.is_tw=false;
	}
	atDest(){
		return !this.tween.isActive();
	}
	step(){
	
		if(this.atDest()){
			if(this.stage==="floating"){
				// console.log('float');
				// if(Math.random()*200<1){
					this.setDest();
				// }
			}			
		}
	}
	setDest(destx,desty,destz,interval){

		let delay=0;
		if(interval===undefined){
			interval=MOVE_INTERVAL*(Math.random()*1.0+1.0);
			delay=interval*Math.random()*.5/1000.0;	
		} 
		
		if(destx===undefined) destx=Math.random()*1000-500;
		if(desty===undefined) desty=Math.random()*1000-500;
		if(destz===undefined) destz=1000;

		
		if(this.tween) this.tween.kill();
		this.tween=TweenMax.to(this,interval/1000,{
			x:destx,
			y:desty,
			z:destz,
			overwrite:'all',
			ease:Sine.easeInOut,
			delay:delay,
		});	
		
	}
}