<template>
	<div>
		<div>{{location}}</div>
		<div>{{date_str}}</div>
		<div>
			<poem-item 
				v-for="item in poem"
				v-bind:poem="item"
				v-bind:key="item.text"				
			></poem-item>
		</div>

		<button @click="rewriteClick" v-if="!generating">REWRITE</button>
		<button @click="homeClick" v-if="!generating">HOME</button>
	</div>
</template>

<script>
import PoemItem from '../PoemItem.vue';

export default{		
	data:function(){
		return{
			date_str:new Date().toLocaleString()
		}
	},
	components:{
		PoemItem
	},
	computed:{
		location:function(){
			return this.$store.state.location;
		},
		poem:function(){
			return this.$store.state.poem;			

		},
		generating:function(){
			return this.$store.state.generating;
		}
	},
	methods:{
		rewriteClick:function(){			
			this.date_str=new Date().toLocaleString();
			this.$store.dispatch('generatePoem');			
		},
		homeClick:function(){
			this.$router.push({name:'home'});
		}		
	},
	created:function(){


		if(!this.$store.state.generating){
			this.$router.push({name:'home'});
			return;
		}
		// this.poem=this.text.join('\n');
		//this.generatePoem();
	},
	updated(){
		console.log('poem view updated!');
	}
}

</script>