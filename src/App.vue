<template>
 <div id="app" class="FullScreen">   
    <ocean-canvas></ocean-canvas>    
    <router-view class="FullScreen"></router-view>
  </div>
</template>

<script>

import OceanCanvas from './components/OceanCanvas.vue';
export default{
  components:{
    OceanCanvas    
  }
}

</script>

<style lang="scss">
@import "./assets/style/common.scss";
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC&display=swap');

#app {
  font-family:'Noto Sans TC', sans-serif;
  text-align: center;
  // margin-top: 60px; 
}
</style>
