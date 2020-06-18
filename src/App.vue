<template>
 <div id="app">
    Floating Muse   
    <div>{{date_str}}</div>
    <!-- <button v-on:click="startClick">START</button>  -->
    <div>
      <ocean-item
        v-for="item in ocean_list"
        v-bind:ocean="item"
        v-bind:key="item.locationName"
        v-on:click.native="writePoem(item)"
      >
      </ocean-item>
    </div>
    <div style="white-space:pre">{{poem}}</div>
  </div>
</template>

<script>
import OceanItem from './components/OceanItem.vue';
import Vue from 'vue';
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

const PoemURL="https://muse.mmlab.com.tw/sea";

export default {
  name: 'App',
  components: {
    OceanItem
  },
  data(){
    return{
      date_str:new Date().toLocaleString(),
      ocean_list:[],
      poem:'select a seaside'
    }
  },
  methods:{
    writePoem:function(item){
      let self=this;
      self.poem='waiting...'

      console.log('write a poem for '+item.locationName);
      var text=[];
      for(var i in item.weatherElement){
        var el=item.weatherElement[i];
        var str_=ElementName[el['elementName']]+el['time'][0]['parameter']['parameterName'];
        text.push(str_);
      }
      console.log(text);
      Vue.axios.post(PoemURL,text).then(res=>{
        console.log('res=> ',res);
        // var sentence=res.data.split('\n');
        self.poem=res.data;
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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
