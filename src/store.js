import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';
import {IslandPortion} from './components/ocean/OceanShader.js';

const PoemURL="https://mmlab.tw/muse/sea";
const IslandDataURL="./data/ocean_data.json";
const DummyCharURL="./data/dummy_char.txt";

const PagePadding=.5;

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
		generating:false,
		ocean:[],
		island:[],
		screenWidth:document.documentElement.clientWidth,
		screenHeight:document.documentElement.clientHeight,
		pageWidth:0,//Math.min(document.documentElement.clientWidth,document.documentElement.clientHeight*0.625)*(1-PagePadding/100*2),
		pageHeight:0,//document.documentElement.clientHeight*(1-PagePadding/100*2),
		maskRegion:{},
		pagePadding:PagePadding,
		dummyChar:[],
		timeoutInterval:60000,
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
		setPageSize(state){

			state.screenWidth=document.documentElement.clientWidth;
			state.screenHeight=document.documentElement.clientHeight;

			// let padding=PagePadding/100*state.screenWidth;
			let p=document.getElementsByClassName('MainPage')[0];
			// console.log(p.clientWidth+' , '+p.clientHeight);
			
			state.pageWidth=p.clientWidth;//*(1-PagePadding/100*2);
			// let padding=PagePadding/100*state.pageWidth;

			// state.pageWidth-=padding*2;
			
			state.pageHeight=p.clientHeight;//*(1-PagePadding/100*2);

			// state.pageWidth=document.getElementById('_map').clientWidth;
			// state.pageHeight=document.getElementById('_map').clientHeight;
			
			console.log(state.pageWidth+' , '+state.pageHeight);

			let mw=Math.min(state.pageWidth/0.8,state.pageHeight*IslandPortion);

			let mx=state.screenWidth/2-mw/2;
			let my=state.screenHeight/2-state.pageHeight/2+state.pageHeight*.2;//-mw;
			
			// console.log(mx+" "+my+" "+mw);

			state.maskRegion={
				x:mx,
				y:my,
				w:mw,
			};
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
		computePageSize:function({commit}){
			commit('setPageSize');
		}
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
			// var h=state.pageHeight;
			var px=state.maskRegion.x-(state.screenWidth-state.pageWidth)/2;
			var py=state.maskRegion.y-(state.screenHeight-state.pageHeight)/2;

			// var ratw=h*0.625; //10:16
			var rad=state.maskRegion.w/2;
			return{
				x:(px+rad+state.ocean[index].x*rad),
				y:(py+rad+state.ocean[index].y*rad)
			}
			// return{
			// 	x:(.5+state.ocean[index].x),
			// 	y:(py+IslandCenter+state.ocean[index].y)*100
			// }
		},
		getOceanPositionCanvas:(state)=>(index)=>{
			// var w=state.screenWidth;
			// var h=state.pageHeight;
			// var py=(state.screenHeight-state.pageHeight)/2;

			// console.log('pageHeight= '+state.pageHeight);

			// var ratw=h*0.625;
			var rad=state.maskRegion.w/2;
			return{
				x:(state.maskRegion.x+rad+state.ocean[index].x*rad),
				y:(state.maskRegion.y+rad+state.ocean[index].y*rad)
			}
		},
		getIslandPositionCanvas:(state)=>(index)=>{

			if(index<0 || index>=state.island.length){
				return {x:0,y:0,r:0};
			}
			// var w=state.screenWidth;
			// var h=state.pageHeight;
			// var py=(state.screenHeight-state.pageHeight)/2;

			// var ratw=h*0.625;
			// var rad=h*IslandPortion;
			var rad=state.maskRegion.w/2;
			return{
				x:(state.maskRegion.x+rad+state.island[index].x*rad),
				y:(state.maskRegion.y+rad+state.island[index].y*rad),
				r:state.island[index].r,
			}
		},
		getDummyChar:(state)=>(index)=>{
			let t=state.dummyChar[index%state.dummyChar.length];
			// console.log(t);
			return t;
		},
		getMaskRegion:function(state){
			return state.maskRegion;
		},
		getSleepTimeout:function(state){
			return state.timeoutInterval;
		},
	}

});

export default store;