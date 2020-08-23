<template>
	<div class="CenterWrapper" id='_floor'>
		<div class="CenterWrapper">
		</div>
	</div>
</template>

<script>
export default {
	name:'PageFloor',
	mounted:function(){
		console.log('floor mounted!');
		this.$parent.setStage('floating');			
	},
	activated:function(){
		console.log('floor activated!');
		this.$parent.setStage('floating');			
	}
}
</script>

<style lang="scss">

</style>