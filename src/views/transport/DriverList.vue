<template>
  <div class="DriverList">
    司机列表
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

interface IState {
    [key: string]: any;
}

@Component({
  name: 'DriverList'

})
export default class extends Vue {
  listQuery:IState = {
    name: '',
    phone: '',
    carType: '',
    channel: '',
    organization: '',
    followPerson: '',
    onlyCan: '',
    time: []
  }
}
</script>
<style lang="scss" scoped>
</style>
