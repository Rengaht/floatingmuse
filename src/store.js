import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';

const PoemURL="https://muse.mmlab.com.tw/sea";
const IslandDataURL="./data/ocean_data.json";

Vue.use(Vuex);
Vue.use(VueAxios,axios);



const store=new Vuex.Store({
	state:{
		location:'',
		poem:[],
		generating:false,
		island:[]
	},
	mutations:{
		setWeatherText(state,set){
			state.poem=[];
			for(var i in set){
				state.poem.push({
					text:set[i]
				});
			}
		},
		setLocation(state,data){
			state.location=data.loc;
		},
		setPoem(state,set){

			for(var i in state.poem){
				var tmp_={
					text:state.poem[i].text,
					poem:set[i].replace(state.poem[i].text,'')
				};
				state.poem.splice(i,1,tmp_);
			}
		},
		setGenerating(state,set){
			state.generating=set;			
		},
		clearPoem(state){
			for(var i in state.poem){
				var tmp_={
					text:state.poem[i].text
				};
				state.poem.splice(i,1,tmp_);
			}
		},
		setIslandData(state,info){
			state.island=info;
		}
	},
	actions:{
		generatePoem:function({commit}){
			
			commit('setGenerating',true);
			commit('clearPoem');

			var weather_text=[];
			for(var i in this.state.poem){
				weather_text.push(this.state.poem[i].text);
			}

			Vue.axios.post(PoemURL,weather_text)
			.then(res=>{

				console.log('res=> ',res);
				var poem_=res.data.split('#');
				
				commit('setPoem',poem_);				
				commit('setGenerating',false);
			
			}).catch(error=>{
					console.log(error);
			});

		},
		fetchIslandData:function({commit}){
			Vue.axios.get(IslandDataURL).then(res=>{

				var data=[];
				// var w=res.data.main.w;
				var h=res.data.main.h/2;
				for(var i in res.data.ocean){
					let ocean=res.data.ocean[i];
					ocean.x/=h;
					ocean.y/=h;
					ocean.w/=h;
					ocean.h/=h;
					ocean.index=i;
					data.push(ocean);
				}

				commit('setIslandData',data);
				console.log('load island data!');
			}).catch(err=>{
				console.log(err);
			});			
		}
	},
	getters:{
		getWeatherText:function(state){
			return state.weather_text;
		},
		getPoem:function(state){
			return state.poem;
		},
		getIslandPosition:(state)=>(index)=>{
			var w=window.innerWidth;
			var h=window.innerHeight;
			var rad=h*.4;
			return{
				x:(w/2+state.island[index].x*rad),
				y:(h/2+state.island[index].y*rad)
			}
		}
	}

});

export default store;