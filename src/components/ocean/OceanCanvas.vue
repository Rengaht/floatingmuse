<template>
	<canvas id="_ocean_canvas" ref="_ocean_canvas" 
			v-bind:width="width" 
			v-bind:height="height"></canvas>	
</template>


<script type="text/javascript">
import OceanSpot from './OceanSpot.js';
import OceanShader from './OceanShader';

export default{
	name:'ocean-canvas',
	data(){
		return{
			gl:null,
			opts:{			
				orbCount: 20,
				baseRadius: 40,
				addedRadius: 50,
				baseVel: 1,
				addedVel: 1,
				
				alphaThreshold: 200
			},
			spots:[],
			shader:null,
			width:this.$store.state.screenWidth,
			height:this.$store.state.screenHeight
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
	// computed:{
	// 	width(){return this.$store.state.screenWidth;},
	// 	height(){return this.$store.state.screenHeight;}
	// // 	// shader(){
	// // 	// 	return new OceanShader(this.gl,this.width,this.height,this.opts.orbCount);
	// // 	// }
	// },
	mounted:function(){
		// this.tmp_gl=document.createElement('canvas').getContext('2d');
		// this.tmp_gl.width=this.width;
		// this.tmp_gl.height=this.height;
		this.width=this.$store.state.screenWidth;
		this.height=this.$store.state.screenHeight;

		var canvas=this.$refs['_ocean_canvas'];
		// canvas.width=this.width;
		// canvas.height=this.height;
		// this.width=canvas.clientWidth;
		// this.height=canvas.clientHeight;

		this.gl=canvas.getContext('webgl');
		this.init();
	},
	methods:{
		init:function(){
			
			console.log('canvas init w= '+this.width+" h= "+this.height);

			for(var i=0;i<this.opts.orbCount;++i)
				this.spots.push(new OceanSpot(this.width,this.height));
				// this.spots.push(new OceanSpot(this.tmp_gl,this.width,this.height,this.opts));			
			this.shader=new OceanShader(this.gl,this.opts.orbCount);
			this.shader.init(this.gl);

			this.draw();			
		},		
		draw:function(){
			
			// console.log('draw!');

			// this.tmp_gl.clearRect(0,0,this.width,this.height);
			// this.gl.fillStyle='white';
			// this.gl.fillRect(0,0,this.width,this.height);

			var i=0;
			for(i=0;i<this.opts.orbCount;++i)
				this.spots[i].step(this.width,this.height);

			var dataToSendToGPU = new Float32Array(3 * this.opts.orbCount);
			for (i = 0; i < this.opts.orbCount; i++) {
				var baseIndex = 3 * i;
				var mb = this.spots[i];
				dataToSendToGPU[baseIndex + 0] = mb.x;
				dataToSendToGPU[baseIndex + 1] = mb.y;
				dataToSendToGPU[baseIndex + 2] = mb.r;
			}
			this.shader.step(this.gl,dataToSendToGPU);
			// var image=this.tmp_gl.getImageData(0, 0, this.width, this.height),
			// data=new Uint8Array(image.data.buffer);
			
			// for(i=3;i<data.length;i+= 4)
			// 	data[i]/=data[i]<this.opts.alphaThreshold?6:1;

			// this.gl.putImageData( image, 0, 0 );

			requestAnimationFrame(this.draw);
		},
		goIsland:function(){
			var i;
			for(i=0;i<this.opts.orbCount;++i){
				this.spots[i].stage='island';
				// console.log(i);
				if(i<this.$store.state.island.length){
					let pos=this.$store.getters.getIslandPositionCanvas(i);
					// console.log(pos);
					this.spots[i].setDest(pos.x,this.height-pos.y,200,.2);
				}else{
					var ang=Math.random()*Math.PI*2;
					var rad=(Math.random()*.4+.4);
					this.spots[i].setDest(this.width*(.5+rad*Math.sin(ang)),
										this.height*(.5+rad*Math.cos(ang)),200);	
				}
			}
		},
		goFloat:function(){
			var i;
			for(i=0;i<this.opts.orbCount;++i){
				this.spots[i].stage='floating';
				this.spots[i].setDest(undefined,undefined,200);
			}
		},
		goPoem:function(index){
			
			console.log('go poem!');

			for(var i=0;i<this.opts.orbCount;++i){
				this.spots[i].stage='island';
				if(i==index || Math.random()*3<1){
					var dest_rad=Math.min(this.width,this.height)*.5*(Math.random()*.5+.5);
					this.spots[i].setDest(this.width/2+(Math.random()*2-1)*dest_rad,this.height/2+(Math.random()*2-1)*dest_rad,200,.8);	
				}else{
					var ang=Math.random()*Math.PI*2;
					var rad=(Math.random()*.4+.5);
					this.spots[i].setDest(this.width*(.5+rad*Math.sin(ang)),
										this.height*(.5+rad*Math.cos(ang)),200);	
				} 
			}	
		},
		resize:function(){
			this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
			this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
			for(var i=0;i<this.opts.orbCount;++i){
				this.spots[i].width=this.width;
				this.spots[i].height=this.height;
			}
		}
	}
}


</script>

<style lang="scss">	
</style>