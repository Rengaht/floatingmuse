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
import {Howl} from 'howler';
import OceanCanvas from './components/ocean/OceanCanvas.vue';
import PoemCanvas from './components/poem/PoemCanvas.vue';

export default{
  data(){
    return{
      sound_bgm:null,
      sound_processing:null,
      sound_fadein:null,
      sound_finish:null,
    };
  },
  components:{
    OceanCanvas,
    PoemCanvas
  },
  created:function(){
    // this.$store.dispatch('computePageSize');
    this.$store.dispatch('fetchIslandData');
    this.$store.dispatch('fetchDummyChar');

    this.loadSound();
  },
  methods:{
    setStage:function(set_,index){

        this.$refs._ocean_canvas.setStage(set_,index);
        this.$refs._poem_canvas.setStage(set_);

        this.sound_fadein.stop();
        this.sound_finish.stop();
        if(set_!=='poem') this.sound_processing.stop();
        
    },
    loadSound(){
        this.sound_bgm=new Howl({
          src:['audio/back.wav']
        });
        this.sound_bgm.loop(true);

        this.sound_processing=new Howl({
          src:['audio/processing.wav']
        });
        this.sound_processing.loop(true);

        this.sound_fadein=new Howl({
          src:['audio/fadein.wav']
        });
        // this.sound_fadein.rate(.8);
        this.sound_finish=new Howl({
          src:['audio/finish.wav']
        });
        
    },
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
