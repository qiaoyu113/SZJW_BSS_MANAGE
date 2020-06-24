<template>
  <div id="down-tool">
    <svg-icon
      name="down"
      @click="click"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'DownTool'
})
export default class extends Vue {
  private isFullscreen = false

  mounted() {
  }

  beforeDestory() {
  }

  private change() {
  }

  private click() {

  }
}
</script>
