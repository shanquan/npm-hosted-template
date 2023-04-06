<!--
@author: wang.weili
@since : 2023/03/01
@ref: https://gruhn.github.io/vue-qrcode-reader/demos/ScanSameQrcodeMoreThanOnce.html
-->
<template>
  <qrcode-stream :camera="camera" @decode="onDecode" @init="onInit">
    <div v-show="showScanConfirmation" class="scan-confirmation">
      <img src="img/checkmark.svg" alt="Checkmark" width="128px" />
    </div>
  </qrcode-stream>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'
export default {
  name: 'qrcodeScanner',
  components: { QrcodeStream },
  data () {
    return {
      camera: 'auto',
      showScanConfirmation: false
    }
  },

  methods: {

    async onInit (promise) {
      try {
        await promise
      } catch (e) {
        console.error(e)
      } finally {
        this.showScanConfirmation = this.camera === "off"
      }
    },

    async onDecode (content) {
      this.$emit('decode',content);

      this.pause()
      await this.timeout(500)
      this.unpause()
    },

    unpause () {
      this.camera = 'auto'
    },

    pause () {
      this.camera = 'off'
    },

    timeout (ms) {
      return new Promise(resolve => {
        window.setTimeout(resolve, ms)
      })
    }
  }
}
</script>

<style scoped>
.scan-confirmation {
  position: absolute;
  width: 100%;
  height: 100%;

  background-color: rgba(255, 255, 255, .8);

  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}
</style>