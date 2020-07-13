<template>
  <div class="tenderDetail">
    <self-form
      :list-query="listQuery"
      :form-item="formItem"
      label-width="120px"
      :pc-col="24"
      :rules="rules"
    >
      <template v-slot:title="{row}">
        <div class="header">
          <span class="title">{{ row.key }}</span>
          <i class="icon" />
        </div>
      </template>
      <template v-slot:expires="{row}">
        {{ row.expires | parseTime('{y}-{m}-{d}') }}
      </template>
      <template
        v-if="type === 'edit'"
        slot="btn"
      >
        <div class="btn">
          <el-button name="tenderEdit_cancel_btn">
            取消
          </el-button>
          <el-button
            type="primary"
            name="tenderEdit_submit_btn"
          >
            提交
          </el-button>
        </div>
      </template>
    </self-form>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import SelfForm from '@/components/base/SelfForm.vue'
@Component({
  name: 'TenderDetail',
  components: {
    SelfForm
  }
})
export default class extends Vue {
  private type = ''
  private listQuery = {
    name: '李小兴',
    carType: '金杯',
    carCode: '京 A12345',
    city: '南京市',
    manager: '运营经理',
    cargoName: 'yijie',
    innerLineName: '北京啊大大多',
    remark: 'qweqeqweqeqweq',
    lineType: '替换型',
    carNum: '1辆',
    location: '北京市XX区',
    expires: Date.now(),
    stability: '2-4个月(一般稳定)',
    selectCarType: '4.2米厢货',
    lineArea: '北京市全区域',
    area: '全区域',
    isRequiredCang: '是',
    isRequiredOrder: '是',
    distributionPoint: '2',
    distributionKio: '60',
    countsByDay: 1,
    workTime: ['03:00-05:00', '07:00-09:00', '10:00-12:00'],
    countByMonth: 30,
    peisong: ['1'],
    way: 'chuanzhan',
    price: '',
    monthPrice: '=32000',
    period: '月结',
    days: '30天',
    goodType: '快递',
    weight: '1-3吨',
    isMove: '是',
    difficult: '无装卸',
    score: 90,
    role: '梧桐专车'
  }

  private formItem = [
    {
      type: 'title',
      slot: true,
      key: '司机信息',
      class: 'bgLabel',
      col: 24
    },
    {
      type: 7,
      key: 'name',
      label: '运力姓名:'
    },
    {
      type: 7,
      key: 'carType',
      label: '车型:'
    },
    {
      type: 7,
      key: 'carCode',
      label: '车牌号:'
    },
    {
      type: 7,
      key: 'city',
      label: '工作城市:'
    },
    {
      type: 7,
      key: 'manager',
      label: '加盟经理:'
    },
    {
      type: 'title',
      slot: true,
      key: '基础信息',
      class: 'bgLabel',
      col: 24
    },
    {
      type: 7,
      key: 'cargoName',
      label: '货主名称:'
    },
    {
      type: 7,
      key: 'innerLineName',
      label: '内部使用线路名称:',
      w: '150px'
    },
    {
      type: 7,
      key: 'remark',
      label: '备注信息/线路描述:',
      w: '140px'
    },
    {
      type: 7,
      key: 'lineType',
      label: '线路类型:'
    },
    {
      type: 7,
      key: 'carNum',
      label: '可上车数:'
    },
    {
      type: 7,
      key: 'location',
      label: '仓库位置:'
    },
    {
      type: 'expires',
      label: '上架有效期(天):',
      w: '150px',
      slot: true
    },
    {
      type: 7,
      key: 'stability',
      label: '线路稳定性:'
    },
    {
      type: 'title',
      slot: true,
      key: '配送信息',
      class: 'bgLabel',
      col: 24
    },
    {
      type: 7,
      key: 'selectCarType',
      label: '选择车型:'
    },
    {
      type: 7,
      key: 'lineArea',
      label: '配送区域:',
      col: 12
    },
    {
      type: 7,
      key: 'area',
      label: '具体区域范围:',
      col: 12
    },
    {
      type: 7,
      key: 'isRequiredCang',
      label: '是否需要返仓:'
    },
    {
      type: 7,
      key: 'isRequiredOrder',
      label: '是否需要返单:'
    },
    {
      type: 7,
      key: 'distributionPoint',
      label: '预计每日平均配送点位数:',
      w: '200px'
    },
    {
      type: 7,
      key: 'distributionKio',
      label: '预计每日平均总公里数(公里):',
      w: '220px'
    },
    {
      type: 'title',
      slot: true,
      key: '结算信息',
      class: 'bgLabel',
      col: 24
    },
    {
      type: 7,
      key: 'countsByDay',
      label: '每日配送趟数:'
    },
    {
      type: 'workTime',
      slot: true,
      label: '预计工作时间:'
    },
    {
      type: 7,
      key: 'countByMonth',
      label: '预计月出车数:'
    },
    {
      type: 5,
      key: 'peisong',
      label: '配送周期:',
      edit: true,
      tagAttrs: {
        disabled: this.type !== 'edit'

      },
      listeners: {
        'change': this.checkBoxChange
      },
      options: [
        {
          label: '全选',
          value: 'all'
        },
        {
          label: '周一',
          value: '1'
        },
        {
          label: '周二',
          value: '2'
        },
        {
          label: '周三',
          value: '3'
        },
        {
          label: '周四',
          value: '4'
        },
        {
          label: '周五',
          value: '5'
        },
        {
          label: '周六',
          value: '6'
        },
        {
          label: '周日',
          value: '7'
        }
      ]
    },
    {
      type: 4,
      key: 'way',
      label: '结算方式:',
      edit: true,
      tagAttrs: {
        disabled: this.type !== 'edit'
      },
      options: [
        {
          value: 'chuanzhan',
          label: '传站'
        },
        {
          value: 'mul',
          label: '多点站'
        }
      ]
    },
    {
      type: 1,
      key: 'price',
      label: '货主单趟报价:',
      edit: true,
      col: 12,
      tagAttrs: {
        type: 'number',
        disabled: this.type !== 'edit',
        style: {
          width: '100px',
          flex: 'none'
        }
      }
    },
    {
      type: 7,
      key: 'monthPrice',
      label: '预计货主月报价:',
      w: '150px',
      col: 12
    },
    {
      type: 7,
      key: 'period',
      label: '结算周期:'
    },
    {
      type: 7,
      key: 'days',
      label: '结算天数:'
    },
    {
      type: 'title',
      slot: true,
      key: '货物信息',
      class: 'bgLabel',
      col: 24
    },
    {
      type: 7,
      key: 'goodType',
      label: '货物类型:'
    },
    {
      type: 7,
      key: 'weight',
      label: '货物总重量:'
    },
    {
      type: 7,
      key: 'isMove',
      label: '是否需要搬运:'
    },
    {
      type: 7,
      key: 'difficult',
      label: '装卸难度:'
    },
    {
      type: 'title',
      slot: true,
      key: '线路角色',
      class: 'bgLabel',
      col: 24
    },
    {
      type: 7,
      key: 'score',
      label: '线路打分:'
    },
    {
      type: 7,
      key: 'role',
      label: '线路角色:'
    },
    {
      type: 'btn',
      key: 'btn',
      w: '0px',
      col: 24
    }
  ]

  private rules={
    cargoName: [
      { required: true }
    ],
    innerLineName: [
      { required: true }
    ],
    lineType: [
      { required: true }
    ],
    carNum: [
      { required: true }
    ],
    location: [
      { required: true }
    ],
    expires: [
      { required: true }
    ],
    stability: [
      { required: true }
    ],
    selectCarType: [
      { required: true }
    ],
    lineArea: [
      { required: true }
    ],
    area: [
      { required: true }
    ],
    isRequiredCang: [
      { required: true }
    ],
    isRequiredOrder: [
      { required: true }
    ],
    distributionPoint: [
      { required: true }
    ],
    distributionKio: [
      { required: true }
    ],
    countsByDay: [
      { required: true }
    ],
    countByMonth: [
      { required: true }
    ],
    peisong: [
      { type: 'array', required: true, message: '请至少选择一个配送周期', trigger: 'change' }
    ],
    way: [
      { required: true, message: '请选择结算方式', blut: ['change'] }
    ],
    price: [
      { required: true, message: '请输入货主单趟报价', blut: ['change', 'blur'] }
    ],
    monthPrice: [
      { required: true }
    ],
    period: [
      { required: true }
    ],
    days: [
      { required: true }
    ],
    goodType: [
      { required: true }
    ],
    weight: [
      { required: true }
    ],
    isMove: [
      { required: true }
    ]
  }

  checkBoxChange() {
    interface Op {
      label:string,
      value:string
    }
    if (this.listQuery.peisong && this.listQuery.peisong.includes('all')) {
      let options:Op[] = []
      for (let i = 0; i < this.formItem.length; i++) {
        if (this.formItem[i].label === '配送周期:') {
          (options as any) = this.formItem[i].options
          break
        }
      }
      this.listQuery.peisong = options.map(item => item.value)
    }
  }

  mounted() {
    if (this.$route.path === '/cargo/tenderEdit') {
      this.formItem.forEach(item => {
        if (item.edit) {
          item.tagAttrs.disabled = false
        }
        this.type = 'edit'
      })
    } else {
      this.type = 'detail'
    }
  }
}
</script>
<style lang="scss" scoped>
  .tenderDetail {
    background: #fff;
    .header {
        width: 100%;
        height: 58px;
        line-height: 58px;
        font-size: 16px;
        color: #4A4A4A;
        font-weight: 500;
        border-bottom: 2px solid #F8F9FA;
        position: relative;
        padding: 0 30px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
      .icon {
        width: 5px;
        height: 17px;
        position: absolute;
        left: 16px;
        top: 4px;
        bottom: 0;
        margin: auto;
        background-image: -webkit-gradient(linear, right top, left top, from(#FF9600), to(#FFB400));
        background-image: linear-gradient(270deg, #FF9600 0%, #FFB400 100%);
        border-radius: 2.5px;
        border-radius: 2.5px;
        display: inline-block;
      }
      .title {
        margin-left: 3px;
        font-size:18px;
        color:#999;
      }
    }
    .btn {
      margin-top: 50px;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: center;
    }
  }
</style>

<style scoped>
   @media screen and (min-width: 700px){
     .tenderDetail {
       margin: 20px 150px;
     }
    }
</style>

<style scoped>
  .tenderDetail >>> .el-form-item  {
    margin-bottom:0px;
  }

  .tenderDetail >>> .bgLabel .el-form-item__content {
    margin-left:0px!important;
    display: flex;
    align-items: center;
  }

</style>
