<template>
 <div id="app" class="FullScreen">   
    <ocean-canvas ref="_ocean_canvas"></ocean-canvas>   
    <PoemCanvas ref="_poem_canvas"></PoemCanvas> 
    
    <div id="_page" class="CenterWrapper">
    <div class="MainScreen">
    <transition name="page-fade">
      <keep-alive>
        <router-view class="MainPage"></router-view>
      </keep-alive>
    </transition>
    </div>
    </div>

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
    // this.$store.dispatch('computePageSize');
    this.$store.dispatch('fetchIslandData');
    this.$store.dispatch('fetchDummyChar');
  },
  methods:{
    setStage:function(set_,index){

        this.$refs._ocean_canvas.setStage(set_,index);
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
#_page{
  position: absolute;
  top:0;
  left:0;
  right: 0;
  bottom: 0;
}
.page-fade-enter-active,.page-fade-leave-active{
  transition:all $page-transition-time ease;
}
.page-fade-enter-active{
  transition-delay:$page-transition-time;
}
.page-fade-enter,.page-fade-leave-active{
  opacity: 0;
}
.page-fade-enter-to,.page-fade-leave{
  opacity: 1;
}
</style>
