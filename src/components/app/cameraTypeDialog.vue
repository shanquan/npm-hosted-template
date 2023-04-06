<!--
@author: wang.weili
@since : 2023/02/26
-->
<template>
  <!-- dialog  :show-close="false"-->
  <el-dialog :visible.sync="cameraVisible" width="680px">
    <camera v-if="cameraType==0"></camera>
    <barcode-scanner v-if="cameraType==1"></barcode-scanner>
  </el-dialog>
</template>

<script>
import Camera from '@/components/app/Camera.vue';
import BarcodeScanner from '@/components/app/BarcodeScanner.vue';
export default {
  name: 'CameraTypeDialog',
  props: {
    cameraVisible: {
      type: Boolean,
      default: false
    },
    cameraType: {
      type: Number,
      default: 1
    }
  },
  components: {
    Camera,BarcodeScanner
  }
}
</script>