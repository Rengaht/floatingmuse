<template>
<div>
      <div class="HintRegion" id="_map_hint">
		<div>你今天的心情<br>
			想看看哪一片海？</div>
      </div>
       <ocean-item
        v-for="item in island"
        v-bind:ocean="item"
        v-bind:key="item.name"
        v-on:click.native="writePoem(item.index,item.name)"
      >
      </ocean-item>
</div>
</template>

<script>
import Vue from 'vue';
import OceanItem from '../ocean/OceanItem.vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios,axios);


const CWBDataURL='https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-A0012-001?Authorization=CWB-7021ACD5-3924-4A8B-8C5F-58BF57C9F18B&downloadType=WEB&format=JSON';

const ElementName={ 
  'Wx':'天氣',
  'WindDir':'風向',
  'WindSpeed':'風力',
  'WaveHeight':'浪高',
  'WaveType':'海浪'
};

export default{
	data(){
		return{
			ocean_list:[]			
		}
	},
	computed:{
		island(){
			// console.log('get island!');
			return this.$store.state.island;
		}
	},
	components:{
		OceanItem
	},
	methods:{
		writePoem:function(index,name){

			var item;
			for(var k in this.ocean_list){
				if(this.ocean_list[k].locationName===name){
					item=this.ocean_list[k];
					break;
				}
			}

			if(!item){
				console.log('err location: '+name);
				return;
			}
			let self=this;
			self.poem='waiting...'

			console.log('write a poem for '+item.locationName);
			this.$store.commit({type:'setLocation',loc:item.locationName});

			var text=[];
			for(var i in item.weatherElement){
				var el=item.weatherElement[i];
				var str_=ElementName[el['elementName']]+el['time'][0]['parameter']['parameterName'];
				text.push(str_);
			}
			console.log(text);
			this.$store.commit('setWeatherText',text);
			this.$store.dispatch('generatePoem');

			self.$router.push({
				name:'poem',
				params:{
					text:text
				}
			});

			this.$parent.$refs['_ocean_canvas'].goPoem(parseInt(index));
		}
	},
	created:function(){
		let self=this;
		Vue.axios.get(CWBDataURL).then(response=>{
			var location=response.data.cwbopendata.dataset.location;
			self.ocean_list=location;     
		});   		
	},
	mounted(){
		this.$parent.$refs['_ocean_canvas'].goIsland();		
    }

}


</script>
<style scoped lang="scss">
@import "../../assets/style/common.scss";
#_map_hint{
	margin-top:$margin-size;
}

</style>