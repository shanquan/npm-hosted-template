<!--
@author: wang.weili
@since : 2022/01/26
@ref: https://github.com/serratus/quaggaJS
@demo: https://serratus.github.io/quaggaJS/examples/live_w_locator.html
-->
<template>
  <div id="barcodeScanner"></div>
</template>

<script>
import Quagga from 'quagga';
export default {
  name: 'barcodeScanner',
  props: {
    readers: {
      type: Array,
      default: ()=>["code_128_reader"]
    }
  },
  mounted(){
    Quagga.init({
      inputStream : {
        name : "Live",
        type : "LiveStream",
        target: document.querySelector('#barcodeScanner')    // Or '#yourElement' (optional)
      },
      decoder : {
        readers : this.readers
      },
      locator: {
          patchSize: "medium",
          halfSample: true
      },
      numOfWorkers: 2,
      frequency: 10,
      locate: true
    }, function(err) {
        if (err) {
            console.log(err);
            return
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
    });
    Quagga.onProcessed(function(result) {
        var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;
        if (result) {
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box) {
                    return box !== result.box;
                }).forEach(function (box) {
                    Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
                });
            }

            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
            }

            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
            }
        }
    });
    Quagga.onDetected(this.onDetected)
  },
  methods:{
    onDetected(result){
      // console.log(result)
      var code = result.codeResult.code;
      // if(code)
      //   this.$root.$emit('detected',code)
    }
  }
}
</script>
<style>
canvas.drawing, canvas.drawingBuffer {
    position: absolute;
    left: 0;
    top: 0;
}
</style>