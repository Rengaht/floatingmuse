import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';

const PoemURL="https://muse.mmlab.com.tw/sea";

Vue.use(Vuex);
Vue.use(VueAxios,axios);



const store=new Vuex.Store({
	state:{
		location:'',
		weather_text:[],
		poem:[],
		generating:false
	},
	mutations:{
		setWeatherText(state,data){
			state.weather_text=data;
		},
		setLocation(state,data){
			state.location=data.loc;
		},
		setPoem(state,data){
			state.poem=data;
		}
		
	},
	actions:{
		generatePoem:function({commit}){
			
			Vue.axios.post(PoemURL,this.state.weather_text)
			.then(res=>{

				console.log('res=> ',res);
				// var sentence=res.data.split('\n');
				//this.poem=res.data;		
				//this.generating=false;

				commit('setPoem',res.data);
			}).catch(error=>{
					console.log(error);
			});

		}
	},
	getters:{
		getWeatherText:function(state){
			return state.weather_text;
		},
		getPoem:function(state){
			return state.poem;
		}
	}

});

export default store;