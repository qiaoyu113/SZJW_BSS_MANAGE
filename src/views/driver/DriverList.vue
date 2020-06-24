<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        width="80"
        align="center"
        label="ID"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="180px"
        align="center"
        label="Date"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="180px"
        align="center"
        label="Author"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column
        width="105px"
        label="Importance"
      >
        <template slot-scope="scope">
          <svg-icon
            v-for="n in +scope.row.importance"
            :key="n"
            name="star"
            class="meta-item__icon"
          />
        </template>
      </el-table-column> -->

      <el-table-column
        class-name="status-col"
        label="Status"
        width="110"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.status | articleStatusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        min-width="300px"
        label="Title"
      >
        <template slot-scope="{row}">
          <router-link
            :to="'/example/edit/'+row.id"
            class="link-type"
          >
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="操作"
        width="120"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="goDetail(scope.row.driverId)"
          >
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { GetDriverList } from '@/api/driver'
import { IArticleData } from '@/api/types'
import { HandlePages } from '@/utils/index'
import Pagination from '@/components/Pagination/index.vue'

  @Component({
    name: 'DriverList',
    components: {
      Pagination
    }
  })
export default class extends Vue {
    private total = 0
    private list: IArticleData[] = []
    private page: Object | undefined = ''
    private listLoading = true
    private listQuery = {
      key: '',
      page: 1,
      limit: 30,
      endDate: '',
      startDate: '',
      state: '',
      joinManagerId: ''
    }

    created() {
      this.getList()
    }

    private async getList() {
      this.listLoading = true
      const { data } = await GetDriverList(this.listQuery)
      if (data.success) {
        this.list = data.data
        data.page = await HandlePages(data.page)
        this.total = data.page.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      }
    }

    private goDetail(id: string | (string | null)[] | null | undefined) {
      this.$router.push({ name: 'DriverDetail', query: { customerId: id } })
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
