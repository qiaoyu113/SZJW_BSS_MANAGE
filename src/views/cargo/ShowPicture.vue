<template>
  <div :class="isPC ? 'ShowPicture' : 'ShowPicture-m'">
    123
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'
@Component({
  name: 'ShowPicture',
  components: {}
})
export default class ShowPicture extends Vue {}
</script>
<style lang="scss"></style>
