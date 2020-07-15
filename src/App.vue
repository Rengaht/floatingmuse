<template>
 <div id="app" class="FullScreen">   
    <ocean-canvas ref="_ocean_canvas"></ocean-canvas>   
    <PoemCanvas ref="_poem_canvas"></PoemCanvas> 
    <keep-alive>
      <router-view class="MainScreen"></router-view>
    </keep-alive>
  </div>
</template>

<script>

import OceanCanvas from './components/ocean/OceanCanvas.vue';
import PoemCanvas from './components/poem/PoemCanvas.vue';

export default{
  components:{
    OceanCanvas,
    PoemCanvas
  },
  created:function(){
    this.$store.dispatch('fetchIslandData');
    this.$store.dispatch('fetchDummyChar');
  },
  methods:{
    setStage:function(set_){

        this.$refs._ocean_canvas.setStage(set_);
        this.$refs._poem_canvas.setStage(set_);

    }

  }
}
</script>

<style lang="scss">
@import "./assets/style/common.scss";
@import "./assets/style/global_var.scss";
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC&display=swap');

#app {
  font-family:'Noto Sans TC', sans-serif;
  text-align: center;
  // margin-top: 60px; 
  background:$ocean-blue;
}
</style>
