const RADIUS_PORTION=0.2;
// const SPOT_VEL=5;
const DEST_TOLERANCE=25;
const MOVE_INTERVAL=200;
const DRIFT_VEL=0.2;

function OceanSpot(WIDTH,HEIGHT){

	var radius = Math.random() * Math.min(WIDTH,HEIGHT)*RADIUS_PORTION+ 10;
	
	this.width=WIDTH;
	this.height=HEIGHT;

	this.x=Math.random() * (WIDTH - 2 * radius) + radius;
    this.y=Math.random() * (HEIGHT - 2 * radius) + radius;
    this.r=radius;
    
    this.vx;
    this.vy;    
    this.destx;
    this.desty;
    this.setDest();
    this.dvx=(Math.random()*2-1)*DRIFT_VEL;
    this.dvy=(Math.random()*2-1)*DRIFT_VEL;

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
    this.x += this.dvx;
	this.y += this.dvy;
				
}
OceanSpot.prototype.atDest=function(){
	var dx=this.x-this.destx;
	var dy=this.y-this.desty;
	var d=dx*dx+dy*dy;

	if(d<DEST_TOLERANCE) return true;
	else return false;
}

OceanSpot.prototype.step=function(WIDTH,HEIGHT){
	
	
	switch(this.stage){
		case 'floating':
			this.x += this.vx;
			this.y += this.vy;			
			this.float(0,0,WIDTH,HEIGHT);						
			break;
		case 'island':
			if(!this.atDest()){
				this.x += this.vx;
				this.y += this.vy;
			}else{
				console.log('at dest!');
				// this.float2(this.x-DEST_TOLERANCE,this.y-DEST_TOLERANCE,this.x+DEST_TOLERANCE,this.y+DEST_TOLERANCE);
			}
			break;
	}
}
OceanSpot.prototype.setDest=function(destx,desty){

	if(destx===undefined) destx=Math.random() * (this.width - 2 * this.r) + this.r;
	if(desty===undefined) desty=Math.random() * (this.height - 2 * this.r) + this.r;
	// console.log('set dest= '+destx+" , "+desty);

	this.destx=destx;
	this.desty=desty;

	var dvx=destx-this.x;
	var dvy=desty-this.y;
	var t=Math.random()*MOVE_INTERVAL+MOVE_INTERVAL*.5;
	this.vx=dvx/t;
	this.vy=dvy/t;
}


export default OceanSpot;