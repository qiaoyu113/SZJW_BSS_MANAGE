<template>
  <div class="driverClueDetailContainer">
    <div class="box">
      <div class="top">
        <el-button
          v-if="[20,30,40].includes(listQuery.status)"
          type="text"
          @click="handleEditClick"
        >
          编辑
        </el-button>
        <el-button
          v-if="[20,30,40].includes(listQuery.status)"
          type="text"
          @click="() => {
            if (btns.length === 0) {
              getBaseInfo()
            }
            showDialog1 = true;
          }"
        >
          添加跟进
        </el-button>
        <el-button
          v-if="[20,30].includes(listQuery.status)"
          type="text"
          @click="() => {
            isInvite = true;
            showDialog2 = true;
          }"
        >
          邀请面试
        </el-button>
        <el-button
          v-if="[40].includes(listQuery.status)"
          type="text"
          @click="() => {
            showDialog3 = true;
          }"
        >
          取消面试
        </el-button>
        <el-button
          v-if="[40].includes(listQuery.status)"
          type="text"
          @click="() => {
            isInvite = false;
            dialogListQuery2.interviewDate = new Date(listQuery.interviewTime);
            showDialog2 = true;
          }"
        >
          调整面试时间
        </el-button>
      </div>
      <div class="table-box">
        <SectionContainer
          v-if="[10,50,60].includes(listQuery.status)"
          title="最近跟进信息"
          :md="true"
        >
          <self-form
            label-position="top"
            :list-query="listQuery"
            :form-item="formItem"
            size="small"
            label-width="100px"
            class="p15 SuggestForm"
            :pc-col="6"
          >
            <template v-slot:remark="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.remark"
                placement="top-start"
              >
                <el-button
                  type="text"
                  class="overflow"
                >
                  {{ scope.row.remark | DataIsNull }}
                </el-button>
              </el-tooltip>
            </template>
            <template v-slot:interviewTime="scope">
              {{ scope.row.interviewTime | parseTime('{y}-{m}-{d} {h}:{i}') }}
            </template>
          </self-form>
        </SectionContainer>
        <SectionContainer
          title="基本信息"
          :md="true"
        >
          <self-form
            label-position="top"
            :list-query="listQuery"
            :form-item="formItem1"
            size="small"
            label-width="100px"
            class="p15 SuggestForm"
            :pc-col="6"
          >
            <template v-slot:haveCar="scope">
              <span v-if="scope.row.haveCar ===1">
                有；{{ scope.row.haveCarName | DataIsNull }}
              </span>
              <span v-else>无</span>
            </template>
            <template v-slot:experience="scope">
              {{ scope.row.experience | DataIsNull }} <template v-if="scope.row.experience">
                年
              </template>
            </template>
            <template v-slot:age="scope">
              {{ scope.row.age | DataIsNull }}<template v-if="scope.row.age">
                岁
              </template>
            </template>
            <template v-slot:followPerson="scope">
              {{ scope.row.followName }} ({{ scope.row.followPhone }})
            </template>
            <template v-slot:prevFollowPerson="scope">
              <template v-if="scope.row.beforeFollowerName || scope.row.beforeFollowerPhone">
                {{ scope.row.beforeFollowerName }} ({{ scope.row.beforeFollowerPhone }})
              </template>
              <template v-else>
                暂无数据
              </template>
            </template>
            <template v-slot:sourceChannelName="scope">
              {{ scope.row.sourceChannelName | DataIsNull }}
            </template>
          </self-form>
        </SectionContainer>
      </div>
    </div>
    <!-- 跟进情况 -->
    <SelfDialog
      :visible.sync="showDialog1"
      :confirm="confirm1"
      width="60%"
      title="跟进情况"
      @closed="handleClosedClick1"
    >
      <self-form
        ref="driverClueDetailDialog1"
        :rules="rules1"
        title=""
        :list-query="dialogListQuery1"
        :form-item="dialogFormItem1"
        size="small"
        label-width="100px"
        class="p15 SuggestForm"
        :pc-col="24"
        @onPass="handlePassClick1"
      >
        <template slot="contactSituation">
          <div class="btnInline">
            <el-button
              v-for="item in btns"
              :key="item.value"
              :type="dialogListQuery1.contactSituation === item.value ? 'primary':''"
              @click="() => {
                dialogListQuery1.contactSituation = item.value
              }"
            >
              {{ item.label }}
            </el-button>
          </div>
        </template>
      </self-form>
    </SelfDialog>
    <!-- 邀请面试 or调整面试时间 -->
    <SelfDialog
      :visible.sync="showDialog2"
      :confirm="confirm2"
      width="500px"
      :title="isInvite ? '邀请面试':'调整面试'"
      @closed="handleClosedClick2"
    >
      <self-form
        ref="driverClueDetailDialog2"
        :rules="rules2"
        :list-query="dialogListQuery2"
        :form-item="dialogFormItem2"
        size="small"
        label-width="100px"
        class="p15 SuggestForm"
        :pc-col="24"
        @onPass="handlePassClick2"
      />
    </SelfDialog>
    <!-- 取消面试 -->
    <SelfDialog
      :visible.sync="showDialog3"
      :confirm="confirm3"
      width="500px"
      title="取消面试"
      @closed="handleClosedClick3"
    >
      <self-form
        ref="driverClueDetailDialog3"
        :rules="rules3"
        :list-query="dialogListQuery3"
        :form-item="dialogFormItem3"
        size="small"
        label-width="100px"
        class="p15 SuggestForm"
        :pc-col="24"
        @onPass="handlePassClick3"
      />
    </SelfDialog>
    <SelfEdit
      ref="editDialog"
      :list-query="form"
      @fresh="getDriverClueDetail"
    />
    <LogList />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SectionContainer from '@/components/SectionContainer/index.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import { GetDriverClueDetail, AddContactInfo, CancelInteview, InvitelInteview, AdjustmentlInteview } from '@/api/driver-cloud'
import SelfDialog from '@/components/SelfDialog/index.vue'
import SelfEdit from './components/EditDriverClue.vue'
import LogList from './components/opLogs.vue'
import { lock, DataIsNull } from '@/utils/index'
import { delayTime } from '@/settings'
import { GetDictionaryList } from '@/api/common'
interface IState {
  [key: string]: any;
}
@Component({
  components: {
    SectionContainer,
    SelfForm,
    SelfDialog,
    SelfEdit,
    LogList
  }
})
export default class extends Vue {
  private showDialog1:boolean = false; // 添加跟进弹框
  private showDialog2:boolean = false; // 邀请面试弹框or调整时间
  private showDialog3:boolean = false; // 取消面试弹框
  private isInvite:boolean = false ; // 是邀请面试还是调整面试
  private form:IState = {
    marketClueId: '',
    name: '',
    phone: '',
    haveCar: 0,
    carType: '',
    experience: '',
    age: '',
    nowProfession: '',
    nowAddress: '',
    city: []
  }; // 编辑
  private listQuery:IState = {
    marketClueId: '',
    contactSituationName: '',
    remark: '',
    interviewTime: '',
    name: '',
    haveCar: 0,
    haveCarName: '',
    carType: '',
    carTypeName: '',
    phone: '',
    experience: '',
    age: '',
    nowAddress: '',
    status: '',
    statusName: '',
    followName: '',
    followPhone: '',
    beforeFollowerName: '',
    beforeFollowerPhone: '',
    busiTypeName: '',
    sourceChannelName: '',
    expectAddressCityName: '',
    city: [],
    occupation: ''
  };
  private formItem:any[] = [
    {
      type: 7,
      label: '联系情况',
      key: 'contactSituationName'
    },
    {
      type: 'remark',
      label: '备注',
      key: 'remark',
      slot: true
    },
    {
      type: 'interviewTime',
      label: '已约面试',
      slot: true
    }
  ];
  private formItem1:any[] = [
    {
      type: 7,
      label: '姓名',
      key: 'name'
    },
    {
      type: 'haveCar',
      label: '是否有车',
      slot: true
    },
    {
      type: 7,
      label: '手机号',
      key: 'phone'
    },
    {
      type: 'experience',
      label: '货运经验',
      key: 'experience',
      slot: true
    },
    {
      type: 'age',
      label: '年龄',
      key: 'age',
      slot: true
    },
    {
      type: 7,
      label: '现住址',
      key: 'nowAddress'
    },
    {
      type: 7,
      label: '状态',
      key: 'statusName'
    },
    {
      type: 'followPerson',
      label: '跟进人',
      key: 'followPerson',
      slot: true
    },
    {
      type: 7,
      label: '线索编号',
      key: 'marketClueId'
    },
    {
      type: 'prevFollowPerson',
      label: '前跟进人',
      key: 'prevFollowPerson',
      slot: true
    },
    {
      type: 7,
      label: '所属业务线',
      key: 'busiTypeName'
    },
    {
      type: 7,
      label: '所属城市',
      key: 'expectAddressCityName'
    },
    {
      type: 'sourceChannelName',
      label: '来源渠道',
      col: 12,
      slot: true
    }
  ]

  private btns:IState[] = []
  private dialogListQuery1:IState = {
    contactSituation: '',
    remark: ''
  }; // 添加跟进表单
  private dialogFormItem1:any[] = [
    {
      type: 'contactSituation',
      key: 'contactSituation',
      label: '联系情况:',
      slot: true
    },
    {
      type: 1,
      key: 'remark',
      label: '备注:',
      tagAttrs: {
        placeholder: '选填，最多输入100个字',
        maxlength: 100,
        type: 'textarea',
        rows: 3,
        'show-word-limit': true
      }
    }
  ]
  // 添加跟进校验
  private rules1:IState = {
    contactInfo: [
      { required: true, message: '请选择联系情况', trigger: 'change' }
    ]
  };
  // 邀请面试表单
  private dialogListQuery2:IState = {
    interviewDate: ''
  };
  // 邀请面试表单容器
  private dialogFormItem2:any[] = [
    {
      type: 9,
      key: 'interviewDate',
      label: '',
      w: '0px',
      tagAttrs: {
        pickerOptions: {
          disabledDate(time:any) {
            return time.getTime() < Date.now() - 86400000
          }
        }
      }
    }
  ];
  // 邀请面试表单校验
  private rules2:IState = {
    interviewDate: [
      { required: true, message: '请选择面试时间', trigger: 'change' }
    ]
  };
  //  取消面试表单
  private dialogListQuery3 = {
    remark: ''
  }
  //  取消面试表单容器
  private dialogFormItem3:any[] = [
    {
      type: 1,
      key: 'remark',
      label: '备注:',
      tagAttrs: {
        placeholder: '请输入取消面试原因,最多100个字',
        maxlength: 100,
        type: 'textarea',
        rows: 3,
        'show-word-limit': true
      }
    }
  ]
  //  取消面试表单校验
  private rules3 = {
    remark: [
      { required: true, message: '请输入取消面试原因', trigger: 'change' }
    ]
  }
  // 获取司机线索详情
  async getDriverClueDetail() {
    try {
      let params:IState = {
        marketClueId: +this.$route.query.id
      }
      let { data: res } = await GetDriverClueDetail(params)
      if (res.success) {
        this.listQuery = { ...this.listQuery, ...res.data }
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get detail fail:${err}`)
    } finally {
      console.log(`finally`)
    }
  }
  // 添加跟进弹框关闭后
  handleClosedClick1() {
    (this.$refs.driverClueDetailDialog1 as any).resetForm()
  }
  // 添加跟进弹框确认
  confirm1() {
    (this.$refs.driverClueDetailDialog1 as any).submitForm()
  }
  // 添加跟进弹框校验通过
  handlePassClick1(val:boolean) {
    this.addContactInfo()
  }
  // 添加跟进-api
  @lock
  async addContactInfo() {
    try {
      let params:IState = {
        marketClueId: this.listQuery.marketClueId,
        remark: this.dialogListQuery1.remark,
        contactSituation: +this.dialogListQuery1.contactSituation
      }
      let { data: res } = await AddContactInfo(params)
      if (res.success) {
        this.showDialog1 = false
        this.$message.success('操作成功')
        setTimeout(() => {
          this.getDriverClueDetail()
        }, delayTime)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`add fail:${err}`)
    } finally {
      //
    }
  }
  // 邀请面试表单弹框关闭
  handleClosedClick2() {
    (this.$refs.driverClueDetailDialog2 as any).resetForm()
  }
  // 邀请面试表单弹框确认
  confirm2() {
    (this.$refs.driverClueDetailDialog2 as any).submitForm()
  }
  // 邀请面试表单弹框确认校验通过
  handlePassClick2(val:boolean) {
    if (this.isInvite) {
      this.invitelInteview()
    } else {
      this.adjustmentlInteview()
    }
  }
  // 调整时间
  @lock
  async adjustmentlInteview() {
    try {
      let params = {
        marketClueId: this.listQuery.marketClueId,
        interviewDate: new Date(this.dialogListQuery2.interviewDate).getTime()
      }
      let { data: res } = await AdjustmentlInteview(params)
      if (res.success) {
        this.showDialog2 = false
        this.$message.success('操作成功')
        setTimeout(() => {
          this.getDriverClueDetail()
        }, delayTime)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`invite fail:${err}`)
    } finally {
      //
    }
  }
  // 邀请面试
  @lock
  async invitelInteview() {
    try {
      let params = {
        marketClueId: this.listQuery.marketClueId,
        interviewDate: this.dialogListQuery2.interviewDate
      }
      let { data: res } = await InvitelInteview(params)
      if (res.success) {
        this.showDialog2 = false
        this.$message.success('操作成功')
        setTimeout(() => {
          this.getDriverClueDetail()
        }, delayTime)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`invite fail:${err}`)
    } finally {
      //
    }
  }
  // 取消面试弹框
  handleClosedClick3() {
    (this.$refs.driverClueDetailDialog3 as any).resetForm()
  }
  // 取消面试弹框确认
  confirm3() {
    (this.$refs.driverClueDetailDialog3 as any).submitForm()
  }
  // 取消面试弹框确认校验通过
  handlePassClick3(val:boolean) {
    this.cancelInteview()
  }
  // 取消面试
  @lock
  async cancelInteview() {
    try {
      let params:IState = {
        marketClueId: this.listQuery.marketClueId,
        remark: this.dialogListQuery3.remark
      }
      let { data: res } = await CancelInteview(params)
      if (res.success) {
        this.showDialog3 = false
        this.$message.success('操作成功')
        setTimeout(() => {
          this.getDriverClueDetail()
        }, delayTime)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`cancel interview fail:${err}`)
    } finally {
      //
    }
  }
  // 编辑
  handleEditClick() {
    this.form = {
      ...this.form,
      ...{
        marketClueId: this.listQuery.marketClueId,
        name: this.listQuery.name,
        phone: this.listQuery.phone,
        haveCar: this.listQuery.haveCar,
        carType: this.listQuery.carType,
        experience: this.listQuery.experience,
        age: this.listQuery.age,
        nowProfession: this.listQuery.nowProfession,
        nowAddress: this.listQuery.nowAddress,
        city: [
          this.listQuery.expectAddressCity.toString().slice(0, 2) + '0000',
          this.listQuery.expectAddressCity + '',
          this.listQuery.expectAddressCounty + ''
        ]
      }
    };

    (this.$refs.editDialog as any).showDialog = true
  }
  // 获取联系情况列表
  async getBaseInfo() {
    try {
      let len:number = this.btns.length
      if (len > 0) {
        this.btns.splice(0, len)
      }
      let params = ['driver_clue_contact_situation']
      let { data: res } = await GetDictionaryList(params)
      if (res.success) {
        let contactsOption = res.data.driver_clue_contact_situation.map(function(item:any) {
          return { label: item.dictLabel, value: item.dictValue }
        })

        this.btns.push(...contactsOption)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get base info fail:${err}`)
    }
  }

  mounted() {
    this.getDriverClueDetail()
  }
}
</script>
<style lang="scss" scoped>
  .box{
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    transform: translateZ(0);
    padding: 20px;
  }
  .top {
    display: flex;
    justify-content: flex-end;
  }
  .overflow {
    color:#1d1d1d;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .btnInline {
    display: flex;
    overflow-x: auto;
  }
</style>
