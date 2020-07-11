<template>
	<div v-bind:style="style">
		<span>{{ocean.name}}</span>
	</div>
</template>

<script>
export default {
  name: 'ocean-item',
  props: ['ocean'],
  computed:{
	style(){
		// console.log(this.ocean);
		// var w=window.innerWidth;
		// var h=window.innerHeight;
		var pos=this.$store.getters.getOceanPosition(this.ocean.index);
		// console.log(pos);
		return{
			left:pos.x+'px',
			top:pos.y+'px'			
		};
	}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../../assets/style/global_var.scss";
	div{
		font-size: $button_size;
		color:white;
		position: absolute;
		cursor:pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		span{
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
</style>
