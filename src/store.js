import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';
import {IslandPortion,IslandCenter} from './components/ocean/OceanShader.js';

const PoemURL="https://mmlab.tw/muse/sea";
const IslandDataURL="./data/ocean_data.json";
const DummyCharURL="./data/dummy_char.txt";

Vue.use(Vuex);
Vue.use(VueAxios,axios);


function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}
// export const IslandPortion=.35;

const store=new Vuex.Store({
	state:{
		location:'',
		poem:[],
		generating:true,
		ocean:[],
		island:[],
		screenWidth:document.documentElement.clientWidth,
		screenHeight:document.documentElement.clientHeight,
		dummyChar:[],
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

				var str_=set[i].replace(state.poem[i].text,'');

				var concat=(str_[0]!=='\n');
				// console.log('concat= '+concat);

				var poem_=str_.split('\n');
				poem_=poem_.filter(el=>el.length>0);
				
				var tmp_={
					text:state.poem[i].text,
					poem:poem_,
					concat:concat,
				};
				state.poem.splice(i,1,tmp_);
			}

			// console.log(this.state.poem);
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
		setOceanData(state,info){
			state.ocean=info;
		},
		setIslandData(state,data){
			state.island=data;
		},
		setDummyChar(state,data){
			state.dummyChar=data;
		},
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

				// console.log('res=> ',res);
				var poem_=res.data.split('#');

				commit('setPoem',poem_);				
				commit('setGenerating',false);
			
			}).catch(error=>{
				console.log(error);
				// commit('setGenerating',false);

				var poem_=[];
				for(var i=0;i<this.state.poem.length;++i) poem_.push("############");
				commit('setPoem',poem_);				
				commit('setGenerating',false);
			
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

				var island=[];
				for(i in res.data.island){
					let t=res.data.island[i];
					t.x/=h;
					t.y/=h;
					t.w/=h;
					t.h/=h;
					t.index=i;
					t.r/=h;
					island.push(t);
				}				

				commit('setOceanData',data);
				commit('setIslandData',island);
				console.log('load ocean data!');
			}).catch(err=>{
				console.log(err);
			});			
		},
		fetchDummyChar:function({commit}){
			Vue.axios.get(DummyCharURL).then(res=>{


				var data=res.data.split('');
				shuffleArray(data);
				// console.log(data);
				commit('setDummyChar',data);
				console.log('load dummyChars!');
			}).catch(err=>{
				console.log(err);
			});			
		},
	},
	getters:{
		getWeatherText:function(state){
			return state.weather_text;
		},
		getPoem:function(state){
			return state.poem;
		},
		getOceanPosition:(state)=>(index)=>{
			// var w=state.screenWidth;
			var h=state.screenHeight;

			var ratw=h*0.625; //10:16
			var rad=h*IslandPortion;
			return{
				x:(ratw/2+state.ocean[index].x*rad),
				y:(h*IslandCenter+state.ocean[index].y*rad)
			}
		},
		getOceanPositionCanvas:(state)=>(index)=>{
			var w=state.screenWidth;
			var h=state.screenHeight;

			// var ratw=h*0.625;
			var rad=h*IslandPortion;
			return{
				x:(w/2+state.ocean[index].x*rad),
				y:(h*IslandCenter+state.ocean[index].y*rad)
			}
		},
		getIslandPositionCanvas:(state)=>(index)=>{

			if(index<0 || index>=state.island.length){
				return {x:0,y:0,r:0};
			}
			var w=state.screenWidth;
			var h=state.screenHeight;

			// var ratw=h*0.625;
			var rad=h*IslandPortion;
			return{
				x:(w/2+state.island[index].x*rad),
				y:(h*IslandCenter+state.island[index].y*rad),
				r:state.island[index].r,
			}
		},
		getDummyChar:(state)=>(index)=>{
			let t=state.dummyChar[index%state.dummyChar.length];
			// console.log(t);
			return t;
		},
	}

});

export default store;