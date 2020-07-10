<template>
  <div class="tenderManage">
    <suggest-container
      :tab="tab"
      :tags="tags"
      :active-name="listQuery.state"
      @handle-query="handleQuery"
    >
      <self-form
        :list-query="listQuery"
        :form-item="formItem"
        label-width="80px"
      >
        <div
          slot="btn1"
          :class="isPC ? 'btnPc' : ''"
        >
          <el-button
            type="primary"
            :class="isPC ? '' : 'btnMobile'"
            name="tendermanage_query_btn"
            size="small"
            @click="handleQueryClick"
          >
            查询
          </el-button>
          <el-button
            :class="isPC ? '' : 'btnMobile'"
            name="tendermanage_reset_btn"
            size="small"
            @click="handleResetClick"
          >
            重置
          </el-button>
        </div>
      </self-form>
    </suggest-container>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfForm from '@/components/base/SelfForm.vue'
import { SettingsModule } from '@/store/modules/settings'
import SelfTable from '@/components/base/SelfTable.vue'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import PitchBox from '@/components/PitchBox/index.vue'
import { unique, getLabel } from '@/utils/index.ts'

interface IState {
    [key: string]: any;
}
interface PageObj {
  page:Number,
  limit:Number,
  total?:Number
}

interface Tab {
  label:String,
  name:String,
  id:Number,
  num?:Number | undefined
}
@Component({
  name: 'TenderManage',
  components: {
    SelfForm,
    SelfTable,
    SuggestContainer,
    PitchBox
  }
})
export default class extends Vue {
  private listLoading:boolean = false
  private tab:Tab[] = [
    {
      label: '全部',
      name: 'all',
      id: 0,
      num: 6
    },
    {
      label: '已上线',
      name: 'tab1',
      id: 1,
      num: 5
    },
    {
      label: '已下线',
      name: 'tab2',
      id: 2,
      num: 1
    }
  ]
  private tags:any[] = []
  private listQuery:IState = {
    state: 'all',
    city: '',
    seller: '',
    carType: '',
    code: '',
    name: '',
    a: '',
    createTime: [],
    startTime: [],
    role: 'all'
  }

  private formItem:any[] = [
    {
      type: 2,
      key: 'city',
      label: '城市',
      tagAttrs: {
        placeholder: '请选择城市'
      },
      options: [
        {
          label: '北京',
          value: 'beijing'
        }
      ]
    },
    {
      type: 1,
      key: 'seller',
      label: '线路销售',
      tagAttrs: {
        placeholder: '请输入线路销售'
      }
    },
    {
      type: 1,
      key: 'carType',
      label: '选择车型',
      tagAttrs: {
        placeholder: '请输入选择车型'
      }
    },
    {
      type: 2,
      key: 'code',
      label: '线路名称/线路编号',
      w: '130px',
      tagAttrs: {
        placeholder: '请输入',
        filterable: true
      },
      options: [
        {
          label: 'a',
          value: 'a'
        },
        {
          label: 'b',
          value: 'b'
        }
      ]
    },
    {
      type: 2,
      key: 'name',
      label: '货主名称',
      tagAttrs: {
        placeholder: '请选择货主名称',
        filterable: true
      },
      options: [
        {
          label: 'tom',
          value: 'tom'
        },
        {
          label: 'jack',
          value: 'jack'
        }
      ]
    },
    {
      type: 2,
      key: 'a',
      label: '是否需要返仓',
      w: '100px',
      tagAttrs: {
        placeholder: '请选择'
      },
      options: [
        {
          label: '全部',
          value: 'all'
        },
        {
          label: '是',
          value: '1'
        },
        {
          label: '否',
          value: '2'
        }
      ]
    },
    {
      type: 3,
      key: 'createTime',
      label: '标书创建时间',
      w: '110px',
      col: 12,
      tagAttrs: {
        placeholder: '请选择'
      }
    },
    {
      type: 3,
      key: 'startTime',
      label: '任务开始时间段',
      w: '110px',
      col: 12,
      tagAttrs: {
        placeholder: '请选择'
      }
    },
    {
      type: 2,
      key: 'role',
      label: '线路角色',
      options: [
        {
          label: '全部',
          value: 'all'
        },
        {
          label: '共享',
          value: 'share'
        },
        {
          label: '专车',
          value: 'car'
        }
      ]
    },
    {
      slot: true,
      col: 24,
      w: '0px',
      type: 'btn1'
    }
  ]
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  /**
   * 删除顶部表单的选项
   */
  handleQuery(value:any, key:any) {
    if (key === 'createTime' || key === 'startTime') {
      this.listQuery[key] = []
    } else {
      this.listQuery[key] = value
    }
  }
  /**
   * 查询
   */
  private handleQueryClick() {
    let blackLists = ['state']
    for (let key in this.listQuery) {
      if (this.listQuery[key] && (this.tags.findIndex(item => item.key === key) === -1) && !blackLists.includes(key)) {
        let name = getLabel(this.formItem, this.listQuery, key)
        if (name) {
          this.tags.push({
            type: 'info',
            name,
            key: key
          })
        }
      }
    }
  }
  /**
   *重置
   */
  private handleResetClick() {
    this.listQuery = {
      state: 'all',
      city: '',
      seller: '',
      carType: '',
      code: '',
      name: '',
      a: '',
      createTime: [],
      startTime: [],
      role: 'all'
    }
  }
}
</script>
<style lang="scss" scoped>
  .tenderManage {
    padding: 20px;
    .btnPc {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-end;
      width: 100%;
    }
    .btnMobile {
      margin-left: 0;
      margin-top: 10px;
      width:100%;
    }
  }
</style>
