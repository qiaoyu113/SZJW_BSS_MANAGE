<template>
  <div :class="isPC ? 'CreateRole' : 'CreateRole-m'">
    <SectionContainer title="基本信息">
      <el-row>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="角色中文名称"
            :value="ruleForm.nick"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="角色英文名称"
            :value="ruleForm.name"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="角色描述"
            :value="ruleForm.description || '暂无数据'"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <!-- <DetailItem
            name="职责"
            :value="ruleForm.dutyId"
          /> -->
          <el-cascader
            v-show="false"
            ref="dutyTree"
            v-model="ruleForm.dutyId"
            :options="dutyList"
            :props="{
              label: 'dutyName',
              value: 'id',
              children: 'childDuty'
            }"
            placeholder="请选择职责"
            clearable
          />
          <DetailItem
            name="职责"
            :value="dutyName"
          />
        </el-col>
        <el-col :span="isPC ? 6 : 24">
          <DetailItem
            name="是否同步CRM账号"
            :value="ruleForm.syncCRMAbility ? '否' : '是'"
          />
        </el-col>
      </el-row>
    </SectionContainer>
    <SectionContainer title="角色授权">
      <RoleTree
        ref="tree"
        class="treeLine"
        :data="data"
        :props="defaultProps"
        :disabled="true"
        node-key="id"
        :show-checkbox="true"
        :indent="0"
        :check-strictly="true"
        @check-change="changeCheck"
      >
        <template slot-scope="{node, data}">
          <span>{{ node.label }}</span>
          <el-radio-group
            v-show="
              node.checked &&
                ((node.level !== 1 && data.controlType) || node.level === 3)
            "
            v-model="data.checked"
            disabled
            class="ml10"
            size="mini"
            @click.stop.native
          >
            <el-radio-button
              v-for="(item, index) in scopeList"
              :key="index"
              :label="item.dictValue"
            >
              {{ item.dictLabel }}
            </el-radio-button>
          </el-radio-group>
        </template>
      </RoleTree>
    </SectionContainer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SectionContainer from '@/components/SectionContainer/index.vue'
import DetailItem from '@/components/DetailItem/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import { RoleTree } from './components'

import {
  authorityList,
  getRoleDetail,
  dutyList
} from '@/api/system'

import '@/styles/common.scss'
import '@/styles/tree-line.scss'

@Component({
  name: 'RoleDetails',
  components: {
    SectionContainer,
    RoleTree,
    DetailItem
  }
})
export default class extends Vue {
  private id: any = '';
  private ruleForm: any = {
    name: '',
    nick: '',
    productLine: '',
    description: '',
    syncCRMAbility: ''
  };
  private dutyName: any = '';
  private defaultProps: any = {
    children: 'childAuth',
    label: 'authName'
  };
  private authorityList: any = [];
  private data: any = [];
  private dutyList: any = [];
  private productList: any = [];
  private scopeList: any = [
    {
      dictValue: 4,
      dictLabel: '个人数据'
    },
    {
      dictValue: 3,
      dictLabel: '小组数据'
    },
    {
      dictValue: 5,
      dictLabel: '业务线数据'
    },
    {
      dictValue: 2,
      dictLabel: '城市数据'
    },
    {
      dictValue: 1,
      dictLabel: '大区数据'
    },
    {
      dictValue: 0,
      dictLabel: '全部数据'
    }
  ];
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  // 获取职责列表
  private async getDutyList() {
    const { data } = await dutyList()
    if (data.success) {
      this.dutyList = this.getTreeData(data.data, 'childDuty')
      this.$nextTick(() => {
        // 设置职责
        const item = (this.$refs['dutyTree'] as any).getCheckedNodes()[0]
        if (item) {
          this.dutyName = item.parent.label + '/' + item.label
        } else {
          this.dutyName = '暂无数据'
        }
      })
    } else {
      this.$message.error(data)
    }
  }
  private async getAuth() {
    const { data } = await authorityList()
    if (data.success) {
      this.data = this.traverseTree(data.data)
      const checked = this.authorityList.map((item: any) => item.authorityId);
      (this.$refs['tree'] as any).$refs['roleTree'].setCheckedKeys(checked)
    } else {
      this.$message.error(data)
    }
  }
  private async fetchData() {
    const { data } = await getRoleDetail(Number(this.id))
    if (data.success) {
      this.ruleForm = data.data
      this.authorityList = data.data.authorities || []
    } else {
      this.$message.error(data)
    }
    this.getDutyList()
    this.getAuth()
  }
  // 递归解决children 为空数组
  private getTreeData(data: any, key: string) {
    // 循环遍历json数据
    for (var i = 0; i < data.length; i++) {
      if (data[i][key].length < 1) {
        // children若为空数组，则将children设为undefined
        data[i][key] = undefined
      } else {
        // children若不为空数组，则继续 递归调用 本方法
        this.getTreeData(data[i][key], key)
      }
    }
    return data
  }
  private traverseTree(data: any) {
    var setChecked = (list: any) => {
      for (var i in list) {
        let checked = 4
        if (this.authorityList && this.authorityList.length > 0) {
          const item = this.authorityList.find(
            (d: any) => d.authorityId === list[i].id
          )
          if (item) {
            checked = item.dataScope
          }
        }
        if (list[i].controlType || list[i].authType === 3) {
          list[i].checked = checked
        }
        list[i].disabled = true
        if (list[i].childAuth) {
          setChecked(list[i].childAuth)
        }
      }
    }
    setChecked(data)
    return data
  }
  // 选中事件
  private changeCheck(data: any, checked: any) {
    const id = data.id
    const nodes = (this.$refs['tree'] as any).$refs['roleTree'].store._getAllNodes()
    for (let i = 0; i < nodes.length; i++) {
      const listIds = nodes[i].data.parentsId
        .split(',')
        .map((p: any) => Number(p))
      if (listIds.includes(id)) {
        nodes[i].checked = checked
      }
    }
  }
  mounted() {
    this.id = this.$route.query.id
    this.fetchData()
  }
}
</script>

<style lang="scss" scoped>
.CreateRole {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .btn_box {
    padding-top: 20px;
    box-sizing: border-box;
  }
  ::v-deep{
    .lineHeight label{
      line-height: 1.3
    }
  }

}
.CreateRole-m {
  .btn_box {
    padding: 30px 20px 0 20px;
    box-sizing: border-box;
    .el-button {
      width: 100%;
    }
    .el-button {
      margin: 0 0 20px 0;
    }
  }
}
.CreateRole,
.CreateRole-m {
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
}
</style>
