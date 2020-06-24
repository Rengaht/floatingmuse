<template>
	<div class="PoemItem">
		<span class="weather_text">{{poem.text}}</span>
		<span class="poem_text">{{poem.poem}}</span>
	</div>
</template>

<script>
export default {
  name: 'poem-item',
  props: ['poem']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../assets/style/global_var.scss";

div{
	white-space: pre;
	
	.weather_text{
		color:$weather-color;
	}
	.poem_text{
		color:$poem-color;
	}
}


</style>
