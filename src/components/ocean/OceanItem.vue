<template>
	<div v-bind:style="style" class="OceanItem">
		<span>{{ocean.name}}</span>
	</div>
</template>

<script>
// import gsap from 'gsap';

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
  },
  methods:{
	
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../../assets/style/global_var.scss";
	.OceanItem{
		font-size: $button_size;
		color:white;
		position: absolute;
		cursor:pointer;
		display: flex;
		justify-content: center;
		align-items: center;

		opacity: 1;

		span{
			// top: 50%;
			// left: 50%;
			transform: translate(-50%, -50%);
		}
	}
	// .ocean_item-enter-active,.ocean_item-leave-active{
	// 	transition:all $item_transition_time ease;
	// }
	// .ocean_item-enter,.ocean_item-leave-to{
	// 	opacity: 0;
	// }
	// .ocean_item-enter-to,.ocean_item.leave{
	// 	opacity: 1;
	// }


</style>
