import {TweenMax,Sine} from 'gsap';

const RADIUS_PORTION=0.5;
// const SPOT_VEL=5;
// const DEST_TOLERANCE=20;
const MOVE_INTERVAL=5000;
const DRIFT_VEL=0.5;
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

		this.vx;
		this.vy;    
		this.destx;
		this.desty;

		this.tween;
		this.setDest();

		this.stage='floating'; // floating, island, poem
		this.is_tw=false;
	}
	float(left,top,right,bottom){

		if(this.x-this.r<left){

			this.x=this.r+1;
			this.vx=Math.abs(this.vx);

		}else if(this.x+this.r>right){

			this.x=right-this.r;
			this.vx=-Math.abs(this.vx);
		}

		if(this.y-this.r<top){

			this.y=this.r+1;
			this.vy=Math.abs(this.vy);

		}else if(this.y+this.r>bottom){
			this.y=bottom-this.r;
			this.vy=-Math.abs(this.vy);
		}
	}
	float2(left,top,right,bottom){

		if(this.x<left){    
			this.dvx=(Math.random()*DRIFT_VEL);
		}else if(this.x>right){
			this.dvx=-(Math.random()*DRIFT_VEL);
		}

		if(this.y<top){
			this.dvy=(Math.random()*DRIFT_VEL);
		}else if(this.y>bottom){
			this.dvy=-(Math.random()*DRIFT_VEL);
		}	
	}
	atDest(){
	
		// // console.log(this.cx+' '+this.cy);
		// var dx=this.cx-this.destx;
		// var dy=this.cy-this.desty;
		// var d=dx*dx+dy*dy;


		// if(d<DEST_TOLERANCE) return true;
		// else return false;
		// console.log('check dest');
		return !this.tween.isActive();
	}
	move(){
		this.cx += this.vx;
		this.cy += this.vy;
		
		if(this.cx<-this.r*2 || this.cx>this.width+this.r*2
			||this.cy<-this.r*2 || this.cy>this.height+this.r*2){

			var dx=this.destx-this.cx;
			var dy=this.desty-this.cy;
			
			this.vx=dx/this.interval;//Math.min(Math.abs(dx/this.interval),MAX_VEL)*(dx/Math.abs(dx));
			this.vy=dy/this.interval;//Math.min(Math.abs(dy/this.interval),MAX_VEL)*(dy/Math.abs(dy));
			
		}
				
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
	
		// switch(this.stage){
		// 	case 'floating':
		// 		this.x += this.vx;
		// 		this.y += this.vy;			
		// 		this.float(0,0,WIDTH,HEIGHT);						
		// 		break;
		// 	case 'island':
		// 		if(!this.atDest()){
		// 			this.x += this.vx;
		// 			this.y += this.vy;
		// 		}else{
		// 			console.log('at dest!');
		// 			this.x += this.dvx;
		// 			this.y += this.dvy;
		// 			// this.float2(this.x-DEST_TOLERANCE,this.y-DEST_TOLERANCE,this.x+DEST_TOLERANCE,this.y+DEST_TOLERANCE);
		// 		}
		// 		break;
		// }
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