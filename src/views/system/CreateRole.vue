<template>
  <div :class="isPC ? 'CreateRole' : 'CreateRole-m'">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      :label-width="isPC ? '160px' : '80px'"
    >
      <SectionContainer title="基本信息">
        <el-row>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="角色中文名称"
              prop="name"
            >
              <el-input
                v-model="ruleForm.name"
                placeholder=""
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="角色英文名称"
              prop="name"
            >
              <el-input
                v-model="ruleForm.name"
                placeholder=""
              />
            </el-form-item>
          </el-col>
          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="产品线"
              prop="name"
            >
              <el-select
                v-model="ruleForm.region"
                placeholder="请选择"
              >
                <el-option
                  label="区域一"
                  value="shanghai"
                />
                <el-option
                  label="区域二"
                  value="beijing"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="isPC ? 6 : 24">
            <el-form-item
              label="角色描述"
              prop="name"
            >
              <el-input
                v-model="ruleForm.name2"
                placeholder="请输入"
                maxlength="10"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionContainer>
      <SectionContainer title="角色授权">
        <RoleTree
          :data="data"
          :show-checkbox="true"
        >
          <template slot-scope="{node,data}">
            <span @click="c(node,data)">{{ node.label }}</span>
            <el-radio-group
              v-show="node.checked && node.level !== 1"
              v-model="data.checked"
              class="ml10"
              size="mini"
              @click.stop.native
            >
              <el-radio-button label="上海" />
              <el-radio-button label="北京" />
              <el-radio-button label="广州" />
              <el-radio-button label="深圳" />
            </el-radio-group>
          </template>
        </RoleTree>
        <el-form-item>
          <div class="btn_box">
            <el-button
              type="primary"
              @click="submitForm('ruleForm')"
            >
              提交
            </el-button>
            <el-button @click="resetForm('ruleForm')">
              重置
            </el-button>
          </div>
        </el-form-item>
      </SectionContainer>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm, Input } from 'element-ui'
import SectionContainer from '@/components/SectionContainer/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import { TagsViewModule } from '@/store/modules/tags-view'
import { RoleTree } from './components'

import '@/styles/common.scss'
@Component({
  name: 'CreateRole',
  components: {
    SectionContainer,
    RoleTree
  }
})

export default class extends Vue {
  private isEdit: boolean = false; // 是否是编辑页面
  private id: any = ''
  private ruleForm:any = {
    name: '',
    region: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: ''
  }
  private data:any = [{
    id: 1,
    label: '一级 1',
    children: [{
      id: 4,
      label: '二级 1-1',
      children: [{
        id: 9,
        label: '三级 1-1-1'
      }, {
        id: 10,
        label: '三级 1-1-2'
      }]
    }]
  }, {
    id: 2,
    label: '一级 2',
    children: [{
      id: 5,
      label: '二级 2-1'
    }, {
      id: 6,
      label: '二级 2-2'
    }]
  }, {
    id: 3,
    label: '一级 3',
    children: [{
      id: 7,
      label: '二级 3-1'
    }, {
      id: 8,
      label: '二级 3-2'
    }]
  }]
  private rules:any = {
    name: [
      { required: true, message: '请输入活动名称', trigger: 'blur' },
      { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ],
    region: [
      { required: true, message: '请选择活动区域', trigger: 'change' }
    ],
    date1: [
      { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
    ],
    date2: [
      { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
    ],
    type: [
      { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
    ],
    resource: [
      { required: true, message: '请选择活动资源', trigger: 'change' }
    ],
    desc: [
      { required: true, message: '请填写活动形式', trigger: 'blur' }
    ]
  }
  private cities: Array<string>=['上海', '北京', '广州', '深圳']
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  private submitForm(formName:any) {
    (this.$refs[formName] as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        alert('submit!')
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  private resetForm(formName:any) {
    (this.$refs[formName] as ElForm).resetFields()
  }
  private c(node:any, data:any) {
    console.log(node, data)
  }
  mounted() {
    // this.id = this.$route.query.id
    console.log(this.$route)
    this.isEdit = this.$route.name === 'EditUser'
    // console.log(this.$router)
    // this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    //   confirmButtonText: '确定',
    //   cancelButtonText: '取消',
    //   type: 'warning'
    // }).then(() => {
    //   (TagsViewModule as any).delView(this.$route); // 关闭当前页面
    //   (TagsViewModule as any).delCachedView({ // 删除指定页面缓存（进行刷新操作）
    //     name: 'ClueList'
    //   })
    //   this.$nextTick(() => {
    //     this.$router.push({ name: 'ClueList' })
    //   })
    // })
  }
}
</script>

<style lang="scss" scoped>
.el-select,
.el-date-editor {
  width: auto;
  display: block;
}
.wrap {
  flex-wrap: wrap;
}
.mb10 {
  margin-bottom: 10px;
}
.mr10 {
  margin-right: 10px;
}
.ml10 {
  margin-left: 10px;
}
</style>
<style lang="scss" scope>
.el-collapse-item__content {
  padding-bottom: 0;
}
.el-form-item__label {
  color: #999999;
}
</style>
