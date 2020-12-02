<template>
  <div class="driverClueDetailContainer">
    <div class="box">
      <div class="top">
        <el-button type="text">
          编辑
        </el-button>
        <el-button
          type="text"
          @click="() => {
            showDialog1 = true
          }"
        >
          添加跟进
        </el-button>
        <el-button
          type="text"
          @click="() => {
            showDialog2 = true
          }"
        >
          邀请面试
        </el-button>
        <el-button
          type="text"
          @click="() => {
            showDialog3 = true
          }"
        >
          取消面试
        </el-button>
        <el-button
          type="text"
          @click="() => {
            dialogListQuery2.interviewDate = new Date(listQuery.interviewDate)
            showDialog2 = true
          }"
        >
          调整面试时间
        </el-button>
      </div>
      <div class="table-box">
        <SectionContainer
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
                  {{ scope.row.remark }}
                </el-button>
              </el-tooltip>
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
            <template v-slot:hasCar="scope">
              <span v-if="scope.row.hasCar">
                有；{{ scope.row.carTypeName }}
              </span>
              <span v-else>无</span>
            </template>
            <template v-slot:experience="scope">
              {{ scope.row.experience }}年
            </template>
            <template v-slot:age="scope">
              {{ scope.row.age }}岁
            </template>
            <template v-slot:followPerson="scope">
              {{ scope.row.followPerson }} ({{ scope.row.followPersonPhone }})
            </template>
            <template v-slot:prevFollowPerson="scope">
              {{ scope.row.prevFollowPerson }} ({{ scope.row.prevFollowPersonPhone }})
            </template>
            <template v-slot:sourceChannel="scope">
              {{ scope.row.sourceChannelName }} ({{ scope.row.sourceChannelUrl }})
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
      :destroy-on-close="true"
      @closed="handleClosedClick1"
      @onPass="handlePassClick1"
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
      >
        <template slot="contactInfo">
          <el-button
            v-for="item in btns"
            :key="item.value"
            :type="dialogListQuery1.contactInfo === item.value ? 'primary':''"
            @click="() => {
              dialogListQuery1.contactInfo = item.value
            }"
          >
            {{ item.label }}
          </el-button>
        </template>
      </self-form>
    </SelfDialog>
    <!-- 邀请面试 or调整面试时间 -->
    <SelfDialog
      :visible.sync="showDialog2"
      :confirm="confirm2"
      width="500px"
      title="邀请面试"
      :destroy-on-close="true"
      @closed="handleClosedClick2"
      @onPass="handlePassClick2"
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
      />
    </SelfDialog>
    <!-- 取消面试 -->
    <SelfDialog
      :visible.sync="showDialog3"
      :confirm="confirm3"
      width="500px"
      title="取消面试"
      :destroy-on-close="true"
      @closed="handleClosedClick3"
      @onPass="handlePassClick3"
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
      />
    </SelfDialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SectionContainer from '@/components/SectionContainer/index.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import { GetDriverClueDetail } from '@/api/driver-cloud'
import SelfDialog from '@/components/SelfDialog/index.vue'
interface IState {
  [key: string]: any;
}
@Component({
  components: {
    SectionContainer,
    SelfForm,
    SelfDialog
  }
})
export default class extends Vue {
  private showDialog1:boolean = false; // 添加跟进弹框
  private showDialog2:boolean = false; // 邀请面试弹框or调整时间
  private showDialog3:boolean = false; // 取消面试弹框
  private listQuery:IState = {
    contactInfo: '',
    remark: '',
    interviewDate: '',
    driverName: '',
    hasCar: false,
    carTypeName: '',
    phone: '',
    experience: '',
    age: '',
    address: '',
    statusName: '',
    followPerson: '',
    followPersonPhone: '',
    driverClueId: '',
    prevFollowPerson: '',
    prevFollowPersonPhone: '',
    busiTypeName: '',
    sourceChannelName: '',
    sourceChannelUrl: '',
    cityName: ''
  };
  private formItem:any[] = [
    {
      type: 7,
      label: '联系情况',
      key: 'contactInfoName'
    },
    {
      type: 'remark',
      label: '备注',
      key: 'remark',
      slot: true
    },
    {
      type: 7,
      label: '已约面试',
      key: 'interviewDate'
    }
  ];
  private formItem1:any[] = [
    {
      type: 7,
      label: '姓名',
      key: 'driverName'
    },
    {
      type: 'hasCar',
      label: '是否有车',
      key: 'hasCar',
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
      key: 'address'
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
      key: 'driverClueId'
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
      key: 'cityName'
    },
    {
      type: 'sourceChannel',
      label: '来源渠道',
      key: 'sourceChannel',
      col: 12,
      slot: true
    }
  ]

  private btns:IState[] = [
    {
      label: '无意向',
      value: 1
    },
    {
      label: '有意向',
      value: 2
    },
    {
      label: '高意向',
      value: 3
    },
    {
      label: '稍后联系',
      value: 4
    },
    {
      label: '无人接听',
      value: 5
    },
    {
      label: '号码错误',
      value: 6
    }
  ]
  private dialogListQuery1:IState = {
    contactInfo: ''
  }; // 添加跟进表单
  private dialogFormItem1:any[] = [
    {
      type: 'contactInfo',
      key: 'contactInfo',
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
      type: 6,
      key: 'interviewDate',
      label: '',
      w: '0px'
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
      let params:IState = {}
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
    this.showDialog1 = false;
    (this.$refs.driverClueDetailDialog1 as any).resetForm()
    this.dialogListQuery1.contactInfo = ''
  }
  // 添加跟进弹框确认
  confirm1() {
    (this.$refs.driverClueDetailDialog1 as any).submitForm()
  }
  // 添加跟进弹框校验通过
  handlePassClick1(val:boolean) {
    this.getDriverClueDetail()
  }
  // 邀请面试表单弹框关闭
  handleClosedClick2() {
    this.showDialog2 = false;
    (this.$refs.driverClueDetailDialog2 as any).resetForm()
    this.dialogListQuery2.interviewDate = ''
  }
  // 邀请面试表单弹框确认
  confirm2() {
    (this.$refs.driverClueDetailDialog2 as any).submitForm()
  }
  // 邀请面试表单弹框确认校验通过
  handlePassClick2(val:boolean) {
    this.getDriverClueDetail()
  }
  // 取消面试弹框
  handleClosedClick3() {
    this.showDialog3 = false;
    (this.$refs.driverClueDetailDialog3 as any).resetForm()
    this.dialogListQuery3.remark = ''
  }
  // 取消面试弹框确认
  confirm3() {
    (this.$refs.driverClueDetailDialog3 as any).submitForm()
  }
  // 取消面试弹框确认校验通过
  handlePassClick3(val:boolean) {
    this.getDriverClueDetail()
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
</style>
