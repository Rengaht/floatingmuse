<template>
	<div>
		<div>{{location}}</div>
		<div style="white-space:pre">{{poem}}</div>
		<button @click="rewriteClick" v-if="!generating">REWRITE</button>
		<button @click="homeClick" v-if="!generating">HOME</button>
	</div>
</template>

<script>

import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios,axios);

const PoemURL="https://muse.mmlab.com.tw/sea";

export default{
	// props:['text'],
	data(){
		return{
			generating:false
			// poem:'waiting...'
		}
	},
	computed:{
		location:function(){
			return this.$store.state.location;
		},
		poem:function(){
			return this.$store.state.poem;			
		}
	},
	methods:{
		generatePoem:function(){
			this.generating=true;
			Vue.axios.post(PoemURL,this.text).then(res=>{
				console.log('res=> ',res);
				// var sentence=res.data.split('\n');
				this.poem=res.data;		
				this.generating=false;
			});
		},
		rewriteClick:function(){
			// this.poem=this.text.join('\n');		
			// this.generatePoem();
		},
		homeClick:function(){
			this.$router.push({name:'home'});
		}		
	},
	created:function(){
		if(this.poem===undefined || this.poem.length<1){
			this.$router.push({name:'home'});
			return;
		}
		// this.poem=this.text.join('\n');
		//this.generatePoem();
	}
}

</script>