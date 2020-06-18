<template>
<div>
      <ocean-item
        v-for="item in ocean_list"
        v-bind:ocean="item"
        v-bind:key="item.locationName"
        v-on:click.native="writePoem(item)"
      >
      </ocean-item>
</div>
</template>

<script>
import Vue from 'vue';
import OceanItem from '../OceanItem.vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios,axios);

const DataURL='https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-A0012-001?Authorization=CWB-7021ACD5-3924-4A8B-8C5F-58BF57C9F18B&downloadType=WEB&format=JSON';

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
	components:{
		OceanItem
	},
	methods:{
		writePoem:function(item){
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
		}
	},
	created:function(){
		let self=this;
		Vue.axios.get(DataURL).then(response=>{
			var location=response.data.cwbopendata.dataset.location;
			self.ocean_list=location;     
		});   
	}

}


</script>