const RADIUS_PORTION=0.3;
const SPOT_VEL=5;

function OceanSpot(WIDTH,HEIGHT){

	var radius = Math.random() * Math.min(WIDTH,HEIGHT)*RADIUS_PORTION+ 10;
	
	this.x=Math.random() * (WIDTH - 2 * radius) + radius;
    this.y=Math.random() * (HEIGHT - 2 * radius) + radius;
    this.vx=Math.random() * SPOT_VEL - SPOT_VEL/2;
    this.vy=Math.random() * SPOT_VEL - SPOT_VEL/2;
    this.r=radius;

}
OceanSpot.prototype.step=function(WIDTH,HEIGHT){
	this.x += this.vx;
    if (this.x - this.r < 0) {
      
      this.x = this.r + 1;
      this.vx = Math.abs(this.vx);

    }else if (this.x + this.r > WIDTH){
    
      this.x = WIDTH - this.r;
      this.vx = -Math.abs(this.vx);
    }

    this.y += this.vy;

    if(this.y - this.r < 0){
      
      this.y = this.r + 1;
      this.vy = Math.abs(this.vy);

    }else if(this.y + this.r > HEIGHT){
      this.y = HEIGHT - this.r;
      this.vy = -Math.abs(this.vy);
    }
}



export default OceanSpot;