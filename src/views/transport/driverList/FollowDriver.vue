<template>
  <div :class="isPC ? 'followDriver' : 'followDriver-m'">
    <el-card
      class="baseInfo"
      shadow="never"
    >
      <self-form
        class="base"
        :list-query="listQuery"
        :form-item="formItem"
        label-width="80px"
      />
    </el-card>

    <el-card
      class="record"
      shadow="never"
    >
      <div
        slot="header"
        class="header"
      >
        <div>
          <span class="title_left_border" />
          跟进记录
        </div>
        <div>
          <el-dropdown @command="handleCommand">
            <el-button type="primary">
              司机跟进
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="5">
                成交意向
              </el-dropdown-item>
              <el-dropdown-item :command="6">
                征信通过情况
              </el-dropdown-item>
              <el-dropdown-item :command="7">
                跟车情况
              </el-dropdown-item>
              <el-dropdown-item :command="8">
                其他
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <followItem :lists="lists" />
      <followDialog
        ref="followDialog"
        :type="type"
        :driver-id="driverId"
        @onRefresh="getDriverFollow"
      />
    </el-card>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
import FollowDialog from './components/FollowDialog.vue'
import { SettingsModule } from '@/store/modules/settings'
import FollowItem from './components/FollowItem.vue'
import { DriverFollowFormation } from '@/api/driver'
interface IState {
    [key: string]: any;
}
@Component({
  name: 'FollowDriver',
  components: {
    SelfForm,
    FollowDialog,
    FollowItem
  }
})
export default class extends Vue {
  // 司机id
  private driverId:number|string = ''
  // 表单对象
  private listQuery:IState = {
    name: '',
    code: '',
    phone: '',
    city: '',
    line: '',
    group: '',
    manager: ''
  }
  // 表单数组
  private formItem:any[] = [
    {
      type: 7,
      key: 'name',
      label: '姓名:',
      col: 24,
      tagAttrs: {
        style: {
          fontWeight: 'bold',
          fontSize: '16px'
        }
      }
    },
    {
      type: 7,
      key: 'driverId',
      label: '司机编号:',
      tagAttrs: {
        style: {
          color: '#3DA1FF',
          fontWeight: 'bold'
        }
      }
    },
    {
      type: 7,
      key: 'phone',
      label: '手机号:'
    },
    {
      type: 7,
      key: 'workCityName',
      label: '工作城市:'
    },
    {
      type: 7,
      key: 'busiTypeName',
      label: '业务线:'
    },
    {
      type: 7,
      key: 'gmTeam',
      label: '加盟小组:'
    },
    {
      type: 7,
      key: 'gmIdName',
      label: '加盟经理:'
    }

  ]
  // 跟进列表信息
  lists:any[] = []
  // 司机跟进类型
  private type:string = ''

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  /**
   *司机跟进信息
   */
  async getDriverFollow() {
    try {
      let params = {
        driverId: this.driverId
      }
      let { data: res } = await DriverFollowFormation(params)
      if (res.success) {
        this.listQuery = res.data.driverInfoFormationVOList[0]
        this.lists = res.data.driverFollowFormationVOList || []
      }
    } catch (err) {
      console.log(`get driver info:${err}`)
    }
  }

  /**
   * 司机跟进
   */
  handleCommand(val:string) {
    this.type = val;
    (this.$refs.followDialog as any).openDialog()
  }
  mounted() {
    this.driverId = (this.$route as any).query.id
    this.getDriverFollow()
  }
}
</script>
<style lang="scss" scoped>
  .followDriver {
    .baseInfo {
      margin: 20px;
    }
    .record {
      margin: 20px;
      .header {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
</style>

<style lang="scss" scoped>
  .followDriver-m {
    .baseInfo {
      margin: 0;
      border:none;
    }
    .record {
      margin-top: 4px;
      border:none;
      .header {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
</style>

<style scoped>
  @media screen and (max-width: 700px){
    .followDriver >>> .el-card  {
      margin: 0px;
    }
    .followDriver-m >>> .el-card__body  {
      padding: 0px;
    }
    .followDriver-m >>> ul  {
      margin: 0px;
    }
    .followDriver-m >>> .borderTop{
      border: none;
      padding:15px 20px;
      box-sizing: border-box;
    }
    .followDriver-m >>> .el-card__header{
      border-bottom: 2px solid #f8f9fa;
    }
    .followDriver-m >>> .el-form-item{
      margin-bottom: 0;
    }
  }
  .followDriver >>> .el-form-item {
    margin-bottom: 0px;
  }

  .followDriver >>> .el-form-item__label {
    color: #303133;
    font-size:14px;
    font-weight: 400;
  }

  .record >>> .el-card__header {
    font-weight: bold;
  }
  .record >>> .el-card__header {
    padding: 10px 20px;
  }

</style>
