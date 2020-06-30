<template>
	<div>
		<div id="_poem" class="CenterWrapper">		
			<div class="PoemRegion">
				<poem-item 
					v-for="item in poem"
					v-bind:poem="item"
					v-bind:key="item.text"				
				></poem-item>
			</div>			
		</div>
		<div class="TitleRegion">
			<div class="title">{{location}}</div>
			<div class="title">{{date_str}}</div>
		</div>	
		<div class="ButtonRegion">
				<div class="Button" @click="rewriteClick" v-if="!generating">再寫一首</div>
				<div class="Button" @click="homeClick" v-if="!generating">回首頁</div>
		</div>
	</div>
</template>

<script>
import PoemItem from '../PoemItem.vue';
import gsap from 'gsap';

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
		gsap.from('.PoemItem',{
			opacity:0,
			stagger:0.1
		});
	}
}

</script>

<style lang="scss">
@import "../../assets/style/global_var.scss";

#_poem{
	margin-top:$margin-size;
	.PoemRegion{
		
	}	
}
.TitleRegion{
	position: absolute;
	right:$margin-size;
	bottom:$margin-size*2;
	text-align: right;

	color:$poem-color;
	font-size:$poem-title-size;		
}	
.ButtonRegion{
	position: absolute;
	bottom:$margin-size;
	left:$margin-size;
	right:$margin-size;

	.Button{
		display:inline-block;
		color:$button-color;
		font-size:$hint-size;

		margin-left:$margin-size;
		margin-right:$margin-size;
	}
}



</style>