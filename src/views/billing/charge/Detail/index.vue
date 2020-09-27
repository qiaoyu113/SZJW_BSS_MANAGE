<template>
  <div
    class="billingDetailContainer"
    :class="{
      p15: isPC,
      m15: isPC
    }"
  >
    <div class="top">
      <div class="btn">
        <el-button @click.stop="handleBackClick">
          返回
        </el-button>
      </div>
    </div>
    <SectionContainer
      title="SOP信息"
      :md="true"
    >
      <self-form
        :list-query="listQuery"
        :form-item="formItem"
        :m-block="true"
        :pc-col="24"
        label-width="80px"
      />
    </SectionContainer>
    <SectionContainer
      title="扣费标准"
      :md="true"
    >
      <self-form
        :list-query="listQuery"
        :form-item="formItem1"
        :pc-col="24"
        :m-block="true"
        label-width="80px"
      />
    </SectionContainer>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import SelfForm from '@/components/Base/SelfForm.vue'
import SectionContainer from '@/components/SectionContainer/index.vue'

interface IState {
  [key: string]: any;
}
@Component({
  components: {
    SelfForm,
    SectionContainer
  }
})
export default class extends Vue {
  private listQuery:IState = {

  }
  private formItem:any[] = [
    {
      type: 7,
      label: '计费编号:',
      key: 'a'
    },
    {
      type: 7,
      label: '计费类型:',
      key: 'b'
    },
    {
      type: 7,
      label: 'SOP类型:',
      key: 'c'
    },
    {
      type: 7,
      label: 'SOP描述:',
      key: 'd'
    },
    {
      type: 7,
      label: '加盟类型:',
      key: 'e'
    },
    {
      type: 7,
      label: '备注:',
      key: 'remark'
    }
  ];
  private formItem1:any[] = [
    {
      type: 7,
      label: '扣款类型:',
      key: 'f'
    },
    {
      type: 7,
      label: '固定金额:',
      key: 'e'
    }
  ]
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  // 返回
  handleBackClick() {
    this.$router.go(-1)
  }
}
</script>
<style lang="scss" scoped>
  .m15 {
     margin: 15px;
  }
  .billingDetailContainer {
    background: #ffffff;
    border-radius: 8px;
    .top {
      margin-bottom: 10px;
      .btn {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-end;
      }
    }
  }
</style>

<style scoped>
  @media screen and (max-width: 700px) {
    .billingDetailContainer >>> .el-form {
      padding: 0px 10px;
    }
  }
</style>
