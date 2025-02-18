<template>
  <el-input type="text" v-model="nameModal" @change="change">
    <template slot="suffix">
      <el-popover ref="popover" placement="bottom" width="250" trigger="hover" popper-class="mult-lang-Input-popover">
        <i class="el-icon-wangluo" slot="reference" v-if="langOptions.length"
          style="font-size:22px;line-height:28px;cursor:pointer;"
          @mouseover="getLangs"></i>

        <el-form label-width="80px">
          <el-form-item v-for="lang,index in langOptions" :key="index" :label="lang.label+':'">
            <el-input type="text" v-model="multLangModel[lang.value]" @change="change" @input="input"></el-input>
          </el-form-item>
        </el-form>
      </el-popover>
    </template>
  </el-input>
   
</template>

<script>
export default {
  name: 'multLangInput',
  model: {
    prop: 'name',
    event: 'change'
  },
  props: {
    name: String,
    nameMultLang: Object
  },
  data() {
    return {
      langOptions: [],
    }
  },
  computed: {
    nameModal: {
      get() {
        return this.name;
      },
      set(val) {
        this.$emit('update:name', val);
      }
    },
    multLangModel: {
      get() {
        return this.nameMultLang;
      },
      set(val) {
        this.$emit('update:nameMultLang', val);
      }
    }
  },
  created() {
    
  },
  watch: {
    '$root.langOptions': {
      handler(options) {
        this.langOptions = options.filter(el=>el.value!='zh-CN')
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    getLangs(event) {
      event.preventDefault()
      event.stopPropagation()
      this.multLangModel = this.multLangModel || {}
      this.langOptions.forEach(el=>{
        this.$set(this.multLangModel, el.value, this.multLangModel[el.value] || '')
      })
      
    },
    change(nVal, oVla) {
      this.$emit('change', nVal, oVla)
    },
    input() {
      // this.$forceUpdate()
    }
  }
}
</script>

<style>
.el-popover.mult-lang-Input-popover {margin-top: 4px !important;box-shadow: 0 2px 12px 0 rgba(0,0,0,0.5);max-height: 500px;overflow: auto;}
</style>