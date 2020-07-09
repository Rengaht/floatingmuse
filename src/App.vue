<template>
 <div id="app" class="FullScreen">   
    <ocean-canvas ref="_ocean_canvas"></ocean-canvas>    
    <keep-alive>
      <router-view class="MainScreen"></router-view>
    </keep-alive>
  </div>
</template>

<script>

import OceanCanvas from './components/ocean/OceanCanvas.vue';

export default{
  components:{
    OceanCanvas
  },
  created:function(){
    this.$store.dispatch('fetchIslandData');
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
}
</style>
