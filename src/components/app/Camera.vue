<!--
@author: wang.weili
@since : 2022/01/26
-->
<template>
  <div class="camera">
    <video id="video" :width="width" :height="height" autoplay></video>
    <canvas id="canvas" :width="width" :height="height"></canvas>
  </div>
</template>

<script>
var context,video;
var captInterval;
export default {
  name: 'camera',
  props: {
    width: {
      type: String,
      default: '640'
    },
    height:{
      type: String,
      default: '480'
    }
  },
  mounted(){
    var canvas = document.getElementById('canvas');
    const mediaConfig =  { video: true };
    const errBack = function(e) {
      console.log('An error has occurred!', e)
    };
    context = canvas.getContext('2d');
    video = document.getElementById('video');
    // Put video listeners into place
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(mediaConfig).then((stream)=> {
      //video.src = window.URL.createObjectURL(stream);
      video.srcObject = stream;
                video.play();
                this.startCapture();
            });
        }
        /* Legacy code below! */
        else if(navigator.getUserMedia) { // Standard
          navigator.getUserMedia(mediaConfig, (stream)=> {
            video.src = stream;
            video.play();
            this.startCapture();
          }, errBack);
        } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
          navigator.webkitGetUserMedia(mediaConfig, (stream)=>{
            video.src = window.webkitURL.createObjectURL(stream);
            video.play();
            this.startCapture();
          }, errBack);
        } else if(navigator.mozGetUserMedia) { // Mozilla-prefixed
          navigator.mozGetUserMedia(mediaConfig, (stream)=>{
            video.src = window.URL.createObjectURL(stream);
            video.play();
            this.startCapture();
          }, errBack);
        }
  },
  methods:{
    startCapture(){
      if(captInterval){
        clearInterval(captInterval);
      }
      captInterval = setInterval(()=>{
        context.drawImage(video, 0, 0, Number(this.width), Number(this.height));
      },3000);
    }
  }
}
</script>
<style>
.camera video { border: 1px solid #ccc; display: block; margin: 0 0 20px 0; }
.camera #canvas { margin-top: 20px; border: 1px solid #ccc; display: block; }
</style>
