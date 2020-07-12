import {TweenMax,Sine} from 'gsap';

const RADIUS_PORTION=0.5;
// const SPOT_VEL=5;
// const DEST_TOLERANCE=20;
const MOVE_INTERVAL=5000;
// const MAX_VEL=28.0;
const MAX_RAD=300;
const MIN_RAD=10;

export default class OceanSpot{
	constructor(WIDTH,HEIGHT){

		this.width=WIDTH;
		this.height=HEIGHT;
		var radius=this.randomRadius(RADIUS_PORTION);
		
		
		this.x=Math.random() * (WIDTH +radius) - radius;
		this.y=Math.random() * (HEIGHT +radius) - radius;
		this.r=radius;


		this.tween;
		this.setDest();

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
	setDest(destx,desty,interval,rad_portion){

		let delay=0;
		if(interval===undefined){
			interval=MOVE_INTERVAL*(Math.random()*1.0+1.0);
			delay=interval*Math.random()*.5/1000.0;	
		} 
		if(rad_portion===undefined) rad_portion=RADIUS_PORTION;

		var rad=this.randomRadius(rad_portion);

		if(destx===undefined) destx=Math.random()*(this.width +this.r) - this.r;
		if(desty===undefined) desty=Math.random()*(this.height +this.r) - this.r;
		// console.log('set dest= '+destx+" , "+desty);

		destx=Math.min(Math.max(destx,0),this.width);
		desty=Math.min(Math.max(desty,0),this.height);
		
		if(this.tween) this.tween.kill();
		this.tween=TweenMax.to(this,interval/1000,{
			x:destx,
			y:desty,
			r:rad,
			overwrite:'all',
			ease:Sine.easeInOut,
			delay:delay,
			// onComplete:function(){
			// 	console.log('complete!');
			// }
		});	
		
	}
	randomRadius(portion){
		var r=(Math.random()*.5+.5)*Math.min(this.width,this.height)*portion;
		return Math.min(Math.max(r,MIN_RAD),MAX_RAD);
	}
}