<template>
  <div class="editDialog">
    <SelfDialog
      :visible.sync="showDialog"
      :confirm="confirm"
      width="500px"
      title="取消面试"
      @closed="handleClosedClick"
    >
      <self-form
        ref="driverClueEditDialog"
        :rules="rules"
        :list-query="listQuery"
        :form-item="dialogFormItem"
        size="small"
        label-width="120px"
        class="p15 SuggestForm"
        :pc-col="24"
        @onPass="handlePassClick"
      >
        <template slot="experience">
          <el-input
            v-model="listQuery.experience"
            type="number"
            maxlength="2"
          >
            <template slot="append">
              年
            </template>
          </el-input>
        </template>
        <template slot="age">
          <el-input
            v-model="listQuery.age"
            type="number"
            maxlength="2"
          >
            <template slot="append">
              岁
            </template>
          </el-input>
        </template>
      </self-form>
    </SelfDialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import { GetCityByCode, GetDictionaryList } from '@/api/common'
import { editClue } from '@/api/driver-cloud'
interface IState {
  [key: string]: any;
}
@Component({
  components: {
    SelfDialog,
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: () => {} }) listQuery!:IState
  private showDialog:boolean = false
  private carOptions:IState[] = []; // 车型列表
  private dialogFormItem:any[] = [
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        maxlength: 10
      },
      label: '姓名',
      key: 'driverName'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        maxlength: 11,
        disabled: true
      },
      label: '手机号',
      key: 'phone'
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      },
      options: [
        {
          label: '有',
          value: true
        },
        {
          label: '无',
          value: false
        }
      ],
      label: '是否有车',
      key: 'hasCar',
      col: 12
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      },
      options: this.carOptions,
      w: '0px',
      key: 'carType',
      col: 12
    },
    {
      type: 'experience',
      key: 'experience',
      slot: true,
      label: '货运经验'
    },
    {
      type: 'age',
      key: 'age',
      slot: true,
      label: '年龄'
    },
    {
      type: 1,
      key: 'occupation',
      label: '当前职业',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        maxlength: 10
      }
    },
    {
      type: 1,
      key: 'address',
      label: '现住址',
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 50,
        type: 'textarea',
        rows: 3,
        'show-word-limit': true
      }
    },
    {
      type: 8,
      key: 'city',
      label: '期望工作区域:',
      tagAttrs: {
        'default-expanded-keys': true,
        'default-checked-keys': true,
        'node-key': 'householdProvince',
        placeholder: '期望工作区域',
        props: {
          lazy: true,
          lazyLoad: this.loadWorkCity
        }
      }
    }
  ];
  private rules = {
    city: [
      { required: true, message: '请选择城市', trigger: 'blur' }
    ]
  }
  // 编辑确认按钮
  confirm() {
    (this.$refs.driverClueEditDialog as any).submitForm()
  }
  // 表单验证通过后触发
  handlePassClick(val:boolean) {
    this.editClue()
  }
  // 编辑线索
  async editClue() {
    try {
      let params:IState = {
        ...this.listQuery
      }
      let { data: res } = await editClue(params)
      if (res.success) {
        this.showDialog = false
        this.$message.success('操作成功')
        this.getBaseInfo()
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`edit clue fail:${err}`)
    } finally {
      //
    }
  }

  // 关闭弹框后触发
  handleClosedClick() {
    (this.$refs.driverClueEditDialog as any).resetForm()
  }
  /**
     * 期望工作区域
     */
  async loadWorkCity(node:any, resolve:any) {
    let params:string[] = []
    if (node.level === 0) {
      params = ['100000']
    } else if (node.level === 1) {
      params = ['100000']
      params.push(node.value)
    } else if (node.level === 2) {
      params = ['100000']
      params.push(node.parent.value)
      params.push(node.value)
    }
    try {
      let nodes = await this.loadCityByCode(params)
      resolve(nodes)
    } catch (err) {
      resolve([])
    }
  }
  /**
     * 加载城市
     */
  async loadCityByCode(params:string[]) {
    try {
      let { data: res } = await GetCityByCode(params)
      if (res.success) {
        const nodes = res.data.map(function(item:any) {
          return {
            value: item.code,
            label: item.name,
            leaf: params.length > 2
          }
        })
        return nodes
      }
    } catch (err) {
      console.log(`load city by code fail:${err}`)
    }
  }
  // 获取车型
  async getBaseInfo() {
    try {
      let carLen = this.carOptions.length
      if (carLen > 0) {
        this.carOptions.splice(0, carLen)
      }
      let params = ['Intentional_compartment']
      let { data: res } = await GetDictionaryList(params)
      if (res.success) {
        let cars = res.data.Intentional_compartment.map(function(item:any) {
          return { label: item.dictLabel, value: item.dictValue }
        })

        this.carOptions.push(...cars)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get base info fail:${err}`)
    }
  }
  mounted() {
    if (this.carOptions.length === 0) {
      this.getBaseInfo()
    }
  }
}
</script>
<style  scoped>
  .editDialog >>> .el-input-group__append {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
