<template>
	<div>
		<div>Floating Muse</div>
		<!-- <div>{{date_str}}</div> -->
		<button @click="startClick">START</button>
	</div>
</template>

<script>
export default {
	data(){
		return{
		date_str:new Date().toLocaleString()
		}
    },
    methods:{
		startClick:function(){
			this.$router.push('map');
		}
    }
}
</script>