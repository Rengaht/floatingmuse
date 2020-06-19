<template>
	<div>
		<span>{{poem.text}}</span>
		<span>{{poem.poem}}</span>
	</div>
</template>

<script>
export default {
  name: 'poem-item',
  props: ['poem']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

span{
	white-space: pre;
}
span:first-child{
	color:red;
}
span:last-child{
	color:black;
}

</style>
