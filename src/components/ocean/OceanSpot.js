const RADIUS_PORTION=0.5;
// const SPOT_VEL=5;
const DEST_TOLERANCE=20;
const MOVE_INTERVAL=1000;
const DRIFT_VEL=0.5;
// const MAX_VEL=28.0;
const MAX_RAD=300;
const MIN_RAD=10;

function OceanSpot(WIDTH,HEIGHT){

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
   
    this.dvx;
    this.dvy;
    this.cx=this.x;
    this.cy=this.y;

     this.setDest();

    this.stage='floating'; // floating, island, poem
}
OceanSpot.prototype.float=function(left,top,right,bottom){

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
OceanSpot.prototype.float2=function(left,top,right,bottom){

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
OceanSpot.prototype.atDest=function(){
	
	// console.log(this.cx+' '+this.cy);
	var dx=this.cx-this.destx;
	var dy=this.cy-this.desty;
	var d=dx*dx+dy*dy;


	if(d<DEST_TOLERANCE) return true;
	else return false;
}
OceanSpot.prototype.move=function(){
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

OceanSpot.prototype.step=function(){
	
	if(!this.atDest()){
		this.move();	
		if(Math.abs(this.destr-this.r)>1) this.r+=this.vr;

		this.x=this.cx;
		this.y=this.cy;

	}else{
		this.x+=this.dvx;
		this.y+=this.dvy;

		if(this.x<this.cx-DEST_TOLERANCE) this.dvx=DRIFT_VEL;
		else if(this.x>this.cx+DEST_TOLERANCE) this.dvx=-DRIFT_VEL;

		if(this.y<this.cy-DEST_TOLERANCE) this.dvy=DRIFT_VEL;
		else if(this.y>this.cy+DEST_TOLERANCE) this.dvy=-DRIFT_VEL;
		
		if(this.stage==="floating"){
			if(Math.random()*2<1){
				this.setDest();
			}
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
OceanSpot.prototype.setDest=function(destx,desty,interval,rad_portion){

	if(interval===undefined) interval=MOVE_INTERVAL;
	if(rad_portion===undefined) rad_portion=RADIUS_PORTION;

	var rad=this.randomRadius(rad_portion);
	// var dist=rad*(Math.random()*10+5);

	// if(Math.random()*2<1) dist*=-1;
	// if(destx===undefined) destx=this.cx+dist;

	// if(Math.random()*2<1) dist*=-1;
	// if(desty===undefined) desty=this.cy+dist;
	if(destx===undefined) destx=Math.random()*(this.width +this.r) - this.r;
    if(desty===undefined) desty=Math.random()*(this.height +this.r) - this.r;
	// console.log('set dest= '+destx+" , "+desty);

	// this.destx=Math.min(Math.max(destx,rad),this.width-rad);
	// this.desty=Math.min(Math.max(desty,rad),this.height-rad);
	this.destx=Math.min(Math.max(destx,0),this.width);
	this.desty=Math.min(Math.max(desty,0),this.height);
	this.destr=rad;

	this.x=this.cx;
	this.y=this.cy;
	
	var dx=this.destx-this.cx;
	var dy=this.desty-this.cy;
	var t=Math.random()*interval*.5+interval*.5;

	this.interval=t;
	this.vx=dx/this.interval;//Math.min(Math.abs(dx/this.interval),MAX_VEL)*(dx/Math.abs(dx));
	this.vy=dy/this.interval;//Math.min(Math.abs(dy/this.interval),MAX_VEL)*(dy/Math.abs(dy));
		
	this.vr=(rad-this.r)/t;
	
	this.dvx=DRIFT_VEL*(Math.random()*2-1);
	this.dvy=DRIFT_VEL*(Math.random()*2-1);

	
	
}
OceanSpot.prototype.randomRadius=function(portion){
	var r=(Math.random()*.5+.5)*Math.min(this.width,this.height)*portion;
	return Math.min(Math.max(r,MIN_RAD),MAX_RAD);
}


export default OceanSpot;