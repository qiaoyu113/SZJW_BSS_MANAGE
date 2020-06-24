<template>
  <div class="app-container" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { GetCustomerDetail } from '@/api/customer'

  @Component({
    name: 'CustomerDetail',
    components: {
    }
  })
export default class extends Vue {
    private detail: Object | undefined = {}
    private listLoading = true

    created() {
      let id = this.$route.query.id
      this.getDetail(id)
    }

    private async getDetail(id: string | (string | null)[] | null | undefined) {
      this.listLoading = true
      const { data } = await GetCustomerDetail({ custClueId: id })
      this.detail = data
      setTimeout(() => {
        this.listLoading = false
      }, 0.5 * 1000)
    }
}
</script>

<style lang="scss" scoped>
  .edit-input {
    padding-right: 100px;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
