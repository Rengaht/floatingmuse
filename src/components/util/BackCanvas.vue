<template>
	<div id="_canvas_container"></div>	
</template>


<script type="text/javascript">
import * as THREE from 'three'
export default{
	name:'back-canvas',
	data(){
		return{
			camera:null,
			scene:null,
			renderer:null,
			width:this.$store.state.screenWidth,
			height:this.$store.state.screenHeight,
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
	methods:{
		init:function(){
			var container = document.getElementById('_canvas_container');
			
			this.renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
			this.renderer.setClearColor(0xffffff,0);
			this.renderer.sortObjects=false;

			this.renderer.setSize(container.clientWidth, container.clientHeight);
			container.appendChild(this.renderer.domElement);
		},
		render:function(scene,camera){
			this.renderer.render(scene, camera);
		},
		resize:function(){

			console.log('canvas resize!');

			this.renderer.setSize(this.width,this.height);
			this.renderer.render(this.scene,this.camera);
			
		},
	},
	mounted(){
		this.init();
		// this.animate();
	}

}
</script>
<style lang="scss" scoped>
#_canvas_container{

	width:100%;
	height:100%;
}
</style>

